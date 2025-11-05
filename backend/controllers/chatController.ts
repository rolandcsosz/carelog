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
    Path,
    Query,
} from "tsoa";
import { PrismaClient } from "@prisma/client";
import { ErrorResponse, SuccessResponse, successResponse } from "../model.js";
import { getErrorMessage } from "../utils.js";

const prisma = new PrismaClient();

interface Message {
    id: string;
    status: string;
    senderRole: string;
    content: string;
    time: Date;
    userId: string;
}

interface SendMessageBody {
    caregiverId: string;
    content: string;
}

@Route("chat")
@Tags("Chat")
export class ChatController extends Controller {
    @Get("{caregiverId}")
    @Security("jwt")
    @Response<ErrorResponse>(500, "Database error")
    public async getChatHistory(
        @Path() caregiverId: string,
        @Query() limit?: number,
        @Query() before?: string,
        @Query() after?: string,
    ): Promise<Message[] | ErrorResponse> {
        try {
            const dateBefore = before ? new Date(before) : undefined;
            const dateAfter = after ? new Date(after) : undefined;

            const messages = await prisma.message.findMany({
                where: {
                    userId: caregiverId,
                    time: { lt: dateBefore, gt: dateAfter },
                },
                orderBy: { time: "desc" },
                take: limit,
            });

            return messages;
        } catch (err: unknown) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Post("/")
    @Security("jwt")
    @TsoaSuccessResponse("201", "Created")
    @Response<ErrorResponse>(400, "Missing fields")
    @Response<ErrorResponse>(404, "Entity not found")
    @Response<ErrorResponse>(500, "Database error")
    public async sendMessage(@Body() body: SendMessageBody): Promise<Message | ErrorResponse> {
        const { caregiverId, content } = body;
        if (!caregiverId || !content) {
            this.setStatus(400);
            return { error: "Hiányzó kötelező mező", message: "" } as ErrorResponse;
        }

        try {
            const caregiver = await prisma.caregiver.findUnique({ where: { id: caregiverId } });

            if (!caregiver) {
                this.setStatus(404);
                return { error: "Nincs ilyen gondozó", message: "" } as ErrorResponse;
            }
            const message = await prisma.message.create({
                data: {
                    senderRole: "user",
                    content,
                    time: new Date(),
                    userId: caregiverId,
                    status: "pending",
                },
            });

            this.setStatus(201);
            return message;
        } catch (err: unknown) {
            this.setStatus(500);
            return { error: "Hiba a üzenet küldése során", message: getErrorMessage(err) } as ErrorResponse;
        }
    }
}
