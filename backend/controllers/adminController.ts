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
import { ErrorResponse, successResponse, SuccessResponse } from "../model.js";
import { getErrorCode, getErrorMessage } from "../utils.js";
import bcrypt from "bcrypt";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

type CreateAdminRequest = {
    name: string;
    email: string;
    password: string;
};

type AdminWithoutPassword = {
    id: string;
    name: string;
    email: string;
};

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
    public async getAdmins(): Promise<AdminWithoutPassword[] | ErrorResponse> {
        try {
            const admins = await prisma.admin.findMany({
                orderBy: { id: "asc" },
                select: { id: true, name: true, email: true },
            });
            return admins as AdminWithoutPassword[];
        } catch (err) {
            this.setStatus(500);
            return { error: "Adatbázis hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }

    @Get("{id}")
    @Security("jwt", ["admin"])
    @Response<ErrorResponse>(404, "Admin not found")
    @Response<ErrorResponse>(500, "Database error")
    public async getAdminById(@Path() id: string): Promise<AdminWithoutPassword | ErrorResponse> {
        try {
            const admin = await prisma.admin.findUnique({
                where: { id },
                select: { id: true, name: true, email: true },
            });

            if (!admin) {
                this.setStatus(404);
                return { error: "Nincs ilyen admin", message: "" } as ErrorResponse;
            }

            return admin as AdminWithoutPassword;
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
    public async createAdmin(@Body() body: CreateAdminRequest): Promise<AdminWithoutPassword | ErrorResponse> {
        if (!body.name || !body.email || !body.password) {
            this.setStatus(400);
            return { error: "Hiányzó mező", message: "" } as ErrorResponse;
        }

        try {
            const hashedPassword = await bcrypt.hash(body.password, 10);

            const admin = await prisma.admin.create({
                data: {
                    name: body.name,
                    email: body.email,
                    password: hashedPassword,
                },
                select: { id: true, name: true, email: true },
            });

            this.setStatus(201);
            return admin as AdminWithoutPassword;
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
        @Path() id: string,
        @Body() body: { name: string; email: string },
    ): Promise<SuccessResponse | ErrorResponse> {
        if (!body.name || !body.email) {
            this.setStatus(400);
            return { error: "Hiányzó mező", message: "" } as ErrorResponse;
        }

        try {
            await prisma.admin.update({
                where: { id },
                data: { name: body.name, email: body.email },
            });

            return successResponse;
        } catch (err) {
            if (getErrorCode(err) === "P2025") {
                this.setStatus(404);
                return { error: "Nincs ilyen admin", message: "" } as ErrorResponse;
            }
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
        @Path() id: string,
        @Body() body: UpdateAdminPasswordRequest,
    ): Promise<SuccessResponse | ErrorResponse> {
        const { currentPassword, newPassword } = body;
        if (!currentPassword || !newPassword) {
            this.setStatus(400);
            return { error: "Hiányzó mező", message: "" } as ErrorResponse;
        }

        try {
            const admin = await prisma.admin.findUnique({ where: { id } });
            if (!admin) {
                this.setStatus(404);
                return { error: "Nincs ilyen admin", message: "" } as ErrorResponse;
            }

            if (!admin) {
                this.setStatus(404);
                return { error: "Nincs ilyen admin", message: "" } as ErrorResponse;
            }

            const isValid = await bcrypt.compare(currentPassword, admin.password);
            if (!isValid) {
                this.setStatus(400);
                return { error: "Helytelen régi jelszó", message: "" } as ErrorResponse;
            }

            const newHash = await bcrypt.hash(newPassword, 10);
            await prisma.admin.update({ where: { id }, data: { password: newHash } });

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
    public async deleteAdmin(@Path() id: string): Promise<SuccessResponse | ErrorResponse> {
        try {
            await prisma.admin.delete({ where: { id } });
            return successResponse;
        } catch (err) {
            if (getErrorCode(err) === "P2025") {
                this.setStatus(404);
                return { error: "Nincs ilyen admin", message: "" } as ErrorResponse;
            }
            this.setStatus(500);
            return { error: "Hiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }
}
