import { PrismaClient } from "@prisma/client";
import { GoogleGenAI } from "@google/genai";

import Redis from "ioredis";
const ai = new GoogleGenAI({
    apiKey: process.env.GOOGLE_API_KEY || "",
});

const prisma = new PrismaClient();

const googleApiKey = process.env.GOOGLE_API_KEY || "";

console.log("Worker process started. Listening for pending messages...");

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
});

export const googleStream = async ({ userId, message }: { apiKey: string; userId: string; message: string }) => {
    const response = await ai.models.generateContentStream({
        model: "gemini-2.5-flash",
        contents: [
            {
                text: "Respond in plain text only. Do not use Markdown or special characters. Do not mention that you were asked to respond in plain text.",
            },
            { text: message },
        ],
    });

    let reply = "";

    for await (const chunk of response) {
        if (!chunk.text) continue;
        redis.rpush(`chat:${userId}:tokens`, chunk.text);
        await redis.publish(`chat:${userId}`, JSON.stringify({ type: "token", token: chunk.text }));
        reply += chunk.text;
    }

    return reply;
};

async function processPendingMessages() {
    const messages = await prisma.message.findMany({
        where: { senderRole: "user", status: "pending" },
    });

    if (messages.length === 0) {
        return;
    }

    console.log(`Found ${messages.length} pending messages`);

    for (const msg of messages) {
        console.log(`Processing message ID: ${msg.id}`);

        await redis.del(`chat:${msg.userId}:tokens`);
        try {
            await prisma.message.update({
                where: { id: msg.id },
                data: { status: "processing" },
            });

            const fullMessage = await googleStream({
                apiKey: googleApiKey,
                userId: msg.userId,
                message: msg.content,
            });

            await prisma.message.update({
                where: { id: msg.id },
                data: { status: "done" },
            });

            await prisma.message.create({
                data: {
                    senderRole: "bot",
                    content: fullMessage,
                    userId: msg.userId,
                    status: "done",
                    time: new Date(),
                },
            });

            console.log(`Message ID: ${msg.id} processed successfully`);
        } catch (err) {
            await prisma.message.update({
                where: { id: msg.id },
                data: { status: "failed" },
            });

            if (msg.userId) {
                await redis.rpush(`chat:${msg.userId}:tokens`, "...");
                await redis.publish(`chat:${msg.userId}`, JSON.stringify({ type: "error", token: "..." }));
            }

            console.error("Error processing message", msg.id, err);
        }

        await redis.publish(`chat:${msg.userId}`, JSON.stringify({ type: "completion", token: "" }));
        await redis.del(`chat:${msg.userId}:tokens`);
    }
}

setInterval(processPendingMessages, 1000);
