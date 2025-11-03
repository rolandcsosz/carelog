import { WebSocketServer, WebSocket } from "ws";
import { IncomingMessage } from "http";
import jwt, { JwtPayload } from "jsonwebtoken";
import Redis from "ioredis";
import { LogedInUser } from "./model";

const REDIS_HOST = process.env.REDIS_HOST || "localhost";
const REDIS_PORT = Number(process.env.REDIS_PORT) || 6379;
const SECRET_KEY = process.env.JWT_SECRET || "secret";

type DecodedToken = JwtPayload & LogedInUser;

export function startWebSocketServer(server: any) {
    const wss = new WebSocketServer({ server });

    wss.on("connection", async (ws: WebSocket, req: IncomingMessage) => {
        try {
            if (!req.url) throw new Error("Missing URL");

            const url = new URL(req.url, `http://${req.headers.host}`);
            const token = url.searchParams.get("token");
            if (!token) throw new Error("Missing token");

            const decoded = jwt.verify(token, SECRET_KEY) as DecodedToken;
            const userId = decoded.id;

            const userSub = new Redis({ host: REDIS_HOST, port: REDIS_PORT });
            const userData = new Redis({ host: REDIS_HOST, port: REDIS_PORT });

            userSub.subscribe(`chat:${userId}`);
            console.log(`Subscribed WS for user ${userId} on channel chat:${userId}`);

            const storedTokens = await userData.lrange(`chat:${userId}:tokens`, 0, -1);
            if (storedTokens.length > 0) {
                ws.send(
                    JSON.stringify({
                        type: "history",
                        tokens: storedTokens,
                    }),
                );
            }

            userSub.on("message", (channel, message) => {
                if (channel === `chat:${userId}`) {
                    ws.send(message);
                }
            });

            ws.on("close", async () => {
                console.log(`WebSocket closed for user ${userId}`);
                await userSub.unsubscribe(`chat:${userId}`);
                userSub.disconnect();
            });

            ws.on("error", async (err) => {
                console.error("WS error:", err);
                await userSub.unsubscribe(`chat:${userId}`);
                userSub.disconnect();
            });
        } catch (err) {
            console.error("WS auth error:", err);
            ws.close();
        }
    });
}
