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
import { PrismaClient } from "@prisma/client";
import { ErrorResponse, successResponse, SuccessResponse } from "../model.js";
import { getErrorCode, getErrorMessage } from "../utils.js";

const prisma = new PrismaClient();

interface Schedule {
    id: string;
    date: Date;
    relationshipId: string;
    startTime: Date;
    endTime: Date;
}

interface ScheduleRequest {
    date: Date;
    relationshipId: string;
    startTime: Date;
    endTime: Date;
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
            const schedule = await prisma.schedule.create({ data: body });
            this.setStatus(201);
            return schedule;
        } catch (err: unknown) {
            this.setStatus(500);
            return { error: "Hiba a beosztás létrehozásakor", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("/")
    @Security("jwt")
    @Response<ErrorResponse>(500, "Database error")
    public async getSchedules(): Promise<Schedule[] | ErrorResponse> {
        try {
            return await prisma.schedule.findMany({ orderBy: { date: "asc" } });
        } catch (err: unknown) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("{id}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "Schedule not found")
    @Response<ErrorResponse>(500, "Database error")
    public async getSchedule(@Path() id: string): Promise<Schedule | ErrorResponse> {
        try {
            const schedule = await prisma.schedule.findUnique({ where: { id } });
            if (!schedule) {
                this.setStatus(404);
                return { error: "Nincs ilyen beosztás", message: "" } as ErrorResponse;
            }
            return schedule;
        } catch (err: unknown) {
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
        @Path() id: string,
        @Body() body: ScheduleRequest,
    ): Promise<SuccessResponse | ErrorResponse> {
        if (!body.relationshipId || !body.date || !body.startTime || !body.endTime) {
            this.setStatus(400);
            return { error: "Hiányzó kötelező mező", message: "" } as ErrorResponse;
        }

        try {
            await prisma.schedule.update({ where: { id }, data: body });
            return successResponse;
        } catch (err: unknown) {
            if (getErrorCode(err) === "P2025") {
                this.setStatus(404);
                return { error: "Nincs ilyen beosztás", message: "" } as ErrorResponse;
            }
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Delete("{id}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "Schedule not found")
    @Response<ErrorResponse>(500, "Database error")
    public async deleteSchedule(@Path() id: string): Promise<SuccessResponse | ErrorResponse> {
        try {
            await prisma.schedule.delete({ where: { id } });
            return successResponse;
        } catch (err: unknown) {
            if (getErrorCode(err) === "P2025") {
                this.setStatus(404);
                return { error: "Nincs ilyen beosztás", message: "" } as ErrorResponse;
            }
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("/caregiver/{caregiverId}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "No schedules found")
    @Response<ErrorResponse>(500, "Database error")
    public async getSchedulesForCaregiver(@Path() caregiverId: string): Promise<Schedule[] | ErrorResponse> {
        try {
            const schedules = await prisma.schedule.findMany({
                where: { relationship: { caregiverId } },
            });

            if (!schedules.length) {
                this.setStatus(404);
                return { error: "Nincs beosztás ehhez a gondozóhoz", message: "" } as ErrorResponse;
            }

            return schedules;
        } catch (err: unknown) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("/recipient/{recipientId}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "No schedules found")
    @Response<ErrorResponse>(500, "Database error")
    public async getSchedulesForRecipient(@Path() recipientId: string): Promise<Schedule[] | ErrorResponse> {
        try {
            const schedules = await prisma.schedule.findMany({
                where: { relationship: { recipientId } },
            });

            if (!schedules.length) {
                this.setStatus(404);
                return { error: "Nincs beosztás ehhez a gondozotthoz", message: "" } as ErrorResponse;
            }

            return schedules;
        } catch (err: unknown) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("/caregiver/{caregiverId}/recipient/{recipientId}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "No schedules found")
    @Response<ErrorResponse>(500, "Database error")
    public async getSchedulesForCaregiverAndRecipient(
        @Path() caregiverId: string,
        @Path() recipientId: string,
    ): Promise<Schedule[] | ErrorResponse> {
        try {
            const schedules = await prisma.schedule.findMany({
                where: {
                    relationship: {
                        caregiverId,
                        recipientId,
                    },
                },
            });

            if (!schedules.length) {
                this.setStatus(404);
                return {
                    error: "Ennnek a gondozónak nincs beosztása ehhez a gondozotthoz",
                    message: "",
                } as ErrorResponse;
            }

            return schedules;
        } catch (err: unknown) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }
}
