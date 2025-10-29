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
import { ErrorResponse, SuccessResponse, successResponse } from "../model.js";
import { getErrorCode, getErrorMessage } from "../utils.js";

const prisma = new PrismaClient();

interface Todo {
    id: string;
    relationshipId: string | null;
    subtaskId: string;
    sequenceNumber: number;
    done: boolean;
}

interface CreateOrUpdateTodoRequest {
    subtaskId: string;
    relationshipId: string | null;
    sequenceNumber: number;
    done: boolean;
}

@Route("todos")
@Tags("Todos")
export class TodoController extends Controller {
    @Get("/")
    @Security("jwt")
    @Response<ErrorResponse>(500, "Database error")
    public async getTodos(): Promise<Todo[] | ErrorResponse> {
        try {
            const todos = await prisma.todo.findMany({ orderBy: { sequenceNumber: "asc" } });
            return todos;
        } catch (err: unknown) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Post("/")
    @Security("jwt")
    @TsoaSuccessResponse("201", "Created")
    @Response<ErrorResponse>(400, "Missing fields")
    @Response<ErrorResponse>(500, "Database error")
    public async createTodo(@Body() body: CreateOrUpdateTodoRequest): Promise<Todo | ErrorResponse> {
        const { subtaskId, relationshipId, sequenceNumber, done } = body;
        if (!subtaskId || !relationshipId || !sequenceNumber) {
            this.setStatus(400);
            return { error: "Hiányzó kötelező mező", message: "" } as ErrorResponse;
        }

        try {
            const todo = await prisma.todo.create({
                data: {
                    subtaskId,
                    relationshipId,
                    sequenceNumber,
                    done: done ?? false,
                },
            });
            this.setStatus(201);
            return todo;
        } catch (err: unknown) {
            this.setStatus(500);
            return { error: "Hiba a TODO létrehozásakor", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("{id}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "Todo not found")
    @Response<ErrorResponse>(500, "Database error")
    public async getTodo(@Path() id: string): Promise<Todo | ErrorResponse> {
        try {
            const todo = await prisma.todo.findUnique({ where: { id } });
            if (!todo) {
                this.setStatus(404);
                return { error: "Nincs ilyen todo", message: "" } as ErrorResponse;
            }
            return todo;
        } catch (err: unknown) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Put("{id}")
    @Security("jwt")
    @Response<ErrorResponse>(400, "Missing fields")
    @Response<ErrorResponse>(404, "Todo not found")
    @Response<ErrorResponse>(500, "Database error")
    public async updateTodo(
        @Path() id: string,
        @Body() body: CreateOrUpdateTodoRequest,
    ): Promise<SuccessResponse | ErrorResponse> {
        const { subtaskId, relationshipId, sequenceNumber, done } = body;
        if (!subtaskId || !relationshipId || !sequenceNumber) {
            this.setStatus(400);
            return { error: "Hiányzó kötelező mező", message: "" } as ErrorResponse;
        }

        try {
            await prisma.todo.update({
                where: { id },
                data: { subtaskId, relationshipId, sequenceNumber, done: done ?? false },
            });
            return successResponse;
        } catch (err: unknown) {
            if (getErrorCode(err) === "P2025") {
                this.setStatus(404);
                return { error: "Nincs ilyen todo", message: "" } as ErrorResponse;
            }
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Delete("{id}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "Todo not found")
    @Response<ErrorResponse>(500, "Database error")
    public async deleteTodo(@Path() id: string): Promise<SuccessResponse | ErrorResponse> {
        try {
            await prisma.todo.delete({ where: { id } });
            return successResponse;
        } catch (err: unknown) {
            if (getErrorCode(err) === "P2025") {
                this.setStatus(404);
                return { error: "Nincs ilyen todo", message: "" } as ErrorResponse;
            }
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("/relationship/{relationshipId}")
    @Security("jwt")
    @Response<ErrorResponse>(400, "Missing relationshipId")
    @Response<ErrorResponse>(500, "Database error")
    public async getTodosByRelationship(@Path() relationshipId: string): Promise<Todo[] | ErrorResponse> {
        if (!relationshipId) {
            this.setStatus(400);
            return { error: "Hiányzó kötelező mező", message: "" } as ErrorResponse;
        }

        try {
            const todos = await prisma.todo.findMany({
                where: { relationshipId },
                orderBy: { sequenceNumber: "asc" },
            });
            return todos;
        } catch (err: unknown) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }
}
