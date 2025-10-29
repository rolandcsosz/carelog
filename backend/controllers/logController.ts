import { Controller, Route, Get, Post, Put, Delete, Body, Path, Response, Tags } from "tsoa";
import elasticClient from "../client.js";
import { getErrorMessage } from "../utils.js";
import { ErrorResponse, successResponse, SuccessResponse } from "../model.js";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

export interface TaskLog {
    subTaskId: string;
    startTime: string; // "HH:mm:ss"
    endTime: string; // "HH:mm:ss"
    done: boolean;
    note?: string;
}

export interface LogEntry {
    id: string;
    date: string; // "yyyy-MM-dd"
    relationshipId: string;
    finished: boolean;
    closed: boolean;
    tasks: TaskLog[];
}

export interface UpdateLogEntry {
    date: string; // "yyyy-MM-dd"
    relationshipId: string;
    finished: boolean;
    closed: boolean;
    tasks: TaskLog[];
}

interface LogCreateResponse {
    id: string;
}

@Route("logs")
@Tags("Logs")
export class LogController extends Controller {
    @Post()
    @Response<ErrorResponse>(500, "Server Error")
    public async createLog(@Body() logEntry: LogEntry): Promise<LogCreateResponse | ErrorResponse> {
        try {
            const result = await elasticClient.index({
                index: "logs",
                body: logEntry,
            });

            const id = result._id;

            await elasticClient.update({
                index: "logs",
                id,
                body: { doc: { id } },
            });

            return { id };
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get()
    @Response<ErrorResponse>(500, "Server Error")
    public async getLogs(): Promise<LogEntry[] | ErrorResponse> {
        try {
            const result = await elasticClient.search<LogEntry>({
                index: "logs",
                query: { match_all: {} },
                size: 1000,
            });

            return result.hits.hits.map((hit) => hit._source).filter((log): log is LogEntry => log !== undefined);
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("{id}")
    @Response<ErrorResponse>(404, "Log not found")
    @Response<ErrorResponse>(500, "Server Error")
    public async getLogById(@Path() id: string): Promise<LogEntry | ErrorResponse> {
        try {
            const result = await elasticClient.search<LogEntry>({
                index: "logs",
                query: { term: { id } },
            });

            const hit = result.hits.hits[0];
            if (!hit?._source) {
                this.setStatus(404);
                return { error: "Nincs ilyen tevékenységnapló", message: "" } as ErrorResponse;
            }

            return hit._source;
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Put("{id}")
    @Response<ErrorResponse>(404, "Log not found")
    @Response<ErrorResponse>(500, "Server Error")
    public async updateLogById(
        @Path() id: string,
        @Body() updatedFields: UpdateLogEntry,
    ): Promise<SuccessResponse | ErrorResponse> {
        if (
            updatedFields.closed === undefined ||
            updatedFields.finished === undefined ||
            !updatedFields.date ||
            !updatedFields.relationshipId ||
            !updatedFields.tasks
        ) {
            this.setStatus(400);
            return { error: "Hiányzó mezők az frissítési kérésben", message: "" } as ErrorResponse;
        }

        try {
            const result = await elasticClient.search<LogEntry>({
                index: "logs",
                query: { term: { id } },
            });

            const hit = result.hits.hits[0];
            if (!hit) {
                this.setStatus(404);
                return { error: "Nincs ilyen tevékenységnapló", message: "" } as ErrorResponse;
            }

            await elasticClient.update({
                index: "logs",
                id: hit._id,
                doc: updatedFields,
            });

            return successResponse;
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Delete("{id}")
    @Response<ErrorResponse>(404, "Log not found")
    @Response<ErrorResponse>(500, "Server Error")
    public async deleteLogById(@Path() id: string): Promise<SuccessResponse | ErrorResponse> {
        try {
            const result = await elasticClient.search<LogEntry>({
                index: "logs",
                query: { term: { id } },
            });

            const hit = result.hits.hits[0];
            if (!hit) {
                this.setStatus(404);
                return { error: "Nincs ilyen tevékenységnapló", message: "" } as ErrorResponse;
            }

            await elasticClient.delete({
                index: "logs",
                id: hit._id,
            });

            return successResponse;
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("open")
    @Response<ErrorResponse>(500, "Server Error")
    public async getOpenLogs(): Promise<LogEntry[] | ErrorResponse> {
        try {
            const result = await elasticClient.search<LogEntry>({
                index: "logs",
                query: { term: { closed: false } },
            });

            return result.hits.hits.map((hit) => hit._source).filter((log): log is LogEntry => log !== undefined);
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("relationship/{recipientId}/{caregiverId}")
    @Response<ErrorResponse>(404, "Relationship not found")
    @Response<ErrorResponse>(500, "Server Error")
    public async getLogsForRecipientCaregiver(
        @Path() recipientId: string,
        @Path() caregiverId: string,
    ): Promise<LogEntry[] | ErrorResponse> {
        try {
            const relationship = await prisma.recipientCaregiverRelationship.findUnique({
                where: {
                    recipientId_caregiverId: { recipientId, caregiverId },
                },
            });

            if (!relationship) {
                this.setStatus(404);
                return { error: "Nincs ilyen kapcsolat", message: "" } as ErrorResponse;
            }

            const result = await elasticClient.search<LogEntry>({
                index: "logs",
                query: { term: { relationshipId: relationship.id } },
            });

            return result.hits.hits.map((hit) => hit._source).filter((log): log is LogEntry => log !== undefined);
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }
}
