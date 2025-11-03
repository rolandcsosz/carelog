import { PrismaClient } from "@prisma/client";
import Redis from "ioredis";

const prisma = new PrismaClient();

const openAiApiKey = process.env.OPENAI_API_KEY || "";

console.log("Worker process started. Listening for pending messages...");

const redis = new Redis({
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
});

interface OpenAICallOptions {
    apiKey: string;
    body: unknown;
    userId: string;
}

export const openaiStream = async ({ apiKey, body, userId }: OpenAICallOptions) => {
    const res = await fetch("https://api.openai.com/v1/chat/completions", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({ ...(body as object), stream: true }),
    });

    if (!res.body) throw new Error("No response body");

    const reader = res.body.getReader();
    const decoder = new TextDecoder("utf-8");

    let reply = "";
    let done = false;
    let buffer = "";

    while (!done) {
        const { value, done: doneReading } = await reader.read();
        done = doneReading;

        if (value) {
            buffer += decoder.decode(value, { stream: true });
            const lines = buffer.split("\n");

            buffer = lines.pop() || "";

            for (const line of lines) {
                const trimmed = line.trim();
                if (!trimmed.startsWith("data:")) continue;

                const jsonStr = trimmed.replace(/^data: /, "");
                if (jsonStr === "[DONE]") continue;

                try {
                    const data = JSON.parse(jsonStr);
                    const delta = data.choices?.[0]?.delta?.content;
                    if (delta) {
                        reply += delta;
                        await redis.rpush(`chat:${userId}:tokens`, delta);
                        await redis.publish(`chat:${userId}`, JSON.stringify({ type: "token", token: delta }));
                    }
                } catch (err) {
                    console.error("Error parsing OpenAI stream chunk:", err);
                }
            }
        }
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
        try {
            await prisma.message.update({
                where: { id: msg.id },
                data: { status: "processing" },
            });

            const fullMessage = await openaiStream({
                apiKey: openAiApiKey,
                userId: msg.userId,
                body: {
                    model: "gpt-5-nano",
                    messages: [{ role: "user", content: msg.content }],
                },
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
            console.error("Error processing message", msg.id, err);

            await prisma.message.update({
                where: { id: msg.id },
                data: { status: "failed" },
            });

            if (msg.userId) {
                await redis.rpush(`chat:${msg.userId}:tokens`, "...");
                await redis.publish(`chat:${msg.userId}`, JSON.stringify({ type: "error", token: "..." }));
            }
        }

        await redis.publish(`chat:${msg.userId}`, JSON.stringify({ type: "completion", token: "" }));
        await redis.del(`chat:${msg.userId}:tokens`);
        console.log(`Cleared token history for ${msg.userId}`);
    }
}

setInterval(processPendingMessages, 1000);
