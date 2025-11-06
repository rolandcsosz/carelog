import {
    Get,
    Post,
    Route,
    Tags,
    Body,
    Response,
    SuccessResponse as TsoaSuccessResponse,
    Controller,
    Security,
} from "tsoa";
import { PrismaClient } from "@prisma/client";
import { ErrorResponse, SuccessResponse, successResponse } from "../model.js";
import { getErrorMessage } from "../utils.js";
import elasticClient from "../client.js";
import { LogEntry } from "./logController.js";
import { z } from "zod";
import { GenerateContentResponse, GoogleGenAI, createPartFromUri } from "@google/genai";

const prisma = new PrismaClient();
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY || "",
});

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d):([0-5]\d)$/;

interface SupportedMimeType {
    id: string;
    type: string;
    googleType: string;
}

interface VoiceConvertingRequest {
    logId: string;
    inputMimeType: string;
    base64Audio: string;
}
const TaskSchema = z.object({
    subTaskId: z.string(),
    startTime: z.string().regex(timeRegex, "Invalid time format, expected HH:mm:ss"),
    endTime: z.string().regex(timeRegex, "Invalid time format, expected HH:mm:ss"),
    done: z.boolean(),
    note: z.string(),
});

const TasksSchema = z.array(TaskSchema);

const base64ToBlob = (base64: string, mimeType: string): Blob => {
    const byteChars = atob(base64);
    const byteNumbers = new Array(byteChars.length);
    for (let i = 0; i < byteChars.length; i++) {
        byteNumbers[i] = byteChars.charCodeAt(i);
    }
    const byteArray = new Uint8Array(byteNumbers);
    return new Blob([byteArray], { type: mimeType });
};

