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

interface TaskType {
    id: string;
    type: string;
}

interface CreateTaskTypeRequest {
    type: string;
}

@Route("task_types")
@Tags("TaskTypes")
export class TaskTypeController extends Controller {
    @Post("/")
    @Security("jwt")
    @TsoaSuccessResponse("201", "Created")
    @Response<ErrorResponse>(400, "Missing fields")
    @Response<ErrorResponse>(500, "Database error")
    public async createTaskType(@Body() body: CreateTaskTypeRequest): Promise<TaskType | ErrorResponse> {
        if (!body.type) {
            this.setStatus(400);
            return { error: "Hiányzó kötelező mező", message: "" } as ErrorResponse;
        }

        try {
            const taskType = await prisma.taskType.create({ data: { type: body.type } });
            this.setStatus(201);
            return taskType;
        } catch (err: unknown) {
            this.setStatus(500);
            return { error: "Hiba a típus létrehozásakor", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("/")
    @Security("jwt")
    @Response<ErrorResponse>(500, "Database error")
    public async getTaskTypes(): Promise<TaskType[] | ErrorResponse> {
        try {
            return await prisma.taskType.findMany({ orderBy: { type: "asc" } });
        } catch (err: unknown) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("{id}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "Task type not found")
    @Response<ErrorResponse>(500, "Database error")
    public async getTaskType(@Path() id: string): Promise<TaskType | ErrorResponse> {
        try {
            const taskType = await prisma.taskType.findUnique({ where: { id } });
            if (!taskType) {
                this.setStatus(404);
                return { error: "Nincs ilyen típus", message: "" } as ErrorResponse;
            }
            return taskType;
        } catch (err: unknown) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }
}
