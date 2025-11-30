import { Client } from "@elastic/elasticsearch";
import dotenv from "dotenv";
import { getErrorMessage } from "./utils.js";
import fs from "fs/promises";

dotenv.config();

const client = new Client({
    node: process.env.ES_NODE || "http://elasticsearch:9200",
});

const pingElasticsearch = async (retries = 5): Promise<void> => {
    let attempt = 0;
    while (attempt < retries) {
        try {
            await client.ping();
            console.log("✔ Connected to Elasticsearch!");
            await createLogsIndexIfNotExists();
            await createEmbeddingsIndexIfNotExists();
            return;
        } catch (error) {
            console.error(`Elasticsearch connection attempt ${attempt + 1} failed:`, getErrorMessage(error));
            attempt++;
            if (attempt < retries) {
                console.log("Retrying in 9 seconds...");
                await new Promise((resolve) => setTimeout(resolve, 9000));
            } else {
                console.error("✖ Failed to connect to Elasticsearch after multiple attempts.");
            }
        }
    }
};

const createLogsIndexIfNotExists = async (): Promise<void> => {
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
            console.log("✔ Created 'logs' index in Elasticsearch.");
        } else {
            console.log("✔ 'logs' index already exists.");
        }
    } catch (error) {
        console.error("✖ Failed to create 'logs' index:", getErrorMessage(error));
    }
};

export const createEmbeddingsIndexIfNotExists = async (): Promise<void> => {
    try {
        const exists = await client.indices.exists({ index: "embeddings" });

        if (!exists) {
            await client.indices.create({
                index: "embeddings",
                body: {
                    mappings: {
                        properties: {
                            source: { type: "keyword" },
                            text: { type: "text" },
                            embedding: {
                                type: "dense_vector",
                                dims: 3072,
                            },
                        },
                    },
                },
            });
            console.log("✔ Created 'embeddings' index in Elasticsearch.");
        } else {
            console.log("✔ 'embeddings' index already exists.");
            return;
        }

        const rawData = await fs.readFile("./rag/data/embeddings/embeddings.json", "utf-8");
        const data = JSON.parse(rawData);

        const bulkBody = data.flatMap((doc: any) => [
            { index: { _index: "embeddings" } },
            {
                source: doc.source,
                text: doc.text,
                embedding: doc.embedding,
            },
        ]);

        const bulkResponse = await client.bulk({ refresh: true, body: bulkBody });

        if (bulkResponse.errors) {
            console.error("✖ Some documents failed to insert:", bulkResponse.errors);
        } else {
            console.log(`✔ Inserted ${data.length} embeddings.`);
        }
    } catch (error) {
        console.error("✖ Failed to create or populate 'embeddings' index:", error);
    }
};

pingElasticsearch();

export default client;
