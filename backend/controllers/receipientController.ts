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
import { Recipient, ErrorResponse, successResponse, SuccessResponse } from "../model.js";

interface CreateRecipientRequest {
    name: string;
    email: string;
    phone: string;
    address: string;
    fourHandCareNeeded?: boolean;
    note?: string;
    password: string;
}

interface UpdateRecipientPasswordRequest {
    currentPassword: string;
    newPassword: string;
}

@Route("recipients")
@Tags("Recipients")
export class RecipientController extends Controller {
    @Get("/")
    @Security("jwt")
    @Response<ErrorResponse>(500, "Database error")
    public async getRecipients(): Promise<Recipient[] | ErrorResponse> {
        try {
            const result = await db.query(
                `SELECT id, name, email, phone, address, four_hand_care_needed, caregiver_note 
                 FROM recipients ORDER BY id ASC`,
            );
            return parseRows<Recipient>(result.rows);
        } catch (err) {
            this.setStatus(500);
            return { error: "Adatbázis hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("{id}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "Recipient not found")
    @Response<ErrorResponse>(500, "Database error")
    public async getRecipientById(@Path() id: number): Promise<Recipient | ErrorResponse> {
        try {
            const result = await db.query(
                `SELECT id, name, email, phone, address, four_hand_care_needed, caregiver_note 
                 FROM recipients WHERE id=$1`,
                [id],
            );

            if (!result.rows.length) {
                this.setStatus(404);
                return { error: "Nincs ilyen gondozott", message: "" } as ErrorResponse;
            }

            return parseRows<Recipient>(result.rows)[0];
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
    public async createRecipient(@Body() body: CreateRecipientRequest): Promise<Recipient | ErrorResponse> {
        if (!body.name || !body.email || !body.phone || !body.address || !body.password) {
            this.setStatus(400);
            return { error: "Hiányzó mező", message: "" } as ErrorResponse;
        }

        try {
            const hashedPassword = await bcrypt.hash(body.password, 10);
            const result = await db.query(
                `INSERT INTO recipients
                 (name, email, phone, address, four_hand_care_needed, caregiver_note, password)
                 VALUES ($1,$2,$3,$4,$5,$6,$7)
                 RETURNING id, name, email, phone, address, four_hand_care_needed, caregiver_note`,
                [
                    body.name,
                    body.email,
                    body.phone,
                    body.address,
                    body.fourHandCareNeeded ?? false,
                    body.note ?? null,
                    hashedPassword,
                ],
            );

            const rows = parseRows<Recipient>(result.rows);
            if (!rows.length) {
                this.setStatus(500);
                return { error: "Nem sikerült a gondozott létrehozása", message: "" } as ErrorResponse;
            }
            this.setStatus(201);
            return rows[0];
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba a gondozott létrehozásakor", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Put("{id}")
    @Security("jwt")
    @Response<ErrorResponse>(400, "Missing fields")
    @Response<ErrorResponse>(404, "Recipient not found")
    @Response<ErrorResponse>(500, "Database error")
    public async updateRecipient(
        @Path() id: number,
        @Body()
        body: {
            name: string;
            email: string;
            phone: string;
            address: string;
            fourHandCareNeeded?: boolean;
            note?: string;
        },
    ): Promise<SuccessResponse | ErrorResponse> {
        if (!body.name || !body.email || !body.phone || !body.address) {
            this.setStatus(400);
            return { error: "Hiányzó mező", message: "" } as ErrorResponse;
        }

        try {
            const result = await db.query(
                `UPDATE recipients
                 SET name=$1, email=$2, phone=$3, address=$4, four_hand_care_needed=$5, caregiver_note=$6
                 WHERE id=$7
                 RETURNING id`,
                [
                    body.name,
                    body.email,
                    body.phone,
                    body.address,
                    body.fourHandCareNeeded ?? false,
                    body.note ?? null,
                    id,
                ],
            );

            if (!result.rows.length) {
                this.setStatus(404);
                return { error: "Nincs ilyen gondozott", message: "" } as ErrorResponse;
            }

            this.setStatus(200);
            return successResponse;
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba a gondozott frissítésekor", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Put("{id}/password")
    @Security("jwt")
    @Response<ErrorResponse>(400, "Missing fields or invalid password")
    @Response<ErrorResponse>(404, "Recipient not found")
    @Response<ErrorResponse>(500, "Database error")
    public async updateRecipientPassword(
        @Path() id: number,
        @Body() body: UpdateRecipientPasswordRequest,
    ): Promise<SuccessResponse | ErrorResponse> {
        const { currentPassword, newPassword } = body;
        if (!currentPassword || !newPassword) {
            this.setStatus(400);
            return { error: "Hiányzó mező", message: "" } as ErrorResponse;
        }

        try {
            const result = await db.query("SELECT password FROM recipients WHERE id=$1", [id]);
            if (!result.rows.length) {
                this.setStatus(404);
                return { error: "Nincs ilyen gondozott", message: "" } as ErrorResponse;
            }

            const storedHash = result.rows[0].password;
            const isValid = await bcrypt.compare(currentPassword, storedHash);
            if (!isValid) {
                this.setStatus(400);
                return { error: "Helytelen régi jelszó", message: "" } as ErrorResponse;
            }

            const newHash = await bcrypt.hash(newPassword, 10);
            await db.query("UPDATE recipients SET password=$1 WHERE id=$2", [newHash, id]);
            this.setStatus(200);
            return successResponse;
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Delete("{id}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "Recipient not found")
    @Response<ErrorResponse>(500, "Database error")
    public async deleteRecipient(@Path() id: number): Promise<SuccessResponse | ErrorResponse> {
        try {
            const result = await db.query("DELETE FROM recipients WHERE id=$1 RETURNING id", [id]);
            if (!result.rows.length) {
                this.setStatus(404);
                return { error: "Nincs ilyen gondozott", message: "" } as ErrorResponse;
            }
            this.setStatus(200);
            return successResponse;
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }
}
