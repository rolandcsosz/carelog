/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from "@tsoa/runtime";
import { fetchMiddlewares, ExpressTemplateService } from "@tsoa/runtime";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LogController } from "./../controllers/logController.js";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { VoiceConverterController } from "./../controllers/voiceConverterController.js";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TodoController } from "./../controllers/todoController.js";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { TaskTypeController } from "./../controllers/taskTypeController.js";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { SubTaskController } from "./../controllers/subTaskController.js";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ScheduleController } from "./../controllers/scheduleController.js";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RelationshipController } from "./../controllers/relationshipController.js";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { RecipientController } from "./../controllers/receipientController.js";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { LoginController } from "./../controllers/loginController.js";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { ChatController } from "./../controllers/chatController.js";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { CaregiverController } from "./../controllers/caregiverController.js";
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import { AdminController } from "./../controllers/adminController.js";
import { expressAuthentication } from "./auth.js";
// @ts-ignore - no great way to install types from subpackage
import type { Request as ExRequest, Response as ExResponse, RequestHandler, Router } from "express";

const expressAuthenticationRecasted = expressAuthentication as (
    req: ExRequest,
    securityName: string,
    scopes?: string[],
    res?: ExResponse,
) => Promise<any>;

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

const models: TsoaRoute.Models = {
    LogCreateResponse: {
        dataType: "refObject",
        properties: {
            id: { dataType: "string", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ErrorResponse: {
        dataType: "refObject",
        properties: {
            error: { dataType: "string", required: true },
            message: { dataType: "string", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    TaskLog: {
        dataType: "refObject",
        properties: {
            subTaskId: { dataType: "string", required: true },
            startTime: { dataType: "string", required: true },
            endTime: { dataType: "string", required: true },
            done: { dataType: "boolean", required: true },
            note: { dataType: "string", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    LogEntry: {
        dataType: "refObject",
        properties: {
            id: { dataType: "string", required: true },
            date: { dataType: "string", required: true },
            relationshipId: { dataType: "string", required: true },
            finished: { dataType: "boolean", required: true },
            closed: { dataType: "boolean", required: true },
            tasks: { dataType: "array", array: { dataType: "refObject", ref: "TaskLog" }, required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    SuccessResponse: {
        dataType: "refObject",
        properties: {
            message: { dataType: "string", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    UpdateLogEntry: {
        dataType: "refObject",
        properties: {
            date: { dataType: "string", required: true },
            relationshipId: { dataType: "string", required: true },
            finished: { dataType: "boolean", required: true },
            closed: { dataType: "boolean", required: true },
            tasks: { dataType: "array", array: { dataType: "refObject", ref: "TaskLog" }, required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    SupportedMimeType: {
        dataType: "refObject",
        properties: {
            id: { dataType: "string", required: true },
            type: { dataType: "string", required: true },
            googleType: { dataType: "string", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    VoiceConvertingRequest: {
        dataType: "refObject",
        properties: {
            logId: { dataType: "string", required: true },
            inputMimeType: { dataType: "string", required: true },
            base64Audio: { dataType: "string", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    Todo: {
        dataType: "refObject",
        properties: {
            id: { dataType: "string", required: true },
            relationshipId: {
                dataType: "union",
                subSchemas: [{ dataType: "string" }, { dataType: "enum", enums: [null] }],
                required: true,
            },
            subtaskId: { dataType: "string", required: true },
            sequenceNumber: { dataType: "double", required: true },
            done: { dataType: "boolean", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    CreateOrUpdateTodoRequest: {
        dataType: "refObject",
        properties: {
            subtaskId: { dataType: "string", required: true },
            relationshipId: {
                dataType: "union",
                subSchemas: [{ dataType: "string" }, { dataType: "enum", enums: [null] }],
                required: true,
            },
            sequenceNumber: { dataType: "double", required: true },
            done: { dataType: "boolean", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    TaskType: {
        dataType: "refObject",
        properties: {
            id: { dataType: "string", required: true },
            type: { dataType: "string", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    CreateTaskTypeRequest: {
        dataType: "refObject",
        properties: {
            type: { dataType: "string", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    Subtask: {
        dataType: "refObject",
        properties: {
            id: { dataType: "string", required: true },
            title: { dataType: "string", required: true },
            taskTypeId: {
                dataType: "union",
                subSchemas: [{ dataType: "string" }, { dataType: "enum", enums: [null] }],
                required: true,
            },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    CreateSubTaskRequest: {
        dataType: "refObject",
        properties: {
            title: { dataType: "string", required: true },
            taskTypeId: { dataType: "string", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    Schedule: {
        dataType: "refObject",
        properties: {
            id: { dataType: "string", required: true },
            date: { dataType: "datetime", required: true },
            relationshipId: { dataType: "string", required: true },
            startTime: { dataType: "string", required: true },
            endTime: { dataType: "string", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ScheduleRequest: {
        dataType: "refObject",
        properties: {
            date: { dataType: "datetime", required: true },
            relationshipId: { dataType: "string", required: true },
            startTime: { dataType: "string", required: true },
            endTime: { dataType: "string", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    RecipientCaregiverRelationship: {
        dataType: "refObject",
        properties: {
            id: { dataType: "string", required: true },
            recipientId: { dataType: "string", required: true },
            caregiverId: { dataType: "string", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    RelationshipRequest: {
        dataType: "refObject",
        properties: {
            recipientId: { dataType: "string", required: true },
            caregiverId: { dataType: "string", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    RecipientWithoutPassword: {
        dataType: "refObject",
        properties: {
            id: { dataType: "string", required: true },
            name: { dataType: "string", required: true },
            email: { dataType: "string", required: true },
            phone: { dataType: "string", required: true },
            address: { dataType: "string", required: true },
            fourHandCareNeeded: { dataType: "boolean", required: true },
            caregiverNote: { dataType: "string", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    CreateRecipientRequest: {
        dataType: "refAlias",
        type: {
            dataType: "nestedObjectLiteral",
            nestedProperties: {
                caregiverNote: { dataType: "string", required: true },
                fourHandCareNeeded: { dataType: "boolean", required: true },
                address: { dataType: "string", required: true },
                password: { dataType: "string", required: true },
                phone: { dataType: "string", required: true },
                email: { dataType: "string", required: true },
                name: { dataType: "string", required: true },
            },
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    UpdateRecipientRequest: {
        dataType: "refAlias",
        type: {
            dataType: "nestedObjectLiteral",
            nestedProperties: {
                caregiverNote: { dataType: "string", required: true },
                fourHandCareNeeded: { dataType: "boolean", required: true },
                address: { dataType: "string", required: true },
                phone: { dataType: "string", required: true },
                email: { dataType: "string", required: true },
                name: { dataType: "string", required: true },
            },
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    UpdateRecipientPasswordRequest: {
        dataType: "refObject",
        properties: {
            currentPassword: { dataType: "string", required: true },
            newPassword: { dataType: "string", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    LoginSuccessResponse: {
        dataType: "refObject",
        properties: {
            role: {
                dataType: "union",
                subSchemas: [
                    { dataType: "enum", enums: ["admin"] },
                    { dataType: "enum", enums: ["caregiver"] },
                ],
                required: true,
            },
            token: { dataType: "string", required: true },
            user: {
                dataType: "nestedObjectLiteral",
                nestedProperties: {
                    email: { dataType: "string", required: true },
                    name: { dataType: "string", required: true },
                    id: { dataType: "string", required: true },
                },
                required: true,
            },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    LoginRequest: {
        dataType: "refObject",
        properties: {
            email: { dataType: "string", required: true },
            password: { dataType: "string", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    Message: {
        dataType: "refObject",
        properties: {
            id: { dataType: "string", required: true },
            status: { dataType: "string", required: true },
            senderRole: { dataType: "string", required: true },
            content: { dataType: "string", required: true },
            time: { dataType: "datetime", required: true },
            userId: { dataType: "string", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    MessagePageInfo: {
        dataType: "refObject",
        properties: {
            page: { dataType: "double", required: true },
            pageSize: { dataType: "double", required: true },
            totalMessages: { dataType: "double", required: true },
            totalPages: { dataType: "double", required: true },
            messages: { dataType: "array", array: { dataType: "refObject", ref: "Message" }, required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    SendMessageBody: {
        dataType: "refObject",
        properties: {
            caregiverId: { dataType: "string", required: true },
            content: { dataType: "string", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    CaregiverWithoutPassword: {
        dataType: "refObject",
        properties: {
            id: { dataType: "string", required: true },
            name: { dataType: "string", required: true },
            email: { dataType: "string", required: true },
            phone: { dataType: "string", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    CreateCaregiverRequest: {
        dataType: "refAlias",
        type: {
            dataType: "nestedObjectLiteral",
            nestedProperties: {
                password: { dataType: "string", required: true },
                phone: { dataType: "string", required: true },
                email: { dataType: "string", required: true },
                name: { dataType: "string", required: true },
            },
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    UpdateCaregiverPasswordRequest: {
        dataType: "refObject",
        properties: {
            currentPassword: { dataType: "string", required: true },
            newPassword: { dataType: "string", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    AdminWithoutPassword: {
        dataType: "refAlias",
        type: {
            dataType: "nestedObjectLiteral",
            nestedProperties: {
                email: { dataType: "string", required: true },
                name: { dataType: "string", required: true },
                id: { dataType: "string", required: true },
            },
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    CreateAdminRequest: {
        dataType: "refAlias",
        type: {
            dataType: "nestedObjectLiteral",
            nestedProperties: {
                password: { dataType: "string", required: true },
                email: { dataType: "string", required: true },
                name: { dataType: "string", required: true },
            },
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    UpdateAdminPasswordRequest: {
        dataType: "refObject",
        properties: {
            currentPassword: { dataType: "string", required: true },
            newPassword: { dataType: "string", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
};
const templateService = new ExpressTemplateService(models, {
    noImplicitAdditionalProperties: "throw-on-extras",
    bodyCoercion: true,
});

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

export function RegisterRoutes(app: Router) {
    // ###########################################################################################################
    //  NOTE: If you do not see routes for all of your controllers in this file, then you might not have informed tsoa of where to look
    //      Please look into the "controllerPathGlobs" config option described in the readme: https://github.com/lukeautry/tsoa
    // ###########################################################################################################

    const argsLogController_createLog: Record<string, TsoaRoute.ParameterSchema> = {
        logEntry: { in: "body", name: "logEntry", required: true, ref: "LogEntry" },
    };
    app.post(
        "/logs",
        ...fetchMiddlewares<RequestHandler>(LogController),
        ...fetchMiddlewares<RequestHandler>(LogController.prototype.createLog),

        async function LogController_createLog(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsLogController_createLog,
                    request,
                    response,
                });

                const controller = new LogController();

                await templateService.apiHandler({
                    methodName: "createLog",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsLogController_getLogs: Record<string, TsoaRoute.ParameterSchema> = {};
    app.get(
        "/logs",
        ...fetchMiddlewares<RequestHandler>(LogController),
        ...fetchMiddlewares<RequestHandler>(LogController.prototype.getLogs),

        async function LogController_getLogs(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsLogController_getLogs,
                    request,
                    response,
                });

                const controller = new LogController();

                await templateService.apiHandler({
                    methodName: "getLogs",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsLogController_getLogById: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "string" },
    };
    app.get(
        "/logs/:id",
        ...fetchMiddlewares<RequestHandler>(LogController),
        ...fetchMiddlewares<RequestHandler>(LogController.prototype.getLogById),

        async function LogController_getLogById(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsLogController_getLogById,
                    request,
                    response,
                });

                const controller = new LogController();

                await templateService.apiHandler({
                    methodName: "getLogById",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsLogController_updateLog: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "string" },
        updatedFields: { in: "body", name: "updatedFields", required: true, ref: "UpdateLogEntry" },
    };
    app.put(
        "/logs/:id",
        ...fetchMiddlewares<RequestHandler>(LogController),
        ...fetchMiddlewares<RequestHandler>(LogController.prototype.updateLog),

        async function LogController_updateLog(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsLogController_updateLog,
                    request,
                    response,
                });

                const controller = new LogController();

                await templateService.apiHandler({
                    methodName: "updateLog",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsLogController_deleteLog: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "string" },
    };
    app.delete(
        "/logs/:id",
        ...fetchMiddlewares<RequestHandler>(LogController),
        ...fetchMiddlewares<RequestHandler>(LogController.prototype.deleteLog),

        async function LogController_deleteLog(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsLogController_deleteLog,
                    request,
                    response,
                });

                const controller = new LogController();

                await templateService.apiHandler({
                    methodName: "deleteLog",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsLogController_getOpenLogs: Record<string, TsoaRoute.ParameterSchema> = {};
    app.get(
        "/logs/open",
        ...fetchMiddlewares<RequestHandler>(LogController),
        ...fetchMiddlewares<RequestHandler>(LogController.prototype.getOpenLogs),

        async function LogController_getOpenLogs(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsLogController_getOpenLogs,
                    request,
                    response,
                });

                const controller = new LogController();

                await templateService.apiHandler({
                    methodName: "getOpenLogs",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsLogController_getLogsForRelationship: Record<string, TsoaRoute.ParameterSchema> = {
        recipientId: { in: "path", name: "recipientId", required: true, dataType: "string" },
        caregiverId: { in: "path", name: "caregiverId", required: true, dataType: "string" },
    };
    app.get(
        "/logs/relationship/:recipientId/:caregiverId",
        ...fetchMiddlewares<RequestHandler>(LogController),
        ...fetchMiddlewares<RequestHandler>(LogController.prototype.getLogsForRelationship),

        async function LogController_getLogsForRelationship(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsLogController_getLogsForRelationship,
                    request,
                    response,
                });

                const controller = new LogController();

                await templateService.apiHandler({
                    methodName: "getLogsForRelationship",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsVoiceConverterController_getSupportedMimeTypes: Record<string, TsoaRoute.ParameterSchema> = {};
    app.get(
        "/mime-types",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(VoiceConverterController),
        ...fetchMiddlewares<RequestHandler>(VoiceConverterController.prototype.getSupportedMimeTypes),

        async function VoiceConverterController_getSupportedMimeTypes(
            request: ExRequest,
            response: ExResponse,
            next: any,
        ) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsVoiceConverterController_getSupportedMimeTypes,
                    request,
                    response,
                });

                const controller = new VoiceConverterController();

                await templateService.apiHandler({
                    methodName: "getSupportedMimeTypes",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsVoiceConverterController_processAudio: Record<string, TsoaRoute.ParameterSchema> = {
        body: { in: "body", name: "body", required: true, ref: "VoiceConvertingRequest" },
    };
    app.post(
        "/process-audio",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(VoiceConverterController),
        ...fetchMiddlewares<RequestHandler>(VoiceConverterController.prototype.processAudio),

        async function VoiceConverterController_processAudio(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsVoiceConverterController_processAudio,
                    request,
                    response,
                });

                const controller = new VoiceConverterController();

                await templateService.apiHandler({
                    methodName: "processAudio",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsTodoController_getTodos: Record<string, TsoaRoute.ParameterSchema> = {};
    app.get(
        "/todos",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(TodoController),
        ...fetchMiddlewares<RequestHandler>(TodoController.prototype.getTodos),

        async function TodoController_getTodos(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsTodoController_getTodos,
                    request,
                    response,
                });

                const controller = new TodoController();

                await templateService.apiHandler({
                    methodName: "getTodos",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsTodoController_createTodo: Record<string, TsoaRoute.ParameterSchema> = {
        body: { in: "body", name: "body", required: true, ref: "CreateOrUpdateTodoRequest" },
    };
    app.post(
        "/todos",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(TodoController),
        ...fetchMiddlewares<RequestHandler>(TodoController.prototype.createTodo),

        async function TodoController_createTodo(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsTodoController_createTodo,
                    request,
                    response,
                });

                const controller = new TodoController();

                await templateService.apiHandler({
                    methodName: "createTodo",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsTodoController_getTodo: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "string" },
    };
    app.get(
        "/todos/:id",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(TodoController),
        ...fetchMiddlewares<RequestHandler>(TodoController.prototype.getTodo),

        async function TodoController_getTodo(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsTodoController_getTodo,
                    request,
                    response,
                });

                const controller = new TodoController();

                await templateService.apiHandler({
                    methodName: "getTodo",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsTodoController_updateTodo: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "string" },
        body: { in: "body", name: "body", required: true, ref: "CreateOrUpdateTodoRequest" },
    };
    app.put(
        "/todos/:id",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(TodoController),
        ...fetchMiddlewares<RequestHandler>(TodoController.prototype.updateTodo),

        async function TodoController_updateTodo(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsTodoController_updateTodo,
                    request,
                    response,
                });

                const controller = new TodoController();

                await templateService.apiHandler({
                    methodName: "updateTodo",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsTodoController_deleteTodo: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "string" },
    };
    app.delete(
        "/todos/:id",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(TodoController),
        ...fetchMiddlewares<RequestHandler>(TodoController.prototype.deleteTodo),

        async function TodoController_deleteTodo(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsTodoController_deleteTodo,
                    request,
                    response,
                });

                const controller = new TodoController();

                await templateService.apiHandler({
                    methodName: "deleteTodo",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsTodoController_getTodosByRelationship: Record<string, TsoaRoute.ParameterSchema> = {
        relationshipId: { in: "path", name: "relationshipId", required: true, dataType: "string" },
    };
    app.get(
        "/todos/relationship/:relationshipId",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(TodoController),
        ...fetchMiddlewares<RequestHandler>(TodoController.prototype.getTodosByRelationship),

        async function TodoController_getTodosByRelationship(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsTodoController_getTodosByRelationship,
                    request,
                    response,
                });

                const controller = new TodoController();

                await templateService.apiHandler({
                    methodName: "getTodosByRelationship",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsTaskTypeController_createTaskType: Record<string, TsoaRoute.ParameterSchema> = {
        body: { in: "body", name: "body", required: true, ref: "CreateTaskTypeRequest" },
    };
    app.post(
        "/task_types",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(TaskTypeController),
        ...fetchMiddlewares<RequestHandler>(TaskTypeController.prototype.createTaskType),

        async function TaskTypeController_createTaskType(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsTaskTypeController_createTaskType,
                    request,
                    response,
                });

                const controller = new TaskTypeController();

                await templateService.apiHandler({
                    methodName: "createTaskType",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsTaskTypeController_getTaskTypes: Record<string, TsoaRoute.ParameterSchema> = {};
    app.get(
        "/task_types",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(TaskTypeController),
        ...fetchMiddlewares<RequestHandler>(TaskTypeController.prototype.getTaskTypes),

        async function TaskTypeController_getTaskTypes(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsTaskTypeController_getTaskTypes,
                    request,
                    response,
                });

                const controller = new TaskTypeController();

                await templateService.apiHandler({
                    methodName: "getTaskTypes",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsTaskTypeController_getTaskType: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "string" },
    };
    app.get(
        "/task_types/:id",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(TaskTypeController),
        ...fetchMiddlewares<RequestHandler>(TaskTypeController.prototype.getTaskType),

        async function TaskTypeController_getTaskType(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsTaskTypeController_getTaskType,
                    request,
                    response,
                });

                const controller = new TaskTypeController();

                await templateService.apiHandler({
                    methodName: "getTaskType",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsSubTaskController_createSubTask: Record<string, TsoaRoute.ParameterSchema> = {
        body: { in: "body", name: "body", required: true, ref: "CreateSubTaskRequest" },
    };
    app.post(
        "/subtasks",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(SubTaskController),
        ...fetchMiddlewares<RequestHandler>(SubTaskController.prototype.createSubTask),

        async function SubTaskController_createSubTask(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsSubTaskController_createSubTask,
                    request,
                    response,
                });

                const controller = new SubTaskController();

                await templateService.apiHandler({
                    methodName: "createSubTask",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsSubTaskController_getSubTasks: Record<string, TsoaRoute.ParameterSchema> = {};
    app.get(
        "/subtasks",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(SubTaskController),
        ...fetchMiddlewares<RequestHandler>(SubTaskController.prototype.getSubTasks),

        async function SubTaskController_getSubTasks(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsSubTaskController_getSubTasks,
                    request,
                    response,
                });

                const controller = new SubTaskController();

                await templateService.apiHandler({
                    methodName: "getSubTasks",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsSubTaskController_getSubTask: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "string" },
    };
    app.get(
        "/subtasks/:id",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(SubTaskController),
        ...fetchMiddlewares<RequestHandler>(SubTaskController.prototype.getSubTask),

        async function SubTaskController_getSubTask(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsSubTaskController_getSubTask,
                    request,
                    response,
                });

                const controller = new SubTaskController();

                await templateService.apiHandler({
                    methodName: "getSubTask",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsSubTaskController_getSubTasksByTaskType: Record<string, TsoaRoute.ParameterSchema> = {
        taskTypeId: { in: "path", name: "taskTypeId", required: true, dataType: "string" },
    };
    app.get(
        "/subtasks/task-type/:taskTypeId",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(SubTaskController),
        ...fetchMiddlewares<RequestHandler>(SubTaskController.prototype.getSubTasksByTaskType),

        async function SubTaskController_getSubTasksByTaskType(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsSubTaskController_getSubTasksByTaskType,
                    request,
                    response,
                });

                const controller = new SubTaskController();

                await templateService.apiHandler({
                    methodName: "getSubTasksByTaskType",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsScheduleController_createSchedule: Record<string, TsoaRoute.ParameterSchema> = {
        body: { in: "body", name: "body", required: true, ref: "ScheduleRequest" },
    };
    app.post(
        "/schedules",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(ScheduleController),
        ...fetchMiddlewares<RequestHandler>(ScheduleController.prototype.createSchedule),

        async function ScheduleController_createSchedule(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsScheduleController_createSchedule,
                    request,
                    response,
                });

                const controller = new ScheduleController();

                await templateService.apiHandler({
                    methodName: "createSchedule",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsScheduleController_getSchedules: Record<string, TsoaRoute.ParameterSchema> = {};
    app.get(
        "/schedules",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(ScheduleController),
        ...fetchMiddlewares<RequestHandler>(ScheduleController.prototype.getSchedules),

        async function ScheduleController_getSchedules(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsScheduleController_getSchedules,
                    request,
                    response,
                });

                const controller = new ScheduleController();

                await templateService.apiHandler({
                    methodName: "getSchedules",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsScheduleController_getSchedule: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "string" },
    };
    app.get(
        "/schedules/:id",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(ScheduleController),
        ...fetchMiddlewares<RequestHandler>(ScheduleController.prototype.getSchedule),

        async function ScheduleController_getSchedule(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsScheduleController_getSchedule,
                    request,
                    response,
                });

                const controller = new ScheduleController();

                await templateService.apiHandler({
                    methodName: "getSchedule",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsScheduleController_updateSchedule: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "string" },
        body: { in: "body", name: "body", required: true, ref: "ScheduleRequest" },
    };
    app.put(
        "/schedules/:id",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(ScheduleController),
        ...fetchMiddlewares<RequestHandler>(ScheduleController.prototype.updateSchedule),

        async function ScheduleController_updateSchedule(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsScheduleController_updateSchedule,
                    request,
                    response,
                });

                const controller = new ScheduleController();

                await templateService.apiHandler({
                    methodName: "updateSchedule",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsScheduleController_deleteSchedule: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "string" },
    };
    app.delete(
        "/schedules/:id",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(ScheduleController),
        ...fetchMiddlewares<RequestHandler>(ScheduleController.prototype.deleteSchedule),

        async function ScheduleController_deleteSchedule(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsScheduleController_deleteSchedule,
                    request,
                    response,
                });

                const controller = new ScheduleController();

                await templateService.apiHandler({
                    methodName: "deleteSchedule",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsScheduleController_getSchedulesForCaregiver: Record<string, TsoaRoute.ParameterSchema> = {
        caregiverId: { in: "path", name: "caregiverId", required: true, dataType: "string" },
    };
    app.get(
        "/schedules/caregiver/:caregiverId",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(ScheduleController),
        ...fetchMiddlewares<RequestHandler>(ScheduleController.prototype.getSchedulesForCaregiver),

        async function ScheduleController_getSchedulesForCaregiver(
            request: ExRequest,
            response: ExResponse,
            next: any,
        ) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsScheduleController_getSchedulesForCaregiver,
                    request,
                    response,
                });

                const controller = new ScheduleController();

                await templateService.apiHandler({
                    methodName: "getSchedulesForCaregiver",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsScheduleController_getSchedulesForRecipient: Record<string, TsoaRoute.ParameterSchema> = {
        recipientId: { in: "path", name: "recipientId", required: true, dataType: "string" },
    };
    app.get(
        "/schedules/recipient/:recipientId",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(ScheduleController),
        ...fetchMiddlewares<RequestHandler>(ScheduleController.prototype.getSchedulesForRecipient),

        async function ScheduleController_getSchedulesForRecipient(
            request: ExRequest,
            response: ExResponse,
            next: any,
        ) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsScheduleController_getSchedulesForRecipient,
                    request,
                    response,
                });

                const controller = new ScheduleController();

                await templateService.apiHandler({
                    methodName: "getSchedulesForRecipient",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsScheduleController_getSchedulesForCaregiverAndRecipient: Record<string, TsoaRoute.ParameterSchema> = {
        caregiverId: { in: "path", name: "caregiverId", required: true, dataType: "string" },
        recipientId: { in: "path", name: "recipientId", required: true, dataType: "string" },
    };
    app.get(
        "/schedules/caregiver/:caregiverId/recipient/:recipientId",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(ScheduleController),
        ...fetchMiddlewares<RequestHandler>(ScheduleController.prototype.getSchedulesForCaregiverAndRecipient),

        async function ScheduleController_getSchedulesForCaregiverAndRecipient(
            request: ExRequest,
            response: ExResponse,
            next: any,
        ) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsScheduleController_getSchedulesForCaregiverAndRecipient,
                    request,
                    response,
                });

                const controller = new ScheduleController();

                await templateService.apiHandler({
                    methodName: "getSchedulesForCaregiverAndRecipient",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsRelationshipController_addRecipientToCaregiver: Record<string, TsoaRoute.ParameterSchema> = {
        body: { in: "body", name: "body", required: true, ref: "RelationshipRequest" },
    };
    app.post(
        "/relationships",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(RelationshipController),
        ...fetchMiddlewares<RequestHandler>(RelationshipController.prototype.addRecipientToCaregiver),

        async function RelationshipController_addRecipientToCaregiver(
            request: ExRequest,
            response: ExResponse,
            next: any,
        ) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsRelationshipController_addRecipientToCaregiver,
                    request,
                    response,
                });

                const controller = new RelationshipController();

                await templateService.apiHandler({
                    methodName: "addRecipientToCaregiver",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsRelationshipController_getRelationshipsForRecipient: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "string" },
    };
    app.get(
        "/relationships/recipient/:id/caregivers",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(RelationshipController),
        ...fetchMiddlewares<RequestHandler>(RelationshipController.prototype.getRelationshipsForRecipient),

        async function RelationshipController_getRelationshipsForRecipient(
            request: ExRequest,
            response: ExResponse,
            next: any,
        ) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsRelationshipController_getRelationshipsForRecipient,
                    request,
                    response,
                });

                const controller = new RelationshipController();

                await templateService.apiHandler({
                    methodName: "getRelationshipsForRecipient",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsRelationshipController_getRelationshipsForCaregiver: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "string" },
    };
    app.get(
        "/relationships/caregiver/:id/recipients",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(RelationshipController),
        ...fetchMiddlewares<RequestHandler>(RelationshipController.prototype.getRelationshipsForCaregiver),

        async function RelationshipController_getRelationshipsForCaregiver(
            request: ExRequest,
            response: ExResponse,
            next: any,
        ) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsRelationshipController_getRelationshipsForCaregiver,
                    request,
                    response,
                });

                const controller = new RelationshipController();

                await templateService.apiHandler({
                    methodName: "getRelationshipsForCaregiver",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsRelationshipController_getAllRelationships: Record<string, TsoaRoute.ParameterSchema> = {};
    app.get(
        "/relationships",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(RelationshipController),
        ...fetchMiddlewares<RequestHandler>(RelationshipController.prototype.getAllRelationships),

        async function RelationshipController_getAllRelationships(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsRelationshipController_getAllRelationships,
                    request,
                    response,
                });

                const controller = new RelationshipController();

                await templateService.apiHandler({
                    methodName: "getAllRelationships",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsRelationshipController_updateRelationship: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "string" },
        body: { in: "body", name: "body", required: true, ref: "RelationshipRequest" },
    };
    app.put(
        "/relationships/:id",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(RelationshipController),
        ...fetchMiddlewares<RequestHandler>(RelationshipController.prototype.updateRelationship),

        async function RelationshipController_updateRelationship(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsRelationshipController_updateRelationship,
                    request,
                    response,
                });

                const controller = new RelationshipController();

                await templateService.apiHandler({
                    methodName: "updateRelationship",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsRelationshipController_deleteRelationship: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "string" },
    };
    app.delete(
        "/relationships/:id",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(RelationshipController),
        ...fetchMiddlewares<RequestHandler>(RelationshipController.prototype.deleteRelationship),

        async function RelationshipController_deleteRelationship(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsRelationshipController_deleteRelationship,
                    request,
                    response,
                });

                const controller = new RelationshipController();

                await templateService.apiHandler({
                    methodName: "deleteRelationship",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsRecipientController_getRecipients: Record<string, TsoaRoute.ParameterSchema> = {};
    app.get(
        "/recipients",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(RecipientController),
        ...fetchMiddlewares<RequestHandler>(RecipientController.prototype.getRecipients),

        async function RecipientController_getRecipients(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsRecipientController_getRecipients,
                    request,
                    response,
                });

                const controller = new RecipientController();

                await templateService.apiHandler({
                    methodName: "getRecipients",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsRecipientController_getRecipient: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "string" },
    };
    app.get(
        "/recipients/:id",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(RecipientController),
        ...fetchMiddlewares<RequestHandler>(RecipientController.prototype.getRecipient),

        async function RecipientController_getRecipient(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsRecipientController_getRecipient,
                    request,
                    response,
                });

                const controller = new RecipientController();

                await templateService.apiHandler({
                    methodName: "getRecipient",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsRecipientController_createRecipient: Record<string, TsoaRoute.ParameterSchema> = {
        body: { in: "body", name: "body", required: true, ref: "CreateRecipientRequest" },
    };
    app.post(
        "/recipients",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(RecipientController),
        ...fetchMiddlewares<RequestHandler>(RecipientController.prototype.createRecipient),

        async function RecipientController_createRecipient(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsRecipientController_createRecipient,
                    request,
                    response,
                });

                const controller = new RecipientController();

                await templateService.apiHandler({
                    methodName: "createRecipient",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsRecipientController_updateRecipient: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "string" },
        body: { in: "body", name: "body", required: true, ref: "UpdateRecipientRequest" },
    };
    app.put(
        "/recipients/:id",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(RecipientController),
        ...fetchMiddlewares<RequestHandler>(RecipientController.prototype.updateRecipient),

        async function RecipientController_updateRecipient(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsRecipientController_updateRecipient,
                    request,
                    response,
                });

                const controller = new RecipientController();

                await templateService.apiHandler({
                    methodName: "updateRecipient",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsRecipientController_updateRecipientPassword: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "string" },
        body: { in: "body", name: "body", required: true, ref: "UpdateRecipientPasswordRequest" },
    };
    app.put(
        "/recipients/:id/password",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(RecipientController),
        ...fetchMiddlewares<RequestHandler>(RecipientController.prototype.updateRecipientPassword),

        async function RecipientController_updateRecipientPassword(
            request: ExRequest,
            response: ExResponse,
            next: any,
        ) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsRecipientController_updateRecipientPassword,
                    request,
                    response,
                });

                const controller = new RecipientController();

                await templateService.apiHandler({
                    methodName: "updateRecipientPassword",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsRecipientController_deleteRecipient: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "string" },
    };
    app.delete(
        "/recipients/:id",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(RecipientController),
        ...fetchMiddlewares<RequestHandler>(RecipientController.prototype.deleteRecipient),

        async function RecipientController_deleteRecipient(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsRecipientController_deleteRecipient,
                    request,
                    response,
                });

                const controller = new RecipientController();

                await templateService.apiHandler({
                    methodName: "deleteRecipient",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsLoginController_login: Record<string, TsoaRoute.ParameterSchema> = {
        body: { in: "body", name: "body", required: true, ref: "LoginRequest" },
    };
    app.post(
        "/login",
        ...fetchMiddlewares<RequestHandler>(LoginController),
        ...fetchMiddlewares<RequestHandler>(LoginController.prototype.login),

        async function LoginController_login(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsLoginController_login,
                    request,
                    response,
                });

                const controller = new LoginController();

                await templateService.apiHandler({
                    methodName: "login",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsChatController_getChatHistory: Record<string, TsoaRoute.ParameterSchema> = {
        caregiverId: { in: "path", name: "caregiverId", required: true, dataType: "string" },
        page: { default: 1, in: "query", name: "page", dataType: "double" },
        pageSize: { default: 20, in: "query", name: "pageSize", dataType: "double" },
    };
    app.get(
        "/chat/:caregiverId",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(ChatController),
        ...fetchMiddlewares<RequestHandler>(ChatController.prototype.getChatHistory),

        async function ChatController_getChatHistory(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsChatController_getChatHistory,
                    request,
                    response,
                });

                const controller = new ChatController();

                await templateService.apiHandler({
                    methodName: "getChatHistory",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsChatController_sendMessage: Record<string, TsoaRoute.ParameterSchema> = {
        body: { in: "body", name: "body", required: true, ref: "SendMessageBody" },
    };
    app.post(
        "/chat",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(ChatController),
        ...fetchMiddlewares<RequestHandler>(ChatController.prototype.sendMessage),

        async function ChatController_sendMessage(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsChatController_sendMessage,
                    request,
                    response,
                });

                const controller = new ChatController();

                await templateService.apiHandler({
                    methodName: "sendMessage",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsCaregiverController_getCaregivers: Record<string, TsoaRoute.ParameterSchema> = {};
    app.get(
        "/caregivers",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(CaregiverController),
        ...fetchMiddlewares<RequestHandler>(CaregiverController.prototype.getCaregivers),

        async function CaregiverController_getCaregivers(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsCaregiverController_getCaregivers,
                    request,
                    response,
                });

                const controller = new CaregiverController();

                await templateService.apiHandler({
                    methodName: "getCaregivers",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsCaregiverController_getCaregiver: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "string" },
    };
    app.get(
        "/caregivers/:id",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(CaregiverController),
        ...fetchMiddlewares<RequestHandler>(CaregiverController.prototype.getCaregiver),

        async function CaregiverController_getCaregiver(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsCaregiverController_getCaregiver,
                    request,
                    response,
                });

                const controller = new CaregiverController();

                await templateService.apiHandler({
                    methodName: "getCaregiver",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsCaregiverController_createCaregiver: Record<string, TsoaRoute.ParameterSchema> = {
        body: { in: "body", name: "body", required: true, ref: "CreateCaregiverRequest" },
    };
    app.post(
        "/caregivers",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(CaregiverController),
        ...fetchMiddlewares<RequestHandler>(CaregiverController.prototype.createCaregiver),

        async function CaregiverController_createCaregiver(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsCaregiverController_createCaregiver,
                    request,
                    response,
                });

                const controller = new CaregiverController();

                await templateService.apiHandler({
                    methodName: "createCaregiver",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsCaregiverController_updateCaregiver: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "string" },
        body: {
            in: "body",
            name: "body",
            required: true,
            dataType: "nestedObjectLiteral",
            nestedProperties: {
                phone: { dataType: "string", required: true },
                email: { dataType: "string", required: true },
                name: { dataType: "string", required: true },
            },
        },
    };
    app.put(
        "/caregivers/:id",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(CaregiverController),
        ...fetchMiddlewares<RequestHandler>(CaregiverController.prototype.updateCaregiver),

        async function CaregiverController_updateCaregiver(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsCaregiverController_updateCaregiver,
                    request,
                    response,
                });

                const controller = new CaregiverController();

                await templateService.apiHandler({
                    methodName: "updateCaregiver",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsCaregiverController_updateCaregiverPassword: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "string" },
        body: { in: "body", name: "body", required: true, ref: "UpdateCaregiverPasswordRequest" },
    };
    app.put(
        "/caregivers/:id/password",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(CaregiverController),
        ...fetchMiddlewares<RequestHandler>(CaregiverController.prototype.updateCaregiverPassword),

        async function CaregiverController_updateCaregiverPassword(
            request: ExRequest,
            response: ExResponse,
            next: any,
        ) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsCaregiverController_updateCaregiverPassword,
                    request,
                    response,
                });

                const controller = new CaregiverController();

                await templateService.apiHandler({
                    methodName: "updateCaregiverPassword",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsCaregiverController_deleteCaregiver: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "string" },
    };
    app.delete(
        "/caregivers/:id",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(CaregiverController),
        ...fetchMiddlewares<RequestHandler>(CaregiverController.prototype.deleteCaregiver),

        async function CaregiverController_deleteCaregiver(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsCaregiverController_deleteCaregiver,
                    request,
                    response,
                });

                const controller = new CaregiverController();

                await templateService.apiHandler({
                    methodName: "deleteCaregiver",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_getAdmins: Record<string, TsoaRoute.ParameterSchema> = {};
    app.get(
        "/admins",
        authenticateMiddleware([{ jwt: ["admin"] }]),
        ...fetchMiddlewares<RequestHandler>(AdminController),
        ...fetchMiddlewares<RequestHandler>(AdminController.prototype.getAdmins),

        async function AdminController_getAdmins(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsAdminController_getAdmins,
                    request,
                    response,
                });

                const controller = new AdminController();

                await templateService.apiHandler({
                    methodName: "getAdmins",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_getAdmin: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "string" },
    };
    app.get(
        "/admins/:id",
        authenticateMiddleware([{ jwt: ["admin"] }]),
        ...fetchMiddlewares<RequestHandler>(AdminController),
        ...fetchMiddlewares<RequestHandler>(AdminController.prototype.getAdmin),

        async function AdminController_getAdmin(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsAdminController_getAdmin,
                    request,
                    response,
                });

                const controller = new AdminController();

                await templateService.apiHandler({
                    methodName: "getAdmin",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_createAdmin: Record<string, TsoaRoute.ParameterSchema> = {
        body: { in: "body", name: "body", required: true, ref: "CreateAdminRequest" },
    };
    app.post(
        "/admins",
        authenticateMiddleware([{ jwt: ["admin"] }]),
        ...fetchMiddlewares<RequestHandler>(AdminController),
        ...fetchMiddlewares<RequestHandler>(AdminController.prototype.createAdmin),

        async function AdminController_createAdmin(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsAdminController_createAdmin,
                    request,
                    response,
                });

                const controller = new AdminController();

                await templateService.apiHandler({
                    methodName: "createAdmin",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_updateAdmin: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "string" },
        body: {
            in: "body",
            name: "body",
            required: true,
            dataType: "nestedObjectLiteral",
            nestedProperties: {
                email: { dataType: "string", required: true },
                name: { dataType: "string", required: true },
            },
        },
    };
    app.put(
        "/admins/:id",
        authenticateMiddleware([{ jwt: ["admin"] }]),
        ...fetchMiddlewares<RequestHandler>(AdminController),
        ...fetchMiddlewares<RequestHandler>(AdminController.prototype.updateAdmin),

        async function AdminController_updateAdmin(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsAdminController_updateAdmin,
                    request,
                    response,
                });

                const controller = new AdminController();

                await templateService.apiHandler({
                    methodName: "updateAdmin",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_updateAdminPassword: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "string" },
        body: { in: "body", name: "body", required: true, ref: "UpdateAdminPasswordRequest" },
    };
    app.put(
        "/admins/:id/password",
        authenticateMiddleware([{ jwt: ["admin"] }]),
        ...fetchMiddlewares<RequestHandler>(AdminController),
        ...fetchMiddlewares<RequestHandler>(AdminController.prototype.updateAdminPassword),

        async function AdminController_updateAdminPassword(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsAdminController_updateAdminPassword,
                    request,
                    response,
                });

                const controller = new AdminController();

                await templateService.apiHandler({
                    methodName: "updateAdminPassword",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    const argsAdminController_deleteAdmin: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "string" },
    };
    app.delete(
        "/admins/:id",
        authenticateMiddleware([{ jwt: ["admin"] }]),
        ...fetchMiddlewares<RequestHandler>(AdminController),
        ...fetchMiddlewares<RequestHandler>(AdminController.prototype.deleteAdmin),

        async function AdminController_deleteAdmin(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsAdminController_deleteAdmin,
                    request,
                    response,
                });

                const controller = new AdminController();

                await templateService.apiHandler({
                    methodName: "deleteAdmin",
                    controller,
                    response,
                    next,
                    validatedArgs,
                    successStatus: undefined,
                });
            } catch (err) {
                return next(err);
            }
        },
    );
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

    function authenticateMiddleware(security: TsoaRoute.Security[] = []) {
        return async function runAuthenticationMiddleware(request: any, response: any, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            // keep track of failed auth attempts so we can hand back the most
            // recent one.  This behavior was previously existing so preserving it
            // here
            const failedAttempts: any[] = [];
            const pushAndRethrow = (error: any) => {
                failedAttempts.push(error);
                throw error;
            };

            const secMethodOrPromises: Promise<any>[] = [];
            for (const secMethod of security) {
                if (Object.keys(secMethod).length > 1) {
                    const secMethodAndPromises: Promise<any>[] = [];

                    for (const name in secMethod) {
                        secMethodAndPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response).catch(
                                pushAndRethrow,
                            ),
                        );
                    }

                    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

                    secMethodOrPromises.push(
                        Promise.all(secMethodAndPromises).then((users) => {
                            return users[0];
                        }),
                    );
                } else {
                    for (const name in secMethod) {
                        secMethodOrPromises.push(
                            expressAuthenticationRecasted(request, name, secMethod[name], response).catch(
                                pushAndRethrow,
                            ),
                        );
                    }
                }
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            try {
                request["user"] = await Promise.any(secMethodOrPromises);

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }

                next();
            } catch (err) {
                // Show most recent error as response
                const error = failedAttempts.pop();
                error.status = error.status || 401;

                // Response was sent in middleware, abort
                if (response.writableEnded) {
                    return;
                }
                next(error);
            }

            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
        };
    }

    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
}

// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
