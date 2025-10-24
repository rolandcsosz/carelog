import {
    Get,
    Post,
    Put,
    Delete,
    Route,
    Tags,
    Body,
    Path,
    Response,
    SuccessResponse as TsoaSuccessResponse,
    Controller,
    Security,
} from "tsoa";
import db from "../db.js";
import { getErrorMessage, parseRows } from "../utils.js";
import { Schedule, ErrorResponse, successResponse, SuccessResponse } from "../model.js";

interface ScheduleRequest {
    relationshipId: number;
    date: string;
    startTime: string;
    endTime: string;
}

@Route("schedules")
@Tags("Schedules")
export class ScheduleController extends Controller {
    @Post("/")
    @Security("jwt")
    @TsoaSuccessResponse("201", "Created")
    @Response<ErrorResponse>(400, "Missing fields")
    @Response<ErrorResponse>(500, "Database error")
    public async createSchedule(@Body() body: ScheduleRequest): Promise<Schedule | ErrorResponse> {
        if (!body.relationshipId || !body.date || !body.startTime || !body.endTime) {
            this.setStatus(400);
            return { error: "Hiányzó kötelező mező", message: "" } as ErrorResponse;
        }

        try {
            const result = await db.query(
                "INSERT INTO schedules (relationship_id, date, start_time, end_time) VALUES ($1,$2,$3,$4) RETURNING *",
                [body.relationshipId, body.date, body.startTime, body.endTime],
            );

            const rows = parseRows<Schedule>(result.rows);
            if (!rows.length) {
                this.setStatus(500);
                return { error: "Nem sikerült a beosztás létrehozása", message: "" } as ErrorResponse;
            }

            this.setStatus(201);
            return rows[0];
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba a beosztás létrehozásakor", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("/")
    @Security("jwt")
    @Response<ErrorResponse>(500, "Database error")
    public async getSchedules(): Promise<Schedule[] | ErrorResponse> {
        try {
            const result = await db.query("SELECT * FROM schedules ORDER BY id ASC");
            return parseRows<Schedule>(result.rows);
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("{id}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "Schedule not found")
    @Response<ErrorResponse>(500, "Database error")
    public async getScheduleById(@Path() id: number): Promise<Schedule | ErrorResponse> {
        try {
            const result = await db.query("SELECT * FROM schedules WHERE id=$1", [id]);
            if (!result.rows.length) {
                this.setStatus(404);
                return { error: "Nincs ilyen beosztás", message: "" } as ErrorResponse;
            }
            return parseRows<Schedule>(result.rows)[0];
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Put("{id}")
    @Security("jwt")
    @Response<ErrorResponse>(400, "Missing fields")
    @Response<ErrorResponse>(404, "Schedule not found")
    @Response<ErrorResponse>(500, "Database error")
    public async updateSchedule(
        @Path() id: number,
        @Body() body: ScheduleRequest,
    ): Promise<SuccessResponse | ErrorResponse> {
        if (!body.relationshipId || !body.date || !body.startTime || !body.endTime) {
            this.setStatus(400);
            return { error: "Hiányzó kötelező mező", message: "" } as ErrorResponse;
        }

        try {
            const result = await db.query(
                "UPDATE schedules SET relationship_id=$1, date=$2, start_time=$3, end_time=$4 WHERE id=$5 RETURNING *",
                [body.relationshipId, body.date, body.startTime, body.endTime, id],
            );

            if (!result.rows.length) {
                this.setStatus(404);
                return { error: "Nincs ilyen beosztás", message: "" } as ErrorResponse;
            }

            this.setStatus(200);
            return successResponse;
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Delete("{id}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "Schedule not found")
    @Response<ErrorResponse>(500, "Database error")
    public async deleteSchedule(@Path() id: number): Promise<SuccessResponse | ErrorResponse> {
        try {
            const result = await db.query("DELETE FROM schedules WHERE id=$1 RETURNING id", [id]);
            if (!result.rows.length) {
                this.setStatus(404);
                return { error: "Nincs ilyen beosztás", message: "" } as ErrorResponse;
            }

            this.setStatus(200);
            return successResponse;
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("/caregiver/{caregiverId}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "No schedules found")
    @Response<ErrorResponse>(500, "Database error")
    public async getSchedulesForCaregiver(@Path() caregiverId: number): Promise<Schedule[] | ErrorResponse> {
        try {
            const result = await db.query(
                "SELECT * FROM schedules WHERE relationship_id IN (SELECT relationship_id FROM recipients_caregivers WHERE caregiver_id=$1)",
                [caregiverId],
            );

            if (!result.rows.length) {
                this.setStatus(404);
                return { error: "Nincs beosztás ehhez a gondozóhoz", message: "" } as ErrorResponse;
            }

            return parseRows<Schedule>(result.rows);
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("/recipient/{recipientId}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "No schedules found")
    @Response<ErrorResponse>(500, "Database error")
    public async getSchedulesForRecipient(@Path() recipientId: number): Promise<Schedule[] | ErrorResponse> {
        try {
            const result = await db.query(
                "SELECT * FROM schedules WHERE relationship_id IN (SELECT relationship_id FROM recipients_caregivers WHERE recipient_id=$1)",
                [recipientId],
            );

            if (!result.rows.length) {
                this.setStatus(404);
                return { error: "Nincs beosztás ehhez a gondozotthoz", message: "" } as ErrorResponse;
            }

            return parseRows<Schedule>(result.rows);
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("/caregiver/{caregiverId}/recipient/{recipientId}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "No schedules found")
    @Response<ErrorResponse>(500, "Database error")
    public async getSchedulesForCaregiverAndRecipient(
        @Path() caregiverId: number,
        @Path() recipientId: number,
    ): Promise<Schedule[] | ErrorResponse> {
        try {
            const result = await db.query(
                `SELECT s.* 
                 FROM schedules s
                 JOIN recipients_caregivers rc ON s.relationship_id = rc.relationship_id
                 WHERE rc.caregiver_id = $1 AND rc.recipient_id = $2`,
                [caregiverId, recipientId],
            );

            if (!result.rows.length) {
                this.setStatus(404);
                return {
                    error: "Ennnek a gondozónak nincs beosztása ehhez a gondozotthoz",
                    message: "",
                } as ErrorResponse;
            }

            return parseRows<Schedule>(result.rows);
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }
}
