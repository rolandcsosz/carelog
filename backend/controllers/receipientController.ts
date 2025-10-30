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
import { ErrorResponse, RecipientWithoutPassword, successResponse, SuccessResponse } from "../model.js";
import { getErrorCode } from "../utils.js";

const prisma = new PrismaClient();

type CreateRecipientRequest = {
    name: string;
    email: string;
    phone: string;
    password: string;
    address: string;
    fourHandCareNeeded: boolean;
    caregiverNote: string;
};

type UpdateRecipientRequest = {
    name: string;
    email: string;
    phone: string;
    address: string;
    fourHandCareNeeded: boolean;
    caregiverNote: string;
};

interface UpdateRecipientPasswordRequest {
    currentPassword: string;
    newPassword: string;
}

@Route("recipients")
@Tags("Recipients")
export class RecipientController extends Controller {
    @Get("/")
    @Security("jwt")
    @Response<ErrorResponse>(500, "Database error")
    public async getRecipients(): Promise<RecipientWithoutPassword[] | ErrorResponse> {
        try {
            const recipients = await prisma.recipient.findMany({
                orderBy: { id: "asc" },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                    fourHandCareNeeded: true,
                    caregiverNote: true,
                },
            });
            return recipients;
        } catch (err) {
            this.setStatus(500);
            return {
                error: "Adatbázis hiba",
                message: err instanceof Error ? err.message : String(err),
            } as ErrorResponse;
        }
    }

    @Get("{id}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "Recipient not found")
    @Response<ErrorResponse>(500, "Database error")
    public async getRecipient(@Path() id: string): Promise<RecipientWithoutPassword | ErrorResponse> {
        try {
            const recipient = await prisma.recipient.findUnique({
                where: { id },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                    fourHandCareNeeded: true,
                    caregiverNote: true,
                },
            });
            if (!recipient) {
                this.setStatus(404);
                return { error: "Nincs ilyen gondozott", message: "" } as ErrorResponse;
            }
            return recipient;
        } catch (err) {
            this.setStatus(500);
            return {
                error: "Adatbázis hiba",
                message: err instanceof Error ? err.message : String(err),
            } as ErrorResponse;
        }
    }

    @Post("/")
    @Security("jwt")
    @TsoaSuccessResponse("201", "Created")
    @Response<ErrorResponse>(400, "Missing fields")
    @Response<ErrorResponse>(500, "Database error")
    public async createRecipient(
        @Body() body: CreateRecipientRequest,
    ): Promise<RecipientWithoutPassword | ErrorResponse> {
        if (!body.name || !body.email || !body.phone || !body.address || !body.password || !body.fourHandCareNeeded) {
            this.setStatus(400);
            return { error: "Hiányzó mező", message: "" } as ErrorResponse;
        }

        try {
            const hashedPassword = await bcrypt.hash(body.password, 10);
            const recipient = await prisma.recipient.create({
                data: {
                    ...body,
                    password: hashedPassword,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    phone: true,
                    address: true,
                    fourHandCareNeeded: true,
                    caregiverNote: true,
                },
            });
            this.setStatus(201);
            return recipient;
        } catch (err) {
            this.setStatus(500);
            return {
                error: "Hiba a gondozott létrehozásakor",
                message: err instanceof Error ? err.message : String(err),
            } as ErrorResponse;
        }
    }

    @Put("{id}")
    @Security("jwt")
    @Response<ErrorResponse>(400, "Missing fields")
    @Response<ErrorResponse>(404, "Recipient not found")
    @Response<ErrorResponse>(500, "Database error")
    public async updateRecipient(
        @Path() id: string,
        @Body()
        body: UpdateRecipientRequest,
    ): Promise<SuccessResponse | ErrorResponse> {
        if (!body.name || !body.email || !body.phone || !body.address) {
            this.setStatus(400);
            return { error: "Hiányzó mező", message: "" } as ErrorResponse;
        }

        try {
            await prisma.recipient.update({
                where: { id },
                data: body,
            });
            return successResponse;
        } catch (err: unknown) {
            if (getErrorCode(err) === "P2025") {
                this.setStatus(404);
                return { error: "Nincs ilyen gondozott", message: "" } as ErrorResponse;
            }
            this.setStatus(500);
            return {
                error: "Hiba a gondozott frissítésekor",
                message: err instanceof Error ? err.message : String(err),
            } as ErrorResponse;
        }
    }

    @Put("{id}/password")
    @Security("jwt")
    @Response<ErrorResponse>(400, "Missing fields or invalid password")
    @Response<ErrorResponse>(404, "Recipient not found")
    @Response<ErrorResponse>(500, "Database error")
    public async updateRecipientPassword(
        @Path() id: string,
        @Body() body: UpdateRecipientPasswordRequest,
    ): Promise<SuccessResponse | ErrorResponse> {
        const { currentPassword, newPassword } = body;
        if (!currentPassword || !newPassword) {
            this.setStatus(400);
            return { error: "Hiányzó mező", message: "" } as ErrorResponse;
        }

        try {
            const recipient = await prisma.recipient.findUnique({ where: { id } });
            if (!recipient) {
                this.setStatus(404);
                return { error: "Nincs ilyen gondozott", message: "" } as ErrorResponse;
            }

            const isValid = await bcrypt.compare(currentPassword, recipient.password);
            if (!isValid) {
                this.setStatus(400);
                return { error: "Helytelen régi jelszó", message: "" } as ErrorResponse;
            }

            const newHash = await bcrypt.hash(newPassword, 10);
            await prisma.recipient.update({ where: { id }, data: { password: newHash } });

            return successResponse;
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: err instanceof Error ? err.message : String(err) } as ErrorResponse;
        }
    }

    @Delete("{id}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "Recipient not found")
    @Response<ErrorResponse>(500, "Database error")
    public async deleteRecipient(@Path() id: string): Promise<SuccessResponse | ErrorResponse> {
        try {
            await prisma.recipient.delete({ where: { id } });
            return successResponse;
        } catch (err: unknown) {
            if (getErrorCode(err) === "P2025") {
                this.setStatus(404);
                return { error: "Nincs ilyen gondozott", message: "" } as ErrorResponse;
            }
            this.setStatus(500);
            return { error: "Hiba", message: err instanceof Error ? err.message : String(err) } as ErrorResponse;
        }
    }
}
