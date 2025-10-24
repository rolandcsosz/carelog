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
import { Caregiver, Recipient, Relationship, ErrorResponse, successResponse, SuccessResponse } from "../model.js";

interface RelationshipRequest {
    recipientId: number;
    caregiverId: number;
}

// TODO: Add strict typing to responses

@Route("relationships")
@Tags("Relationships")
export class RelationshipController extends Controller {
    @Post("/")
    @Security("jwt")
    @TsoaSuccessResponse("201", "Created")
    @Response<ErrorResponse>(500, "Database error")
    public async addRecipientToCaregiver(@Body() body: RelationshipRequest): Promise<Relationship | ErrorResponse> {
        try {
            const result = await db.query(
                "INSERT INTO recipients_caregivers (recipient_id, caregiver_id) VALUES ($1, $2) RETURNING *",
                [body.recipientId, body.caregiverId],
            );

            const rows = parseRows<Relationship>(result.rows);
            if (!rows.length) {
                this.setStatus(500);
                return { error: "Nem sikerült a gondozott hozzáadása a gondozóhoz", message: "" } as ErrorResponse;
            }

            this.setStatus(201);
            return rows[0];
        } catch (err) {
            this.setStatus(500);
            return {
                error: "Hiba a gondozott hozzáadásakor a gondozóhoz",
                message: getErrorMessage(err),
            } as ErrorResponse;
        }
    }

    @Get("/recipient/{id}/caregivers")
    @Security("jwt")
    @Response<ErrorResponse>(500, "Database error")
    public async getCaregiversForRecipient(
        @Path() id: number,
    ): Promise<(Caregiver & { relationship_id: number })[] | ErrorResponse> {
        try {
            const result = await db.query(
                `SELECT c.id, c.name, c.phone, c.email, rc.relationship_id
                 FROM caregivers c
                 JOIN recipients_caregivers rc ON c.id = rc.caregiver_id
                 WHERE rc.recipient_id=$1`,
                [id],
            );
            return parseRows<Caregiver & { relationship_id: number }>(result.rows);
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("/caregiver/{id}/recipients")
    @Security("jwt")
    @Response<ErrorResponse>(500, "Database error")
    public async getRecipientsForCaregiver(
        @Path() id: number,
    ): Promise<(Recipient & { relationship_id: number })[] | ErrorResponse> {
        try {
            const result = await db.query(
                `SELECT r.id, r.name, r.phone, r.email, r.address, rc.relationship_id
                 FROM recipients r
                 JOIN recipients_caregivers rc ON r.id = rc.recipient_id
                 WHERE rc.caregiver_id=$1`,
                [id],
            );
            return parseRows<Recipient & { relationship_id: number }>(result.rows);
        } catch (err) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("/")
    @Security("jwt")
    @Response<ErrorResponse>(500, "Database error")
    public async getAllRelationships(): Promise<any[] | ErrorResponse> {
        try {
            const result = await db.query(
                `SELECT 
                    rc.relationship_id,
                    rc.recipient_id,
                    r.name AS recipient_name,
                    rc.caregiver_id,
                    c.name AS caregiver_name
                 FROM recipients_caregivers rc
                 JOIN recipients r ON rc.recipient_id = r.id
                 JOIN caregivers c ON rc.caregiver_id = c.id`,
            );
            return result.rows;
        } catch (err) {
            this.setStatus(500);
            return { error: "Server error", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Put("{id}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "Relationship not found")
    @Response<ErrorResponse>(500, "Database error")
    public async updateRelationship(
        @Path() id: number,
        @Body() body: RelationshipRequest,
    ): Promise<SuccessResponse | ErrorResponse> {
        try {
            const result = await db.query(
                "UPDATE recipients_caregivers SET recipient_id=$1, caregiver_id=$2 WHERE relationship_id=$3 RETURNING *",
                [body.recipientId, body.caregiverId, id],
            );
            if (!result.rows.length) {
                this.setStatus(404);
                return { error: "Relationship not found", message: "" } as ErrorResponse;
            }

            this.setStatus(200);
            return successResponse;
        } catch (err) {
            this.setStatus(500);
            return { error: "Error updating relationship", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Delete("{id}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "Relationship not found")
    @Response<ErrorResponse>(500, "Database error")
    public async deleteRelationship(@Path() id: number): Promise<SuccessResponse | ErrorResponse> {
        try {
            const result = await db.query("DELETE FROM recipients_caregivers WHERE relationship_id=$1 RETURNING *", [
                id,
            ]);
            if (!result.rows.length) {
                this.setStatus(404);
                return { error: "Relationship not found", message: "" } as ErrorResponse;
            }

            this.setStatus(200);
            return successResponse;
        } catch (err) {
            this.setStatus(500);
            return { error: "Error deleting relationship", message: getErrorMessage(err) } as ErrorResponse;
        }
    }
}
