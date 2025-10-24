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
import { TaskType, ErrorResponse } from "../model.js";

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
            const result = await db.query("INSERT INTO task_types (type) VALUES ($1) RETURNING *", [body.type]);
            const rows = parseRows<TaskType>(result.rows);

            if (!rows.length) {
                this.setStatus(500);
                return { error: "Nem sikerült a típus létrehozása", message: "" } as ErrorResponse;
            }

            this.setStatus(201);
            return rows[0];
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba a típus létrehozásakor", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("/")
    @Security("jwt")
    @Response<ErrorResponse>(500, "Database error")
    public async getTaskTypes(): Promise<TaskType[] | ErrorResponse> {
        try {
            const result = await db.query("SELECT * FROM task_types ORDER BY id ASC");
            return parseRows<TaskType>(result.rows);
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("{id}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "Task type not found")
    @Response<ErrorResponse>(500, "Database error")
    public async getTaskTypeById(@Path() id: number): Promise<TaskType | ErrorResponse> {
        try {
            const result = await db.query("SELECT * FROM task_types WHERE id = $1", [id]);
            if (!result.rows.length) {
                this.setStatus(404);
                return { error: "Nincs ilyen típus", message: "" } as ErrorResponse;
            }

            const rows = parseRows<TaskType>(result.rows);
            return rows[0];
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }
}
