import { Request, Response } from "express";
import elasticClient from "../client.js";
import db from "../db.js";
import { getErrorMessage } from "../utils.js";
import { LogEntry } from "../model.js";

const createLog = async (req: Request, res: Response): Promise<void> => {
    const LogEntry: LogEntry = req.body;

    try {
        const result = await elasticClient.index({
            index: "logs",
            body: LogEntry,
        });

        const id = result._id;

        await elasticClient.update({
            index: "logs",
            id,
            body: {
                doc: { id },
            },
        });

        res.status(201).json({ message: "Log created", id });
    } catch (err: unknown) {
        const error = getErrorMessage(err);
        console.error("Hiba:", error);
        res.status(500).json({ error: "Hiba", message: error });
    }
};

const getLogs = async (_req: Request, res: Response): Promise<void> => {
    try {
        const result = await elasticClient.search<LogEntry>({
            index: "logs",
            query: { match_all: {} },
            size: 1000,
        });

        const logs = result.hits.hits.map((hit) => {
            if (!hit._source) {
                return null;
            }

            return hit._source;
        });

        res.status(200).json(logs.filter((log): log is LogEntry => log !== null));
    } catch (err: unknown) {
        const error = getErrorMessage(err);
        console.error("Hiba:", error);
        res.status(500).json({ error: "Hiba", message: error });
    }
};

const getLogById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const result = await elasticClient.search({
            index: "logs",
            query: { term: { id } },
        });

        const logs = result.hits?.hits[0]?._source || null;

        if (!logs) {
            res.status(404).json({ error: "Nincs ilyen tevékenységnapló" });
            return;
        }

        res.status(200).json(logs);
    } catch (err: unknown) {
        const error = getErrorMessage(err);
        console.error("Hiba az Elasticsearch lekérdezésnél:", error);
        res.status(500).json({ error: "Hiba", message: error });
    }
};

const updateLogById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;
    const updatedFields: Partial<LogEntry> = req.body;

    try {
        const searchResult = await elasticClient.search({
            index: "logs",
            query: { term: { id } },
        });

        const log = searchResult.hits?.hits[0];
        if (!log) {
            res.status(404).json({ error: "Nincs ilyen tevékenységnapló" });
            return;
        }

        const { _id } = log;

        await elasticClient.update({
            index: "logs",
            id: _id,
            doc: updatedFields,
        });

        res.status(200).send("Tevékenységnapló frissítve");
    } catch (err: unknown) {
        const error = getErrorMessage(err);
        console.error("Hiba:", error);
        res.status(500).json({ error: "Hiba", message: error });
    }
};

const getOpenLogs = async (_req: Request, res: Response): Promise<void> => {
    try {
        const result = await elasticClient.search<LogEntry>({
            index: "logs",
            query: { term: { closed: false } },
        });

        const logs = result.hits.hits.map((hit) => {
            if (!hit._source) {
                return null;
            }

            return hit._source;
        });

        res.status(200).json(logs.filter((log): log is LogEntry => log !== null));
    } catch (err: unknown) {
        const error = getErrorMessage(err);
        console.error("Error fetching open logs:", error);
        res.status(500).json({ error: "Error fetching open logs", details: error });
    }
};

const deleteLogById = async (req: Request, res: Response): Promise<void> => {
    const { id } = req.params;

    try {
        const searchResult = await elasticClient.search({
            index: "logs",
            query: { term: { id } },
        });

        const log = searchResult.hits?.hits[0];
        if (!log) {
            res.status(404).json({ error: "Nincs ilyen tevékenységnapló" });
            return;
        }

        const { _id } = log;

        await elasticClient.delete({
            index: "logs",
            id: _id,
        });

        res.status(200).send("Tevékenységnapló törölve");
    } catch (err: unknown) {
        const error = getErrorMessage(err);
        console.error("Hiba:", error);
        res.status(500).json({ error: "Hiba", message: error });
    }
};

const getLogsForRecipientCaregiver = async (req: Request, res: Response): Promise<void> => {
    const { recipientId, caregiverId } = req.params;

    try {
        const pgResult = await db.query(
            "SELECT relationship_id FROM recipients_caregivers WHERE recipient_id = $1 AND caregiver_id = $2",
            [recipientId, caregiverId],
        );

        if (pgResult.rowCount === 0) {
            res.status(404).json({ message: "Relationship not found" });
            return;
        }

        const relationshipId = pgResult.rows[0].relationship_id;

        const result = await elasticClient.search<LogEntry>({
            index: "logs",
            query: { term: { relationshipId } },
        });

        const logs = result.hits.hits.map((hit) => {
            if (!hit._source) {
                return null;
            }

            return hit._source;
        });

        res.json(logs);
    } catch (err: unknown) {
        const error = getErrorMessage(err);
        console.error("Error fetching logs for recipient/caregiver:", error);
        res.status(500).json({ message: "Server error" });
    }
};

export { createLog, getLogs, getLogById, updateLogById, deleteLogById, getOpenLogs, getLogsForRecipientCaregiver };
