import { Request } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";

const SECRET_KEY = process.env.JWT_SECRET || "default_secret";

interface DecodedToken extends JwtPayload {
    id: string;
    role: string;
}

export async function expressAuthentication(
    req: Request,
    securityName: string,
    scopes?: string[],
): Promise<DecodedToken> {
    if (securityName === "bearerAuth") {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            throw new Error("No authorization header");
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            throw new Error("No token provided");
        }

        try {
            const decoded = jwt.verify(token, SECRET_KEY) as DecodedToken;

            if (scopes && scopes.length > 0 && !scopes.includes(decoded.role)) {
                throw new Error("Insufficient role");
            }

            return decoded;
        } catch (err) {
            throw new Error("Invalid or expired token");
        }
    }

    throw new Error("Unknown security name");
}
