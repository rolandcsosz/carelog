import { readFileSync } from "fs";

export const getErrorMessage = (error: unknown): string => {
    if (error instanceof Error) {
        return error.message;
    } else if (typeof error === "string") {
        return error;
    } else if (typeof error === "object" && error !== null && "message" in error && typeof error.message === "string") {
        return error.message;
    }
    return "Ismeretlen hiba történt";
};

export const getErrorCode = (error: unknown): string => {
    if (typeof error === "object" && error !== null && "code" in error && typeof error.code === "string") {
        return error.code;
    }
    return "";
};

export const parseRows = <T>(rows: unknown): T[] => {
    if (!Array.isArray(rows)) {
        return [];
    }

    try {
        return rows.map((row) => ({ ...(row as T) }));
    } catch {
        return [];
    }
};

export const loadCsvToMap = (filePath: string): Map<string, string> => {
    const data = readFileSync(filePath, "utf8");
    const lines = data.split(/\r?\n/);

    const map = new Map<string, string>();

    for (const line of lines) {
        if (!line.trim()) continue;

        const [key, value] = line.split(",");
        if (key && value) {
            map.set(key.trim(), value.trim());
        }
    }

    return map;
};
