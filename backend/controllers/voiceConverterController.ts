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

        const queryStart = Date.now();

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

            const file = await ai.files.upload({
                file: base64ToBlob(base64Audio, types[0].type),
                config: { mimeType: types[0].type.split(";")[0] },
            });

            if (!file.uri) {
                this.setStatus(500);
                return { error: "Hiba a fájl feltöltésekor a Google szerverére", message: "" } as ErrorResponse;
            }

            console.log(`Query time + processing time: ${Date.now() - queryStart} ms`);

            const apiTimeStart = Date.now();

            let convertResponse: GenerateContentResponse | null = null;

            try {
                convertResponse = await ai.models.generateContent({
                    config: { responseJsonSchema: TasksSchema },
                    model: "gemini-2.5-flash",
                    contents: [
                        {
                            text: `
                            Asszisztensként egészségügyi adatfeldolgozást végzel.  
                            Feladatod, hogy a gondozók beszédfelismerésből származó szöveges leiratait feldolgozd, és egy meglévő, strukturált, JSON formátumú részfeladat-listát frissíts vagy bővíts.

                            Minden feladat a következő sémát követi:
                            {
                                "subTaskId": "szöveg",
                                "startTime": "HH:mm:ss",
                                "endTime": "HH:mm:ss",
                                "done": boolean,
                                "note": "szöveg"
                            }

                            A bemeneteid:
                            1. Az összes létező részfeladat listája azonosítókkal és nevekkel.
                            2. A gondozó beszédfelismerésből származó szövege.
                            3. Egy meglévő feladatlista (üres is lehet, vagy részben kitöltött).

                            Feladatod:
                            - Elemezd a szöveget, és azonosítsd, mely részfeladatok szerepelnek benne.
                            - Ha a részfeladat már szerepel a meglévő listában, frissítsd az új információkkal  
                            (pl. adj hozzá időpontokat, jelöld késznek, vagy egészítsd ki a megjegyzést).
                            - Ha a szöveg egy új tevékenységet ír le, add hozzá új részfeladatként.
                            - A megadott subTaskId lista alapján rendeld hozzá a megfelelő azonosítót.
                            - Időpontokat következtess ki a szövegből (pl. „ebéd előtt”, „10 körül”, „reggeli után”).
                            - Ha az időpont nem egyértelmű, következtesd ki logikusan a sorrend és más időadatok alapján.
                            - Állapítsd meg, hogy a feladat el lett-e végezve (pl. „megmértem” → done = true; „meg fogom mérni” → done = false).
                            - Csak lényeges orvosi vagy kontextuális információt adj a „note” mezőhöz.
                            - Ne írj bele jelentéktelen részleteket.
                            - A kimenet egy érvényes JSON tömb legyen, amely a frissített feladatlistát tartalmazza.
                            - Ne adj magyarázatot vagy kiegészítő szöveget.  
                            Csak a JSON legyen a kimenet.  
                            Ne használj Markdown-t, kódblokkokat vagy bármilyen bevezető/záró szöveget.
                            `,
                        },
                        {
                            text: `
                            Subtask list:
                            ${JSON.stringify(subtasks)}

                            Initial tasks:
                            ${JSON.stringify(log.tasks || [])}

                            The caregiver's transcription is contained in the following audio file:`,
                        },
                        createPartFromUri(file.uri, types[0].type.split(";")[0]),
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

            console.log(`Google API processing time: ${Date.now() - apiTimeStart} ms`);

            return successResponse;
        } catch (err: unknown) {
            this.setStatus(500);
            return { error: "Hiba a hangfeldolgozás során", message: getErrorMessage(err) } as ErrorResponse;
        }
    }
}
