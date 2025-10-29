import { Post, Route, Tags, Body, Response, Controller } from "tsoa";
import { ErrorResponse, LogedInUser } from "../model.js";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const prisma = new PrismaClient();
const SECRET_KEY = process.env.JWT_SECRET || "secret";

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    role: "admin" | "caregiver";
    token: string;
    user: { id: string; name: string; email: string };
}

@Route("login")
@Tags("Login")
export class LoginController extends Controller {
    @Post("/")
    @Response<ErrorResponse>(401, "Unauthorized")
    @Response<ErrorResponse>(500, "Server error")
    public async login(@Body() body: LoginRequest): Promise<LoginResponse | ErrorResponse> {
        const { email, password } = body;

        try {
            const admin = await prisma.admin.findUnique({ where: { email } });
            if (admin) {
                const match = await bcrypt.compare(password, admin.password);
                if (!match) {
                    this.setStatus(401);
                    return { error: "Hibás jelszó", message: "" } as ErrorResponse;
                }

                const token = jwt.sign({ id: admin.id, role: "admin" } as LogedInUser, SECRET_KEY, { expiresIn: "1d" });
                return {
                    role: "admin",
                    token,
                    user: { id: admin.id, name: admin.name, email: admin.email },
                } as LoginResponse;
            }

            const caregiver = await prisma.caregiver.findUnique({ where: { email } });
            if (caregiver) {
                const match = await bcrypt.compare(password, caregiver.password);
                if (!match) {
                    this.setStatus(401);
                    return { error: "Hibás jelszó", message: "" } as ErrorResponse;
                }

                const token = jwt.sign({ id: caregiver.id, role: "caregiver" } as LogedInUser, SECRET_KEY, {
                    expiresIn: "1d",
                });
                return {
                    role: "caregiver",
                    token,
                    user: { id: caregiver.id, name: caregiver.name, email: caregiver.email },
                } as LoginResponse;
            }

            this.setStatus(401);
            return { error: "Hibás jelszó", message: "" } as ErrorResponse;
        } catch (err) {
            this.setStatus(500);
            return { error: "Szerverhiba", message: err instanceof Error ? err.message : String(err) } as ErrorResponse;
        }
    }
}
