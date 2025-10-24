import express, { Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";
import { ValidateError } from "tsoa";
import { getErrorMessage } from "./utils.js";
import { RegisterRoutes } from "./routes/routes.js";

dotenv.config();

import "./client.js";
import "./db.js";

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());
RegisterRoutes(app);

const swaggerFilePath = path.join(process.cwd(), "dist", "swagger.json");
app.use("/docs", swaggerUi.serve, async (_req: Request, res: Response, next: NextFunction) => {
    if (!fs.existsSync(swaggerFilePath)) return res.status(404).send("Swagger file not found");

    const swaggerSpec = JSON.parse(fs.readFileSync(swaggerFilePath, "utf-8"));
    swaggerUi.setup(swaggerSpec)(_req, res, next);
});

app.get("/docs.json", (_req: Request, res: Response) => {
    if (!fs.existsSync(swaggerFilePath)) return res.status(404).send({ error: "Swagger file not found" });

    const swaggerSpec = JSON.parse(fs.readFileSync(swaggerFilePath, "utf-8"));
    res.json(swaggerSpec);
});

app.get("/", (_req: Request, res: Response) => {
    res.send("");
});

app.use((err: unknown, _req: Request, res: Response, _next: NextFunction) => {
    void _next;
    if (err instanceof ValidateError) {
        return res.status(400).json({
            message: "Validációs hiba",
            details: getErrorMessage(err),
        });
    }

    if (err && typeof err === "object" && "status" in err && "message" in err) {
        const e = err as { status: number; message: string };
        return res.status(e.status).json({ message: e.message });
    }

    console.error(err);
    return res.status(500).json({ message: "Internal server error" });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
