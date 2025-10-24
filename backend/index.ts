import express, { Request, Response, NextFunction } from "express";
import swaggerUi from "swagger-ui-express";
import cors from "cors";
import dotenv from "dotenv";
import * as path from "path";
import * as fs from "fs";

dotenv.config();

import { RegisterRoutes } from "./routes/routes.js";
import "./client.js";
import "./db.js";

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());
RegisterRoutes(app);

const swaggerFilePath = path.join("swagger.json");
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

app.use((err: unknown, _req: Request, res: Response, _next: any) => {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
