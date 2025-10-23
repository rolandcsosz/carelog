import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv";
import { getErrorMessage } from "./utils.js";

dotenv.config();

const client = new Client({
    node: process.env.ES_NODE || "http://elasticsearch:9200",
});

async function pingElasticsearch(retries = 5): Promise<void> {
    let attempt = 0;
    while (attempt < retries) {
        try {
            await client.ping();
            console.log("✅ Connected to Elasticsearch!");
            await createLogsIndexIfNotExists();
            return;
        } catch (error) {
            console.error(`❌ Elasticsearch connection attempt ${attempt + 1} failed:`, getErrorMessage(error));
            attempt++;
            if (attempt < retries) {
                console.log("Retrying in 9 seconds...");
                await new Promise((resolve) => setTimeout(resolve, 9000));
            } else {
                console.error("Failed to connect to Elasticsearch after multiple attempts.");
            }
        }
    }
}

async function createLogsIndexIfNotExists(): Promise<void> {
    try {
        const exists = await client.indices.exists({ index: "logs" });

        if (!exists) {
            await client.indices.create({
                index: "logs",
                body: {
                    mappings: {
                        properties: {
                            id: { type: "keyword" },
                            date: { type: "date", format: "yyyy-MM-dd" },
                            relationshipId: { type: "keyword" },
                            finished: { type: "boolean" },
                            closed: { type: "boolean" },
                            tasks: {
                                type: "nested",
                                properties: {
                                    subTaskId: { type: "text" },
                                    startTime: { type: "date", format: "HH:mm:ss" },
                                    endTime: { type: "date", format: "HH:mm:ss" },
                                    done: { type: "boolean" },
                                    note: { type: "text" },
                                },
                            },
                        },
                    },
                },
            });
            console.log("✅ Created 'logs' index in Elasticsearch.");
        } else {
            console.log("✅ 'logs' index already exists.");
        }
    } catch (error) {
        console.error("❌ Failed to create 'logs' index:", getErrorMessage(error));
    }
}

pingElasticsearch();

export default client;
