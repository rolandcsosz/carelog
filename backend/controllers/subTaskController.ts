import {
    Get,
    Post,
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
import { ErrorResponse } from "../model.js";
import { getErrorMessage } from "../utils.js";

const prisma = new PrismaClient();

interface Subtask {
    id: string;
    title: string;
    taskTypeId: string | null;
}

interface CreateSubTaskRequest {
    title: string;
    taskTypeId: string;
}

@Route("subtasks")
@Tags("SubTasks")
export class SubTaskController extends Controller {
    @Post("/")
    @Security("jwt")
    @TsoaSuccessResponse("201", "Created")
    @Response<ErrorResponse>(400, "Missing fields")
    @Response<ErrorResponse>(500, "Database error")
    public async createSubTask(@Body() body: CreateSubTaskRequest): Promise<Subtask | ErrorResponse> {
        if (!body.title || !body.taskTypeId) {
            this.setStatus(400);
            return { error: "Hiányzó kötelező mező", message: "" } as ErrorResponse;
        }

        try {
            const subtask = await prisma.subtask.create({ data: body });
            this.setStatus(201);
            return subtask;
        } catch (err: unknown) {
            this.setStatus(500);
            return { error: "Hiba a tevékenység létrehozásakor", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("/")
    @Security("jwt")
    @Response<ErrorResponse>(500, "Database error")
    public async getSubTasks(): Promise<Subtask[] | ErrorResponse> {
        try {
            return await prisma.subtask.findMany({ orderBy: { title: "asc" } });
        } catch (err: unknown) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("{id}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "Sub-task not found")
    @Response<ErrorResponse>(500, "Database error")
    public async getSubTaskById(@Path() id: string): Promise<Subtask | ErrorResponse> {
        try {
            const subtask = await prisma.subtask.findUnique({ where: { id } });
            if (!subtask) {
                this.setStatus(404);
                return { error: "Nincs ilyen tevékenység", message: "" } as ErrorResponse;
            }
            return subtask;
        } catch (err: unknown) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("/task-type/{taskTypeId}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "No sub-tasks found")
    @Response<ErrorResponse>(500, "Database error")
    public async getSubTasksByTaskType(@Path() taskTypeId: string): Promise<Subtask[] | ErrorResponse> {
        try {
            const subtasks = await prisma.subtask.findMany({ where: { taskTypeId } });
            if (!subtasks.length) {
                this.setStatus(404);
                return { error: "Nincs ilyen típusú tevékenység.", message: "" } as ErrorResponse;
            }
            return subtasks;
        } catch (err: unknown) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }
}
