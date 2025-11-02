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
import { ErrorResponse, successResponse, SuccessResponse } from "../model.js";
import { getErrorCode, getErrorMessage } from "../utils.js";

const prisma = new PrismaClient();

interface RecipientCaregiverRelationship {
    id: string;
    recipientId: string;
    caregiverId: string;
}

interface RelationshipRequest {
    recipientId: string;
    caregiverId: string;
}

@Route("relationships")
@Tags("Relationships")
export class RelationshipController extends Controller {
    @Post("/")
    @Security("jwt")
    @TsoaSuccessResponse("201", "Created")
    @Response<ErrorResponse>(500, "Database error")
    public async addRecipientToCaregiver(
        @Body() body: RelationshipRequest,
    ): Promise<RecipientCaregiverRelationship | ErrorResponse> {
        try {
            const relationship = await prisma.recipientCaregiverRelationship.create({
                data: {
                    recipientId: body.recipientId,
                    caregiverId: body.caregiverId,
                },
                include: {
                    recipient: { select: { id: true, name: true } },
                    caregiver: { select: { id: true, name: true } },
                },
            });

            this.setStatus(201);
            return relationship;
        } catch (err: unknown) {
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
    public async getRelationshipsForRecipient(
        @Path() id: string,
    ): Promise<RecipientCaregiverRelationship[] | ErrorResponse> {
        try {
            const relationships = await prisma.recipientCaregiverRelationship.findMany({
                where: { recipientId: id },
            });

            return relationships;
        } catch (err: unknown) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("/caregiver/{id}/recipients")
    @Security("jwt")
    @Response<ErrorResponse>(500, "Database error")
    public async getRelationshipsForCaregiver(
        @Path() id: string,
    ): Promise<RecipientCaregiverRelationship[] | ErrorResponse> {
        try {
            const relationships = await prisma.recipientCaregiverRelationship.findMany({
                where: { caregiverId: id },
            });

            return relationships;
        } catch (err: unknown) {
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("/")
    @Security("jwt")
    @Response<ErrorResponse>(500, "Database error")
    public async getAllRelationships(): Promise<RecipientCaregiverRelationship[] | ErrorResponse> {
        try {
            const relationships = await prisma.recipientCaregiverRelationship.findMany({
                include: {
                    recipient: { select: { name: true } },
                    caregiver: { select: { name: true } },
                },
            });

            return relationships;
        } catch (err: unknown) {
            this.setStatus(500);
            return { error: "Server error", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Put("{id}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "Relationship not found")
    @Response<ErrorResponse>(500, "Database error")
    public async updateRelationship(
        @Path() id: string,
        @Body() body: RelationshipRequest,
    ): Promise<SuccessResponse | ErrorResponse> {
        try {
            await prisma.recipientCaregiverRelationship.update({
                where: { id },
                data: {
                    recipientId: body.recipientId,
                    caregiverId: body.caregiverId,
                },
            });
            return successResponse;
        } catch (err: unknown) {
            if (getErrorCode(err) === "P2025") {
                this.setStatus(404);
                return { error: "Relationship not found", message: "" } as ErrorResponse;
            }
            this.setStatus(500);
            return { error: "Error updating relationship", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Delete("{id}")
    @Security("jwt")
    @Response<ErrorResponse>(404, "Relationship not found")
    @Response<ErrorResponse>(500, "Database error")
    public async deleteRelationship(@Path() id: string): Promise<SuccessResponse | ErrorResponse> {
        try {
            await prisma.recipientCaregiverRelationship.delete({ where: { id } });
            return successResponse;
        } catch (err: unknown) {
            if (getErrorCode(err) === "P2025") {
                this.setStatus(404);
                return { error: "Relationship not found", message: "" } as ErrorResponse;
            }
            this.setStatus(500);
            return { error: "Error deleting relationship", message: getErrorMessage(err) } as ErrorResponse;
        }
    }
}
