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
import { Admin, ErrorResponse, successResponse, SuccessResponse } from "../model.js";
import db from "../db.js";
import { getErrorMessage, parseRows } from "../utils.js";
import bcrypt from "bcrypt";

interface CreateAdminRequest {
    name: string;
    email: string;
    password: string;
}

interface UpdateAdminPasswordRequest {
    currentPassword: string;
    newPassword: string;
}

@Route("admins")
@Tags("Admins")
export class AdminController extends Controller {
    @Get("/")
    @Security("jwt", ["admin"])
    @Response<ErrorResponse>(500, "Database error")
    public async getAdmins(): Promise<Admin[] | ErrorResponse> {
        try {
            const result = await db.query("SELECT id, name, email FROM admins ORDER BY id ASC");
            return parseRows<Admin>(result.rows);
        } catch (err) {
            this.setStatus(500);
            return { error: "Adatbázis hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("{id}")
    @Security("jwt", ["admin"])
    @Response<ErrorResponse>(404, "Admin not found")
    @Response<ErrorResponse>(500, "Database error")
    public async getAdminById(@Path() id: number): Promise<Admin | ErrorResponse> {
        try {
            const result = await db.query("SELECT id, name, email FROM admins WHERE id=$1", [id]);

            if (result.rows.length === 0) {
                this.setStatus(404);
                return { error: "Nincs ilyen admin", message: "" } as ErrorResponse;
            }

            return result.rows[0];
        } catch (err) {
            this.setStatus(500);
            return { error: "Adatbázis hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Post("/")
    @Security("jwt", ["admin"])
    @TsoaSuccessResponse("201", "Created")
    @Response<ErrorResponse>(400, "Missing fields")
    @Response<ErrorResponse>(500, "Database error")
    public async createAdmin(@Body() body: CreateAdminRequest): Promise<Admin | ErrorResponse> {
        if (!body.name || !body.email || !body.password) {
            this.setStatus(400);
            return { error: "Hiányzó mező", message: "" } as ErrorResponse;
        }

        try {
            const hashedPassword = await bcrypt.hash(body.password, 10);
            const result = await db.query("INSERT INTO admins (name, email, password) VALUES ($1,$2,$3) RETURNING *", [
                body.name,
                body.email,
                hashedPassword,
            ]);

            const rows = parseRows<Admin>(result.rows);

            if (rows.length === 0) {
                this.setStatus(500);
                return { error: "Nem sikerült az admin létrehozása", message: "" } as ErrorResponse;
            }
            this.setStatus(201);

            return rows[0];
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba az admin létrehozásakor", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Put("{id}")
    @Security("jwt", ["admin"])
    @Response<ErrorResponse>(400, "Missing fields")
    @Response<ErrorResponse>(404, "Admin not found")
    @Response<ErrorResponse>(500, "Database error")
    public async updateAdmin(
        @Path() id: number,
        @Body() body: { name: string; email: string },
    ): Promise<SuccessResponse | ErrorResponse> {
        if (!body.name || !body.email) {
            this.setStatus(400);
            return { error: "Hiányzó mező", message: "" } as ErrorResponse;
        }

        try {
            const result = await db.query("UPDATE admins SET name=$1,email=$2 WHERE id=$3 RETURNING id,name,email", [
                body.name,
                body.email,
                id,
            ]);
            if (!result.rows.length) {
                this.setStatus(404);
                return { error: "Nincs ilyen admin", message: "" } as ErrorResponse;
            }

            this.setStatus(200);
            return successResponse;
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba az admin frissítésekor", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Put("{id}/password")
    @Security("jwt", ["admin"])
    @Response<ErrorResponse>(400, "Missing fields or invalid password")
    @Response<ErrorResponse>(404, "Admin not found")
    @Response<ErrorResponse>(500, "Database error")
    public async updateAdminPassword(
        @Path() id: number,
        @Body() body: UpdateAdminPasswordRequest,
    ): Promise<SuccessResponse | ErrorResponse> {
        const { currentPassword, newPassword } = body;
        if (!currentPassword || !newPassword) {
            this.setStatus(400);
            return { error: "Hiányzó mező", message: "" } as ErrorResponse;
        }

        try {
            const result = await db.query("SELECT password FROM admins WHERE id=$1", [id]);
            if (!result.rows.length) {
                this.setStatus(404);
                return { error: "Nincs ilyen admin", message: "" } as ErrorResponse;
            }

            const storedHash = result.rows[0].password;
            const isValid = await bcrypt.compare(currentPassword, storedHash);
            if (!isValid) {
                this.setStatus(400);
                return { error: "Helytelen régi jelszó", message: "" } as ErrorResponse;
            }

            const newHash = await bcrypt.hash(newPassword, 10);
            await db.query("UPDATE admins SET password=$1 WHERE id=$2", [newHash, id]);
            this.setStatus(200);
            return successResponse;
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Delete("{id}")
    @Security("jwt", ["admin"])
    @Response<ErrorResponse>(404, "Admin not found")
    @Response<ErrorResponse>(500, "Database error")
    public async deleteAdmin(@Path() id: number): Promise<SuccessResponse | ErrorResponse> {
        try {
            const result = await db.query("DELETE FROM admins WHERE id=$1 RETURNING id", [id]);
            if (!result.rows.length) {
                this.setStatus(404);
                return { error: "Nincs ilyen admin", message: "" } as ErrorResponse;
            }
            this.setStatus(200);
            return successResponse;
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }
}
