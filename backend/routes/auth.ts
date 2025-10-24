import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { LogedInUser } from "../model";

const SECRET_KEY = process.env.JWT_SECRET || "secret";

type DecodedToken = JwtPayload & LogedInUser;

export async function expressAuthentication(
    req: Request,
    securityName: string,
    scopes?: string[],
): Promise<DecodedToken> {
    if (securityName !== "jwt") {
        return Promise.reject({ status: 401, message: "Unknown security scheme" });
    }

    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return Promise.reject({ status: 401, message: "No authorization header" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
        return Promise.reject({ status: 401, message: "No token provided" });
    }

    try {
        const decoded = jwt.verify(token, SECRET_KEY) as DecodedToken;

        if (scopes && scopes.length > 0 && !scopes.includes(decoded.role)) {
            return Promise.reject({ status: 403, message: "Insufficient role" });
        }

        return Promise.resolve(decoded);
    } catch (err) {
        void err;
        return Promise.reject({ status: 401, message: "Invalid or expired token" });
    }
}
