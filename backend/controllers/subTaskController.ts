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
import db from "../db.js";
import { getErrorMessage, parseRows } from "../utils.js";
import { SubTask, ErrorResponse } from "../model.js";

interface CreateSubTaskRequest {
    title: string;
    taskTypeId: number;
}

@Route("subtasks")
@Tags("SubTasks")
export class SubTaskController extends Controller {
    @Post("/")
    @Security("jwt")
    @TsoaSuccessResponse("201", "Created")
    @Response<ErrorResponse>(400, "Missing fields")
    @Response<ErrorResponse>(500, "Database error")
    public async createSubTask(@Body() body: CreateSubTaskRequest): Promise<SubTask | ErrorResponse> {
        if (!body.title || !body.taskTypeId) {
            this.setStatus(400);
            return { error: "Hiányzó kötelező mező", message: "" } as ErrorResponse;
        }

        try {
            const result = await db.query("INSERT INTO subTasks (title, taskTypeId) VALUES ($1, $2) RETURNING *", [
                body.title,
                body.taskTypeId,
            ]);

            const rows = parseRows<SubTask>(result.rows);
            if (!rows.length) {
                this.setStatus(500);
                return { error: "Nem sikerült a tevékenység létrehozása", message: "" } as ErrorResponse;
            }

            this.setStatus(201);
            return rows[0];
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba a tevékenység létrehozásakor", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("/")
    @Security("jwt")
    @Response<ErrorResponse>(500, "Database error")
    public async getSubTasks(): Promise<SubTask[] | ErrorResponse> {
        try {
            const result = await db.query("SELECT * FROM subTasks ORDER BY id ASC");
            return parseRows<SubTask>(result.rows);
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("{id}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "Sub-task not found")
    @Response<ErrorResponse>(500, "Database error")
    public async getSubTaskById(@Path() id: number): Promise<SubTask | ErrorResponse> {
        try {
            const result = await db.query("SELECT * FROM subTasks WHERE id = $1", [id]);
            if (!result.rows.length) {
                this.setStatus(404);
                return { error: "Nincs ilyen tevékenység", message: "" } as ErrorResponse;
            }

            const rows = parseRows<SubTask>(result.rows);
            return rows[0];
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("/task-type/{taskTypeId}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "No sub-tasks found")
    @Response<ErrorResponse>(500, "Database error")
    public async getSubTasksByTaskType(@Path() taskTypeId: number): Promise<SubTask[] | ErrorResponse> {
        try {
            const result = await db.query("SELECT * FROM subTasks WHERE taskTypeId = $1", [taskTypeId]);
            if (!result.rows.length) {
                this.setStatus(404);
                return { error: "Nincs ilyen típusú tevékenység.", message: "" } as ErrorResponse;
            }

            return parseRows<SubTask>(result.rows);
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }
}
