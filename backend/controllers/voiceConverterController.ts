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

const prisma = new PrismaClient();

const googleApiKey = process.env.GOOGLE_API_KEY || "";
const openAiApiKey = process.env.OPENAI_API_KEY || "";

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

            const googleApiBody = {
                config: {
                    encoding: types[0].googleType,
                    languageCode: "hu-HU",
                    sampleRateHertz: 48000,
                },
                audio: {
                    content: base64Audio,
                },
            };

            const googleResponse = await fetch(`https://speech.googleapis.com/v1/speech:recognize`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${googleApiKey}`,
                },
                body: JSON.stringify(googleApiBody),
            });

            if (!googleResponse.ok) {
                this.setStatus(500);
                return {
                    error: "Hiba a Google Speech-to-Text API hívásakor",
                    message: await googleResponse.text(),
                } as ErrorResponse;
            }

            const googleData = await googleResponse.json();
            const text = googleData.results?.[0]?.alternatives?.[0]?.transcript || "";

            if (!text) {
                this.setStatus(500);
                return { error: "Nem sikerült szöveget kinyerni a hangfájlból", message: "" } as ErrorResponse;
            }

            const openAiResponse = await fetch("https://api.openai.com/v1/chat/completions", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${openAiApiKey}`,
                },
                body: JSON.stringify({
                    model: "gpt-5-nano",
                    messages: [
                        {
                            role: "system",
                            content: `
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
                            - If a task already exists in the initial list, **update it** with new information (e.g., add times, mark as done, append new notes).
                            - If the transcription describes a new action, **append it** as a new subtask.
                            - Use the predefined subTaskId list to map names to IDs.
                            - Infer start and end times from context (“before lunch”, “around 10”, “after breakfast”).
                            - If times are unclear, estimate logically based on order and other timestamps.
                            - Determine “done” from context (e.g., “I measured” → done = true, “I will measure” → done = false).
                            - Keep any important medical or contextual information in the note field.
                            - Keep the output **as a valid JSON array** that represents the updated task list.
                            - Do not include any explanation or text — output JSON only.
                            `,
                        },
                        {
                            role: "user",
                            content: `
                            Subtask list:
                            ${JSON.stringify(subtasks)}

                            Initial tasks:
                            ${JSON.stringify(log.tasks || [])}

                            Caregiver transcription:
                            "${text}"`,
                        },
                    ],
                }),
            });

            if (!openAiResponse.ok) {
                this.setStatus(500);
                return { error: "Hiba az OpenAI API hívásakor", message: await openAiResponse.text() } as ErrorResponse;
            }

            const openAiData = await openAiResponse.json();

            const TaskSchema = z.object({
                subTaskId: z.enum([...subtasks.map((st) => st.id)]),
                startTime: z.string().regex(timeRegex, "Invalid time format (expected HH:mm:ss)"),
                endTime: z.string().regex(timeRegex, "Invalid time format (expected HH:mm:ss)"),
                done: z.boolean(),
                note: z.string().max(500).optional().default(""),
            });

            const TasksSchema = z.array(TaskSchema);
            const parseResult = TasksSchema.safeParse(JSON.parse(openAiData.choices[0].message.content));

            if (!parseResult.success) {
                this.setStatus(500);
                return {
                    error: "Hiba a feladatok feldolgozásakor",
                    message: JSON.stringify(parseResult.error.message),
                } as ErrorResponse;
            }

            await elasticClient.update({
                index: "logs",
                id: hit._id,
                doc: { tasks: parseResult.data },
                refresh: "wait_for",
            });

            return successResponse;
        } catch (err: unknown) {
            this.setStatus(500);
            return { error: "Hiba a hangfeldolgozás során", message: getErrorMessage(err) } as ErrorResponse;
        }
    }
}
