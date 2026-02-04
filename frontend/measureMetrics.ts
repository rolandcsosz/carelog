import dotenv from "dotenv";
import { OpenAPI } from "./api/core/OpenAPI";
import { getLogById, processAudio, sendMessage, updateLog } from "./api/sdk.gen";
import { GetLogByIdData, ProcessAudioData, SendMessageData } from "./api/types.gen";
import WebSocket from "ws";
import path from "path";
import fs from "fs";

dotenv.config();

const API_URL = "http://localhost:8080";
OpenAPI.BASE = API_URL;
const WS_URL = "ws://localhost:8080";
const TEST_USER_ID = "";
const AUTH_TOKEN = "";
OpenAPI.TOKEN = AUTH_TOKEN;

const TEST_QUESTIONS = [
    "Milyen alapfeltételeknek kell megfelelnie egy személynek, hogy házi segítségnyújtásban részesülhessen?",
    "Hogyan lehet igényelni a házi segítségnyújtást és milyen dokumentumokat kell benyújtani hozzá?",
    "Mi a házi segítségnyújtás célja és milyen tevékenységeket foglal magában?",
    "Melyek a házi segítségnyújtás keretében ellátott személy jogai és kötelezettségei?",
    "Milyen időtartamra és milyen gyakorisággal lehet házi segítségnyújtást igénybe venni?",
    "Milyen szabályok vonatkoznak a házi gondozó munkavégzésére?",
    "Hogyan kell dokumentálni a házi segítségnyújtás során végzett tevékenységeket?",
    "Milyen higiéniai előírásokat kell betartani a gondozás során?",
    "Hogyan kell eljárni, ha a gondozott állapota hirtelen romlik?",
    "Milyen kommunikációs és konfliktuskezelési szabályok vonatkoznak a gondozóra?",
];

const TEST_AUDIO_FILE = "clean.webm";
const TEST_MIME_TYPE = "audio/webm;codecs=opus";

const NUM_ITERATIONS = 10;

interface BenchmarkResult {
    ttft: number;
    totalTime: number;
    success: boolean;
}

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

type WebSocketData = {
    type: "token" | "error" | "completion" | "history";
    token: string;
};

async function runRagTest(iteration: number): Promise<BenchmarkResult> {
    return new Promise((resolve) => {
        let ws: WebSocket | null = null;
        let startTime = 0;
        let firstTokenTime = 0;
        let endTime = 0;
        let receivedFirstToken = false;
        let fullResponse = "";

        const connect = () => {
            ws = new WebSocket(`${WS_URL}?token=${AUTH_TOKEN}`);

            ws.addEventListener("open", async () => {
                console.log(`[${iteration}] WS Connected`);

                try {
                    startTime = Date.now();
                    const response = await sendMessage({
                        requestBody: {
                            caregiverId: TEST_USER_ID,
                            content: TEST_QUESTIONS[iteration],
                        },
                    } as SendMessageData);

                    if (!response) {
                        throw new Error("No messageId in response");
                    }

                    console.log(`[${iteration}] API Request Sent, waiting for WS response...`);
                } catch (error) {
                    console.error(`[${iteration}] API Error:`, error);
                    resolve({ ttft: 0, totalTime: 0, success: false });
                }
            });

            ws.addEventListener("message", (event) => {
                const data = JSON.parse(
                    typeof event.data === "string" ? event.data : event.data.toString(),
                ) as WebSocketData;

                if (data.type === "token") {
                    if (!receivedFirstToken) {
                        firstTokenTime = Date.now();
                        receivedFirstToken = true;
                    }
                    fullResponse += data.token;
                }

                if (data.type === "completion" || data.type === "error") {
                    endTime = Date.now();
                    resolve({
                        ttft: firstTokenTime - startTime,
                        totalTime: endTime - startTime,
                        success: data.type === "completion",
                    });
                }
            });

            ws.addEventListener("close", () => {
                console.log("WebSocket closed");
            });

            ws.addEventListener("error", (err: any) => {
                console.error(`[${iteration}] WS Error:`, err);
                resolve({ ttft: 0, totalTime: 0, success: false });
            });
        };

        connect();
    });
}