@Route("")
@Tags("Voice Converter")
export class VoiceConverterController extends Controller {
    @Get("/mime-types")
    @Security("jwt")
    @Response<ErrorResponse>(500, "Database error")
    public async getSupportedMimeTypes(): Promise<SupportedMimeType[] | ErrorResponse> {
        try {
            const mimeTypes = await prisma.mimeType.findMany();
            return mimeTypes;
        } catch (err: unknown) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Post("/process-audio")
    @Security("jwt")
    @TsoaSuccessResponse("201", "Created")
    @Response<ErrorResponse>(400, "Missing fields")
    @Response<ErrorResponse>(404, "Entity not found")
    @Response<ErrorResponse>(500, "Database error")
    public async processAudio(@Body() body: VoiceConvertingRequest): Promise<SuccessResponse | ErrorResponse> {
        const { logId, inputMimeType, base64Audio } = body;
        if (!logId || !inputMimeType || !base64Audio) {
            this.setStatus(400);
            return { error: "Hiányzó kötelező mező", message: "" } as ErrorResponse;
        }

        try {
            const types = await prisma.mimeType.findMany({ where: { type: inputMimeType } });
            if (!types || types.length === 0) {
                this.setStatus(404);
                return { error: "Nem támogatott MIME típus", message: "" } as ErrorResponse;
            }

            const result = await elasticClient.search<LogEntry>({
                index: "logs",
                query: { term: { id: logId } },
            });

            const hit = result.hits.hits[0];
            if (!hit?._source) {
                this.setStatus(404);
                return { error: "Nincs ilyen tevékenységnapló", message: "" } as ErrorResponse;
            }

            const log = hit._source;

            const subtasks = await prisma.subtask.findMany({ orderBy: { title: "asc" } });

            if (subtasks.length === 0) {
                this.setStatus(404);
                return { error: "Nincsenek elérhető tevékenységek a naplóhoz", message: "" } as ErrorResponse;
            }

            let voiceToTextResponse: GenerateContentResponse | null = null;

            const file = await ai.files.upload({
                file: base64ToBlob(base64Audio, types[0].type),
                config: { mimeType: types[0].type.split(";")[0] },
            });

            try {
                if (!file.uri) {
                    this.setStatus(500);
                    return { error: "Hiba a fájl feltöltésekor a Google szerverére", message: "" } as ErrorResponse;
                }

                voiceToTextResponse = await ai.models.generateContent({
                    model: "gemini-2.5-flash",
                    contents: [
                        createPartFromUri(file.uri, types[0].type.split(";")[0]),
                        {
                            text: "Transcribe the speech in this audio exactly, including pauses and filler words. The speech is in Hungarian.",
                        },
                    ],
                });
            } catch (error) {
                this.setStatus(500);
                return {
                    error: "Hiba a Google Speech-to-Text API hívásakor",
                    message: getErrorMessage(error),
                } as ErrorResponse;
            }

            if (!voiceToTextResponse) {
                this.setStatus(500);
                return { error: "Üres válasz a Google Speech-to-Text API-tól", message: "" } as ErrorResponse;
            }

            if (!voiceToTextResponse.text) {
                this.setStatus(500);
                return { error: "Nem sikerült szöveget kinyerni a hangfájlból", message: "" } as ErrorResponse;
            }

            let convertResponse: GenerateContentResponse | null = null;

            try {
                convertResponse = await ai.models.generateContent({
                    config: { responseJsonSchema: TasksSchema },
                    model: "gemini-2.5-flash",
                    contents: [
                        {
                            text: `
                            You are a healthcare data analysis assistant.
                            Your goal is to process caregivers' voice-to-text transcriptions and update or extend an existing structured list of subtasks in JSON format.

                            Each task follows this schema:
                            {
                            "subTaskId": "text",
                            "startTime": "HH:mm:ss",
                            "endTime": "HH:mm:ss",
                            "done": boolean,
                            "note": "text"
                            }

                            Inputs you receive:
                            1. A list of all possible subtasks with their IDs and names.
                            2. The caregiver's transcription text.
                            3. An existing list of tasks (may be empty or partially filled).

                            Your job:
                            - Parse the transcription and identify which subtasks are mentioned.
                            - If a task already exists in the initial list, update it with new information (e.g., add times, mark as done, append new notes).
                            - If the transcription describes a new action, append it as a new subtask.
                            - Use the predefined subTaskId list to map names to IDs.
                            - Infer start and end times from context (“before lunch”, “around 10”, “after breakfast”).
                            - If times are unclear, estimate logically based on order and other timestamps.
                            - Determine “done” from context (e.g., “I measured” → done = true, “I will measure” → done = false).
                            - Keep any important medical or contextual information in the note field.
                            - Don't add not important information to the note field. Only important medical or contextual information.
                            - Keep the output as a valid JSON array that represents the updated task list.
                            - Do not include any explanation or text. Output JSON only. Do not include Markdown formatting, code blocks, or any text before or after.
                            `,
                        },
                        {
                            text: `
                            Subtask list:
                            ${JSON.stringify(subtasks)}

                            Initial tasks:
                            ${JSON.stringify(log.tasks || [])}

                            Caregiver transcription:
                            "${voiceToTextResponse.text}"`,
                        },
                    ],
                });
            } catch (error) {
                this.setStatus(500);
                return {
                    error: "Hiba a Google API hívásakor",
                    message: getErrorMessage(error),
                } as ErrorResponse;
            }

            if (!convertResponse) {
                this.setStatus(500);
                return { error: "Üres válasz a Google API-tól", message: "" } as ErrorResponse;
            }

            const parsedResult = TasksSchema.safeParse(JSON.parse(convertResponse.text || "[]"));

            if (!parsedResult.success) {
                this.setStatus(500);
                return {
                    error: "Hiba a feladatok feldolgozásakor",
                    message: JSON.stringify(parsedResult.error.issues),
                } as ErrorResponse;
            }

            const tasksWithValidIds = parsedResult.data.filter((task) =>
                subtasks.some((subtask) => subtask.id === task.subTaskId),
            );

            if (tasksWithValidIds.length === 0) {
                this.setStatus(500);
                return {
                    error: "Nincsenek érvényes feladatok a feldolgozott eredményben",
                    message: "",
                } as ErrorResponse;
            }

            await elasticClient.update({
                index: "logs",
                id: hit._id,
                doc: { tasks: tasksWithValidIds },
                refresh: "wait_for",
            });

            return successResponse;
        } catch (err: unknown) {
            this.setStatus(500);
            return { error: "Hiba a hangfeldolgozás során", message: getErrorMessage(err) } as ErrorResponse;
        }
    }
}
