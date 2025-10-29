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
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";
import { CaregiverWithoutPassword, ErrorResponse, successResponse, SuccessResponse } from "../model.js";
import { getErrorMessage, getErrorCode } from "../utils.js";

const prisma = new PrismaClient();

type CreateCaregiverRequest = {
    name: string;
    email: string;
    phone: string;
    password: string;
};

interface UpdateCaregiverPasswordRequest {
    currentPassword: string;
    newPassword: string;
}

@Route("caregivers")
@Tags("Caregivers")
export class CaregiverController extends Controller {
    @Get("/")
    @Security("jwt")
    @Response<ErrorResponse>(500, "Database error")
    public async getCaregivers(): Promise<CaregiverWithoutPassword[] | ErrorResponse> {
        try {
            const caregivers = await prisma.caregiver.findMany({
                orderBy: { id: "asc" },
                select: { id: true, name: true, email: true, phone: true },
            });
            return caregivers;
        } catch (err) {
            this.setStatus(500);
            return { error: "Adatbázis hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("{id}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "Caregiver not found")
    @Response<ErrorResponse>(500, "Database error")
    public async getCaregiver(@Path() id: string): Promise<CaregiverWithoutPassword | ErrorResponse> {
        try {
            const caregiver = await prisma.caregiver.findUnique({
                where: { id },
                select: { id: true, name: true, email: true, phone: true },
            });

            if (!caregiver) {
                this.setStatus(404);
                return { error: "Nincs ilyen gondozó", message: "" } as ErrorResponse;
            }

            return caregiver;
        } catch (err) {
            this.setStatus(500);
            return { error: "Adatbázis hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Post("/")
    @Security("jwt")
    @TsoaSuccessResponse("201", "Created")
    @Response<ErrorResponse>(400, "Missing fields")
    @Response<ErrorResponse>(500, "Database error")
    public async createCaregiver(
        @Body() body: CreateCaregiverRequest,
    ): Promise<CaregiverWithoutPassword | ErrorResponse> {
        if (!body.name || !body.email || !body.phone || !body.password) {
            this.setStatus(400);
            return { error: "Hiányzó mező", message: "" } as ErrorResponse;
        }

        try {
            const hashedPassword = await bcrypt.hash(body.password, 10);
            const caregiver = await prisma.caregiver.create({
                data: {
                    name: body.name,
                    email: body.email,
                    phone: body.phone,
                    password: hashedPassword,
                },
                select: { id: true, name: true, email: true, phone: true },
            });

            this.setStatus(201);
            return caregiver;
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba a gondozó létrehozásakor", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Put("{id}")
    @Security("jwt")
    @Response<ErrorResponse>(400, "Missing fields")
    @Response<ErrorResponse>(404, "Caregiver not found")
    @Response<ErrorResponse>(500, "Database error")
    public async updateCaregiver(
        @Path() id: string,
        @Body() body: { name: string; email: string; phone: string },
    ): Promise<SuccessResponse | ErrorResponse> {
        if (!body.name || !body.email || !body.phone) {
            this.setStatus(400);
            return { error: "Hiányzó mező", message: "" } as ErrorResponse;
        }

        try {
            await prisma.caregiver.update({
                where: { id },
                data: { name: body.name, email: body.email, phone: body.phone },
            });
            return successResponse;
        } catch (err) {
            if (getErrorCode(err) === "P2025") {
                this.setStatus(404);
                return { error: "Nincs ilyen gondozó", message: "" } as ErrorResponse;
            }
            this.setStatus(500);
            return { error: "Hiba a gondozó frissítésekor", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Put("{id}/password")
    @Security("jwt")
    @Response<ErrorResponse>(400, "Missing fields or invalid password")
    @Response<ErrorResponse>(404, "Caregiver not found")
    @Response<ErrorResponse>(500, "Database error")
    public async updateCaregiverPassword(
        @Path() id: string,
        @Body() body: UpdateCaregiverPasswordRequest,
    ): Promise<SuccessResponse | ErrorResponse> {
        const { currentPassword, newPassword } = body;
        if (!currentPassword || !newPassword) {
            this.setStatus(400);
            return { error: "Hiányzó mező", message: "" } as ErrorResponse;
        }

        try {
            const caregiver = await prisma.caregiver.findUnique({ where: { id } });
            if (!caregiver) {
                this.setStatus(404);
                return { error: "Nincs ilyen gondozó", message: "" } as ErrorResponse;
            }

            const isValid = await bcrypt.compare(currentPassword, caregiver.password);
            if (!isValid) {
                this.setStatus(400);
                return { error: "Helytelen régi jelszó", message: "" } as ErrorResponse;
            }

            const newHash = await bcrypt.hash(newPassword, 10);
            await prisma.caregiver.update({ where: { id }, data: { password: newHash } });

            return { message: "Sikeres jelszó változtatás" } as SuccessResponse;
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Delete("{id}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "Caregiver not found")
    @Response<ErrorResponse>(500, "Database error")
    public async deleteCaregiver(@Path() id: string): Promise<SuccessResponse | ErrorResponse> {
        try {
            await prisma.caregiver.delete({ where: { id } });
            return successResponse;
        } catch (err) {
            if (getErrorCode(err) === "P2025") {
                this.setStatus(404);
                return { error: "Nincs ilyen gondozó", message: "" } as ErrorResponse;
            }
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }
}
