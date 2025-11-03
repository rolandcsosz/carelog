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

interface MessagePageInfo {
    page: number;
    pageSize: number;
    totalMessages: number;
    totalPages: number;
    messages: Message[];
}

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
        @Query() page: number = 1,
        @Query() pageSize: number = 20,
    ): Promise<MessagePageInfo | ErrorResponse> {
        try {
            if (page < 1) {
                page = 1;
            }

            const messages = await prisma.message.findMany({
                where: { userId: caregiverId },
                orderBy: { time: "asc" },
                skip: (page - 1) * pageSize,
                take: pageSize,
            });

            const total = await prisma.message.count({ where: { userId: caregiverId } });

            const totalPages = Math.ceil(total / pageSize);
            return {
                page,
                pageSize,
                totalMessages: total,
                totalPages,
                messages,
            };
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
    public async sendMessage(@Body() body: SendMessageBody): Promise<SuccessResponse | ErrorResponse> {
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
            await prisma.message.create({
                data: {
                    senderRole: "user",
                    content,
                    time: new Date(),
                    userId: caregiverId,
                    status: "pending",
                },
            });

            this.setStatus(201);
            return successResponse;
        } catch (err: unknown) {
            this.setStatus(500);
            return { error: "Hiba a üzenet küldése során", message: getErrorMessage(err) } as ErrorResponse;
        }
    }
}
