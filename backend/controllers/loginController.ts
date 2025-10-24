import { Post, Route, Tags, Body, Response, Controller } from "tsoa";
import { Admin, ErrorResponse, LogedInUser } from "../model.js";
import db from "../db.js";
import { getErrorMessage, parseRows } from "../utils.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "secret";

interface LoginRequest {
    email: string;
    password: string;
}

interface LoginResponse {
    role: "admin" | "caregiver";
    token: string;
    user: { id: number; name: string; email: string };
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
            const adminQuery = await db.query("SELECT * FROM admins WHERE email=$1", [email]);
            const admins = parseRows<Admin>(adminQuery.rows);
            if (admins.length > 0) {
                const admin = admins[0];
                const match = await bcrypt.compare(password, admin.password);
                if (!match) {
                    this.setStatus(401);
                    return { error: "Hibás jelszó", message: "" } as ErrorResponse;
                }

                const token = jwt.sign({ id: admin.id, role: "admin" } as LogedInUser, SECRET_KEY, { expiresIn: "1d" });
                this.setStatus(200);

                return {
                    role: "admin",
                    token,
                    user: { id: admin.id, name: admin.name, email: admin.email },
                } as LoginResponse;
            }

            const caregiverQuery = await db.query("SELECT * FROM caregivers WHERE email=$1", [email]);

            const caregivers = parseRows<Admin>(caregiverQuery.rows);

            if (caregivers.length > 0) {
                const caregiver = caregivers[0];
                const match = await bcrypt.compare(password, caregiver.password);
                if (!match) {
                    this.setStatus(401);
                    return { error: "Hibás jelszó", message: "" } as ErrorResponse;
                }

                const token = jwt.sign({ id: caregiver.id, role: "caregiver" }, SECRET_KEY, { expiresIn: "1d" });
                this.setStatus(200);

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
            return { error: "Szerverhiba", message: getErrorMessage(err) } as ErrorResponse;
        }
    }
}
