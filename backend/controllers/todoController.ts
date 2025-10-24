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
import db from "../db.js";
import { getErrorMessage, parseRows } from "../utils.js";
import { Todo, ErrorResponse, SuccessResponse, successResponse } from "../model.js";

interface CreateTodoRequest {
    subtaskId: number;
    relationshipId: number;
    sequenceNumber: number;
    done?: boolean;
}

interface UpdateTodoRequest {
    subtaskId: number;
    relationshipId: number;
    sequenceNumber: number;
    done?: boolean;
}

@Route("todos")
@Tags("Todos")
export class TodoController extends Controller {
    @Get("/")
    @Security("jwt")
    @Response<ErrorResponse>(500, "Database error")
    public async getTodos(): Promise<Todo[] | ErrorResponse> {
        try {
            const result = await db.query("SELECT * FROM todo ORDER BY id ASC");
            return parseRows<Todo>(result.rows);
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Post("/")
    @Security("jwt")
    @TsoaSuccessResponse("201", "Created")
    @Response<ErrorResponse>(400, "Missing fields")
    @Response<ErrorResponse>(500, "Database error")
    public async createTodo(@Body() body: CreateTodoRequest): Promise<Todo | ErrorResponse> {
        const { subtaskId, relationshipId, sequenceNumber, done } = body;
        if (!subtaskId || !relationshipId || !sequenceNumber) {
            this.setStatus(400);
            return { error: "Hiányzó kötelező mező", message: "" } as ErrorResponse;
        }

        try {
            const result = await db.query(
                `INSERT INTO todo (subtaskId, relationshipId, sequenceNumber, done)
                 VALUES ($1, $2, $3, $4) RETURNING *`,
                [subtaskId, relationshipId, sequenceNumber, done ?? false],
            );
            const rows = parseRows<Todo>(result.rows);

            if (!rows.length) {
                this.setStatus(500);
                return { error: "Nem sikerült a TODO létrehozása", message: "" } as ErrorResponse;
            }

            this.setStatus(201);
            return rows[0];
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba a TODO létrehozásakor", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("{id}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "Todo not found")
    @Response<ErrorResponse>(500, "Database error")
    public async getTodoById(@Path() id: number): Promise<Todo | ErrorResponse> {
        try {
            const result = await db.query("SELECT * FROM todo WHERE id = $1", [id]);
            if (!result.rows.length) {
                this.setStatus(404);
                return { error: "Nincs ilyen todo", message: "" } as ErrorResponse;
            }

            const rows = parseRows<Todo>(result.rows);
            return rows[0];
        } catch (err) {
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
        @Path() id: number,
        @Body() body: UpdateTodoRequest,
    ): Promise<SuccessResponse | ErrorResponse> {
        const { subtaskId, relationshipId, sequenceNumber, done } = body;
        if (!subtaskId || !relationshipId || !sequenceNumber) {
            this.setStatus(400);
            return { error: "Hiányzó kötelező mező", message: "" } as ErrorResponse;
        }

        try {
            const result = await db.query(
                "UPDATE todo SET subtaskId = $1, relationshipId = $2, sequenceNumber = $3, done = $4 WHERE id = $5 RETURNING *",
                [subtaskId, relationshipId, sequenceNumber, done ?? false, id],
            );

            if (!result.rows.length) {
                this.setStatus(404);
                return { error: "Nincs ilyen todo", message: "" } as ErrorResponse;
            }

            return successResponse;
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Delete("{id}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "Todo not found")
    @Response<ErrorResponse>(500, "Database error")
    public async deleteTodo(@Path() id: number): Promise<SuccessResponse | ErrorResponse> {
        try {
            const result = await db.query("DELETE FROM todo WHERE id = $1 RETURNING id", [id]);
            if (!result.rows.length) {
                this.setStatus(404);
                return { error: "Nincs ilyen todo", message: "" } as ErrorResponse;
            }

            return successResponse;
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("/relationship/{relationshipId}")
    @Security("jwt")
    @Response<ErrorResponse>(400, "Missing relationshipId")
    @Response<ErrorResponse>(500, "Database error")
    public async getTodosByRelationship(@Path() relationshipId: number): Promise<Todo[] | ErrorResponse> {
        if (!relationshipId) {
            this.setStatus(400);
            return { error: "Hiányzó kötelező mező", message: "" } as ErrorResponse;
        }

        try {
            const result = await db.query("SELECT * FROM todo WHERE relationshipId = $1 ORDER BY sequenceNumber", [
                relationshipId,
            ]);
            return parseRows<Todo>(result.rows);
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }
}
