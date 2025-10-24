import { Controller, Route, Get, Post, Put, Delete, Body, Path, Response, TsoaResponse, Tags } from "tsoa";
import elasticClient from "../client.js";
import db from "../db.js";
import { getErrorMessage } from "../utils.js";
import { ErrorResponse, LogEntry, successResponse, SuccessResponse } from "../model.js";

interface LogCreateResponse {
    id: string;
}

@Route("logs")
@Tags("Logs")
export class LogController extends Controller {
    @Post()
    @Response<Error>(500, "Server Error")
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
    @Response<Error>(500, "Server Error")
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
    @Response<Error>(404, "Log not found")
    @Response<Error>(500, "Server Error")
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
    @Response<Error>(404, "Log not found")
    @Response<Error>(500, "Server Error")
    public async updateLogById(
        @Path() id: string,
        @Body() updatedFields: Partial<LogEntry>,
    ): Promise<SuccessResponse | ErrorResponse> {
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
    @Response<Error>(404, "Log not found")
    @Response<Error>(500, "Server Error")
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
    @Response<Error>(500, "Server Error")
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
    @Response<Error>(404, "Relationship not found")
    @Response<Error>(500, "Server Error")
    public async getLogsForRecipientCaregiver(
        @Path() recipientId: string,
        @Path() caregiverId: string,
    ): Promise<LogEntry[] | ErrorResponse> {
        try {
            const pgResult = await db.query(
                "SELECT relationship_id FROM recipients_caregivers WHERE recipient_id = $1 AND caregiver_id = $2",
                [recipientId, caregiverId],
            );

            if (pgResult.rowCount === 0) {
                this.setStatus(404);
                return { error: "Nincs ilyen kapcsolat", message: "" } as ErrorResponse;
            }

            const relationshipId = pgResult.rows[0].relationship_id;

            const result = await elasticClient.search<LogEntry>({
                index: "logs",
                query: { term: { relationshipId } },
            });

            return result.hits.hits.map((hit) => hit._source).filter(Boolean) as LogEntry[];
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }
}
