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
import bcrypt from "bcrypt";
import { Caregiver, ErrorResponse, successResponse, SuccessResponse } from "../model.js";

interface CreateCaregiverRequest {
    name: string;
    email: string;
    phone: string;
    password: string;
}

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
    public async getCaregivers(): Promise<Caregiver[] | ErrorResponse> {
        try {
            const result = await db.query("SELECT id, name, phone, email FROM caregivers ORDER BY id ASC");
            return parseRows<Caregiver>(result.rows);
        } catch (err) {
            this.setStatus(500);
            return { error: "Adatbázis hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("{id}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "Caregiver not found")
    @Response<ErrorResponse>(500, "Database error")
    public async getCaregiverById(@Path() id: number): Promise<Caregiver | ErrorResponse> {
        try {
            const result = await db.query("SELECT id, name, phone, email FROM caregivers WHERE id=$1", [id]);
            if (!result.rows.length) {
                this.setStatus(404);
                return { error: "Nincs ilyen gondozó", message: "" } as ErrorResponse;
            }
            return parseRows<Caregiver>(result.rows)[0];
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
    public async createCaregiver(@Body() body: CreateCaregiverRequest): Promise<Caregiver | ErrorResponse> {
        if (!body.name || !body.email || !body.phone || !body.password) {
            this.setStatus(400);
            return { error: "Hiányzó mező", message: "" } as ErrorResponse;
        }

        try {
            const hashedPassword = await bcrypt.hash(body.password, 10);
            const result = await db.query(
                "INSERT INTO caregivers (name, email, phone, password) VALUES ($1,$2,$3,$4) RETURNING *",
                [body.name, body.email, body.phone, hashedPassword],
            );

            const rows = parseRows<Caregiver>(result.rows);
            if (!rows.length) {
                this.setStatus(500);
                return { error: "Nem sikerült a gondozó létrehozása", message: "" } as ErrorResponse;
            }
            this.setStatus(201);
            return rows[0];
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
        @Path() id: number,
        @Body() body: { name: string; email: string; phone: string },
    ): Promise<SuccessResponse | ErrorResponse> {
        if (!body.name || !body.email || !body.phone) {
            this.setStatus(400);
            return { error: "Hiányzó mező", message: "" } as ErrorResponse;
        }

        try {
            const result = await db.query(
                "UPDATE caregivers SET name=$1, email=$2, phone=$3 WHERE id=$4 RETURNING id, name, email, phone",
                [body.name, body.email, body.phone, id],
            );
            if (!result.rows.length) {
                this.setStatus(404);
                return { error: "Nincs ilyen gondozó", message: "" } as ErrorResponse;
            }
            this.setStatus(200);
            return successResponse;
        } catch (err) {
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
        @Path() id: number,
        @Body() body: UpdateCaregiverPasswordRequest,
    ): Promise<SuccessResponse | ErrorResponse> {
        const { currentPassword, newPassword } = body;
        if (!currentPassword || !newPassword) {
            this.setStatus(400);
            return { error: "Hiányzó mező", message: "" } as ErrorResponse;
        }

        try {
            const result = await db.query("SELECT password FROM caregivers WHERE id=$1", [id]);
            if (!result.rows.length) {
                this.setStatus(404);
                return { error: "Nincs ilyen gondozó", message: "" } as ErrorResponse;
            }

            const storedHash = result.rows[0].password;
            const isValid = await bcrypt.compare(currentPassword, storedHash);
            if (!isValid) {
                this.setStatus(400);
                return { error: "Helytelen régi jelszó", message: "" } as ErrorResponse;
            }

            const newHash = await bcrypt.hash(newPassword, 10);
            await db.query("UPDATE caregivers SET password=$1 WHERE id=$2", [newHash, id]);
            this.setStatus(200);
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
    public async deleteCaregiver(@Path() id: number): Promise<SuccessResponse | ErrorResponse> {
        try {
            const result = await db.query("DELETE FROM caregivers WHERE id=$1 RETURNING id", [id]);
            if (!result.rows.length) {
                this.setStatus(404);
                return { error: "Nincs ilyen gondozó", message: "" } as ErrorResponse;
            }
            this.setStatus(200);
            return successResponse;
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }
}
