import express, { Request, Response } from "express";
import swaggerUi from "swagger-ui-express";
import swaggerJSDoc, { Options } from "swagger-jsdoc";
import cors from "cors";

import "./client.js";
import "./db.js";

import * as authQueries from "./routes/auth.js";
import * as postgresQueries from "./routes/postgresQueries.js";
import * as elasticQueries from "./routes/elasticQueries.js";

const app = express();
const port = 8080;

app.use(cors());
app.use(express.json());

const swaggerOptions: Options = {
    swaggerDefinition: {
        openapi: "3.0.0",
        info: {
            title: "Activity logs API",
            version: "1.0.0",
            description: "API documentation using Swagger",
        },
        servers: [
            {
                url: `http://localhost:${port}`,
            },
        ],
        components: {
            securitySchemes: {
                bearerAuth: {
                    type: "http",
                    scheme: "bearer",
                    bearerFormat: "JWT",
                },
            },
        },
        security: [
            {
                bearerAuth: [],
            },
        ],
    },
    apis: ["./routes/*.ts"],
};

const swaggerDocs = swaggerJSDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get("/api-docs.json", (req: Request, res: Response) => {
    res.setHeader("Content-Type", "application/json");
    res.send(swaggerDocs);
});

// Auth
const { authenticate, authorize } = authQueries;
app.post("/login", authQueries.login);

// Admins
app.get("/admins", authenticate, authorize(["admin"]), postgresQueries.getAdmins);
app.post("/admins", authenticate, authorize(["admin"]), postgresQueries.createAdmin);
app.get("/admins/:id", authenticate, authorize(["admin"]), postgresQueries.getAdminById);
app.put("/admins/:id", authenticate, authorize(["admin"]), postgresQueries.updateAdmin);
app.put("/admins/:id/password", authenticate, authorize(["admin"]), postgresQueries.updateAdminPassword);
app.delete("/admins/:id", authenticate, authorize(["admin"]), postgresQueries.deleteAdmin);

// Caregivers
app.get("/caregivers", postgresQueries.getCaregivers);
app.post("/caregivers", postgresQueries.createCaregiver);
app.get("/caregivers/:id", postgresQueries.getCaregiverById);
app.put("/caregivers/:id", postgresQueries.updateCaregiver);
app.put("/caregivers/:id/password", postgresQueries.updateCaregiverPassword);
app.delete("/caregivers/:id", postgresQueries.deleteCaregiver);

// Recipients
app.get("/recipients", postgresQueries.getRecipients);
app.post("/recipients", postgresQueries.createRecipient);
app.get("/recipients/:id", postgresQueries.getRecipientById);
app.put("/recipients/:id", postgresQueries.updateRecipient);
app.put("/recipients/:id/password", postgresQueries.updateRecipientPassword);
app.delete("/recipients/:id", postgresQueries.deleteRecipient);

// Relationships
app.get("/caregivers/:id/recipients", postgresQueries.getRecipientsForCaregiver);
app.get("/recipients/:id/caregivers", postgresQueries.getCaregiversForRecipient);
app.post("/caregivers/recipients", postgresQueries.addRecipientToCaregiver);
app.delete("/relationships/:id", postgresQueries.deleteRelationship);
app.put("/relationships/:id", postgresQueries.updateRelationship);
app.get("/relationships", postgresQueries.getAllRelationships);

// Schedules
app.post("/schedules", postgresQueries.createSchedule);
app.get("/schedules", postgresQueries.getSchedules);
app.get("/schedules/:id", postgresQueries.getScheduleById);
app.put("/schedules/:id", postgresQueries.updateSchedule);
app.delete("/schedules/:id", postgresQueries.deleteSchedule);
app.get("/schedules/caregiver/:caregiverId", postgresQueries.getSchedulesForCaregiver);
app.get("/schedules/recipient/:recipientId", postgresQueries.getSchedulesForRecipient);
app.get("/schedules/:caregiverId/:recipientId", postgresQueries.getSchedulesForCaregiverAndRecipient);

// Task types & subtasks
app.post("/tasktypes", postgresQueries.createTaskType);
app.get("/tasktypes", postgresQueries.getTaskType);
app.get("/tasktypes/:id", postgresQueries.getTaskTypeById);
app.post("/subtasks", postgresQueries.createSubTask);
app.get("/subtasks", postgresQueries.getSubTask);
app.get("/subtasks/:id", postgresQueries.getSubTaskById);
app.get("/subtasks/tasktype/:taskTypeId", postgresQueries.getSubTasksByTaskType);

// Todos
app.post("/todos", postgresQueries.createTodo);
app.get("/todos", postgresQueries.getTodo);
app.get("/todos/:id", postgresQueries.getTodoById);
app.get("/todos/relationship/:relationshipId", postgresQueries.getTodosByRelationship);
app.put("/todos/:id", postgresQueries.updateTodo);
app.delete("/todos/:id", postgresQueries.deleteTodo);

// Logs
app.get("/logs/relationship/:recipientId/:caregiverId", elasticQueries.getLogsForRecipientCaregiver);
app.get("/logs/open", elasticQueries.getOpenLogs);
app.post("/logs", elasticQueries.createLog);
app.get("/logs", elasticQueries.getLogs);
app.get("/logs/:id", elasticQueries.getLogById);
app.put("/logs/:id", elasticQueries.updateLogById);
app.delete("/logs/:id", elasticQueries.deleteLogById);

// Root
app.get("/", (_req: Request, res: Response) => {
    res.send("Hello from our server!");
});

app.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
