import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import bcrypt from "bcrypt";
import pool from "../db.js";
import dotenv from "dotenv";

dotenv.config();

const SECRET_KEY = process.env.SECRET_KEY || "secret";

interface UserPayload {
    id: number;
    role: string;
}

interface AuthenticatedRequest extends Request {
    user?: UserPayload;
}

export const login = async (req: Request, res: Response): Promise<Response> => {
    const { email, password } = req.body;

    try {
        const adminQuery = await pool.query("SELECT * FROM admins WHERE email = $1", [email]);
        if (adminQuery.rows.length > 0) {
            const admin = adminQuery.rows[0];
            const match = await bcrypt.compare(password, admin.password);

            if (!match) {
                return res.status(401).json({ error: "Hibás jelszó" });
            }

            const token = jwt.sign({ id: admin.id, role: "admin" }, SECRET_KEY, { expiresIn: "1d" });

            return res.status(200).json({
                message: "Sikeres bejelentkezés",
                role: "admin",
                token,
                user: { id: admin.id, name: admin.name, email: admin.email },
            });
        }

        const caregiverQuery = await pool.query("SELECT * FROM caregivers WHERE email = $1", [email]);
        if (caregiverQuery.rows.length > 0) {
            const caregiver = caregiverQuery.rows[0];
            const match = await bcrypt.compare(password, caregiver.password);

            if (!match) {
                return res.status(401).json({ error: "Hibás jelszó" });
            }

            const token = jwt.sign({ id: caregiver.id, role: "caregiver" }, SECRET_KEY, { expiresIn: "1d" });

            return res.status(200).json({
                message: "Sikeres bejelentkezés",
                role: "caregiver",
                token,
                user: { id: caregiver.id, name: caregiver.name, email: caregiver.email },
            });
        }

        return res.status(404).json({ error: "Felhasználó nem található" });
    } catch (err) {
        console.error("Hiba a bejelentkezés során:", err);
        return res.status(500).json({ error: "Szerverhiba", message: err });
    }
};

export const authenticate = (req: AuthenticatedRequest, res: Response, next: NextFunction): Response | void => {
    const token = req.headers.authorization?.split(" ")[1];

    if (!token) {
        return res.status(401).json({ error: "Nincs token megadva" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as JwtPayload;
        req.user = { id: decoded.id, role: decoded.role };
        next();
    } catch (err) {
        void err;
        res.status(401).json({ error: "Érvénytelen token" });
    }
};

export const authorize = (roles: string[] | string = []) => {
    const roleArray = typeof roles === "string" ? [roles] : roles;

    return (req: AuthenticatedRequest, res: Response, next: NextFunction): Response | void => {
        if (!req.user || !roleArray.includes(req.user.role)) {
            return res.status(403).json({ error: "Nincs jogosultságod ehhez a művelethez" });
        }

        next();
    };
};