async function runAudioTest(iteration: number): Promise<BenchmarkResult> {
    const filePath = path.join(".", TEST_AUDIO_FILE);
    if (!fs.existsSync(filePath)) {
        console.error("Test audio file not found!");
        return { ttft: 0, totalTime: 0, success: false };
    }

    const fileBuffer = fs.readFileSync(filePath);
    const base64AudioNormal = fileBuffer.toString("base64");
    const logId = "";

    const startTime = Date.now();

    try {
        await updateLog({
            id: logId,
            requestBody: { relationshipId: "", finished: false, closed: false, tasks: [], date: "2025-12-01" },
        });

        const baseState = await getLogById({
            id: logId,
        } as GetLogByIdData);

        console.log(`[${iteration}] Retrieved log state: ${JSON.stringify(baseState)}`);

        const response = await processAudio({
            requestBody: {
                logId: logId,
                inputMimeType: TEST_MIME_TYPE,
                base64Audio: base64AudioNormal,
            },
        } as ProcessAudioData);

        console.log(response);

        if (!response) {
            throw new Error("Audio processing failed to start");
        }

        const endTime = Date.now();

        const updatedLog = await getLogById({
            id: logId,
        } as GetLogByIdData);
        console.log(`[${iteration}] Updated log state: ${JSON.stringify(updatedLog)}`);

        return {
            ttft: 0,
            totalTime: endTime - startTime,
            success: true,
        };
    } catch (error) {
        console.error(`[${iteration}] Audio Error:`, (error as Error).message);
        return { ttft: 0, totalTime: 0, success: false };
    }
}

async function main() {
    console.log("Starting Benchmarks...");

    console.log("\n--- RAG (Chat) Benchmark ---");
    const ragResults: BenchmarkResult[] = [];
    for (let i = 0; i < NUM_ITERATIONS; i++) {
        console.log(`Running iteration ${i + 1}/${NUM_ITERATIONS}...`);
        const res = await runRagTest(i);
        if (res.success) {
            ragResults.push(res);
            console.log(`   -> TTFT: ${res.ttft}ms | Total: ${res.totalTime}ms`);
        }
        await sleep(1000);
    }

    console.log("\n--- Audio (STT) Benchmark ---");
    const audioResults: BenchmarkResult[] = [];
    for (let i = 0; i < NUM_ITERATIONS; i++) {
        console.log(`Running iteration ${i + 1}/${NUM_ITERATIONS}...`);
        const res = await runAudioTest(i);
        if (res.success) {
            audioResults.push(res);
            console.log(`   -> Total: ${res.totalTime}ms`);
        }
        await sleep(1000);
    }

    printStats("RAG Chat", ragResults);
    printStats("Audio STT", audioResults);
}

function printStats(name: string, results: BenchmarkResult[]) {
    if (results.length === 0) {
        console.log(`No successful results for ${name}`);
        return;
    }

    const ttfts = results.map((r) => r.ttft).filter((t) => t > 0);
    const totals = results.map((r) => r.totalTime);

    const avgTotal = totals.reduce((a, b) => a + b, 0) / totals.length;
    const minTotal = Math.min(...totals);
    const maxTotal = Math.max(...totals);

    console.log(`\n=== ${name} RESULTS ===`);
    console.log(`Samples: ${results.length}`);
    console.log(`Total Time (AVG): ${avgTotal.toFixed(2)} ms`);
    console.log(`Total Time (MIN): ${minTotal} ms`);
    console.log(`Total Time (MAX): ${maxTotal} ms`);

    if (ttfts.length > 0) {
        const avgTtft = ttfts.reduce((a, b) => a + b, 0) / ttfts.length;
        console.log(`TTFT (AVG):       ${avgTtft.toFixed(2)} ms`);
    }
}

main();
