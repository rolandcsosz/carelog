/* tslint:disable */
/* eslint-disable */
// WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
import type { TsoaRoute } from "@tsoa/runtime";
import { fetchMiddlewares, ExpressTemplateService } from "@tsoa/runtime";
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
import { LogController } from "./../controllers/logController.js";
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
    Todo: {
        dataType: "refObject",
        properties: {
            id: { dataType: "double", required: true },
            subtaskId: { dataType: "double", required: true },
            relationshipId: { dataType: "double", required: true },
            sequenceNumber: { dataType: "double", required: true },
            done: { dataType: "boolean", required: true },
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
    CreateTodoRequest: {
        dataType: "refObject",
        properties: {
            subtaskId: { dataType: "double", required: true },
            relationshipId: { dataType: "double", required: true },
            sequenceNumber: { dataType: "double", required: true },
            done: { dataType: "boolean" },
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
    UpdateTodoRequest: {
        dataType: "refObject",
        properties: {
            subtaskId: { dataType: "double", required: true },
            relationshipId: { dataType: "double", required: true },
            sequenceNumber: { dataType: "double", required: true },
            done: { dataType: "boolean" },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    TaskType: {
        dataType: "refObject",
        properties: {
            id: { dataType: "double", required: true },
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
    SubTask: {
        dataType: "refObject",
        properties: {
            id: { dataType: "double", required: true },
            title: { dataType: "string", required: true },
            taskTypeId: { dataType: "double", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    CreateSubTaskRequest: {
        dataType: "refObject",
        properties: {
            title: { dataType: "string", required: true },
            taskTypeId: { dataType: "double", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    Schedule: {
        dataType: "refObject",
        properties: {
            id: { dataType: "double", required: true },
            relationship_id: { dataType: "double", required: true },
            date: { dataType: "string", required: true },
            start_time: { dataType: "string", required: true },
            end_time: { dataType: "string", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    ScheduleRequest: {
        dataType: "refObject",
        properties: {
            relationshipId: { dataType: "double", required: true },
            date: { dataType: "string", required: true },
            startTime: { dataType: "string", required: true },
            endTime: { dataType: "string", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    Relationship: {
        dataType: "refObject",
        properties: {
            relationship_id: { dataType: "double", required: true },
            recipient_id: { dataType: "double", required: true },
            caregiver_id: { dataType: "double", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    RelationshipRequest: {
        dataType: "refObject",
        properties: {
            recipientId: { dataType: "double", required: true },
            caregiverId: { dataType: "double", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    Caregiver: {
        dataType: "refObject",
        properties: {
            id: { dataType: "double", required: true },
            name: { dataType: "string", required: true },
            email: { dataType: "string", required: true },
            phone: { dataType: "string", required: true },
            password: { dataType: "string", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    Recipient: {
        dataType: "refObject",
        properties: {
            id: { dataType: "double", required: true },
            name: { dataType: "string", required: true },
            email: { dataType: "string", required: true },
            phone: { dataType: "string", required: true },
            address: { dataType: "string", required: true },
            four_hand_care_needed: { dataType: "boolean", required: true },
            caregiver_note: {
                dataType: "union",
                subSchemas: [{ dataType: "string" }, { dataType: "enum", enums: [null] }],
            },
            password: { dataType: "string", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    CreateRecipientRequest: {
        dataType: "refObject",
        properties: {
            name: { dataType: "string", required: true },
            email: { dataType: "string", required: true },
            phone: { dataType: "string", required: true },
            address: { dataType: "string", required: true },
            fourHandCareNeeded: { dataType: "boolean" },
            note: { dataType: "string" },
            password: { dataType: "string", required: true },
        },
        additionalProperties: false,
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
    LoginResponse: {
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
                    id: { dataType: "double", required: true },
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
    LogCreateResponse: {
        dataType: "refObject",
        properties: {
            id: { dataType: "string", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    Error: {
        dataType: "refObject",
        properties: {
            name: { dataType: "string", required: true },
            message: { dataType: "string", required: true },
            stack: { dataType: "string" },
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
            note: { dataType: "string" },
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
    Partial_LogEntry_: {
        dataType: "refAlias",
        type: {
            dataType: "nestedObjectLiteral",
            nestedProperties: {
                id: { dataType: "string" },
                date: { dataType: "string" },
                relationshipId: { dataType: "string" },
                finished: { dataType: "boolean" },
                closed: { dataType: "boolean" },
                tasks: { dataType: "array", array: { dataType: "refObject", ref: "TaskLog" } },
            },
            validators: {},
        },
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    CreateCaregiverRequest: {
        dataType: "refObject",
        properties: {
            name: { dataType: "string", required: true },
            email: { dataType: "string", required: true },
            phone: { dataType: "string", required: true },
            password: { dataType: "string", required: true },
        },
        additionalProperties: false,
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
    Admin: {
        dataType: "refObject",
        properties: {
            id: { dataType: "double", required: true },
            name: { dataType: "string", required: true },
            email: { dataType: "string", required: true },
            password: { dataType: "string", required: true },
        },
        additionalProperties: false,
    },
    // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa
    CreateAdminRequest: {
        dataType: "refObject",
        properties: {
            name: { dataType: "string", required: true },
            email: { dataType: "string", required: true },
            password: { dataType: "string", required: true },
        },
        additionalProperties: false,
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
        body: { in: "body", name: "body", required: true, ref: "CreateTodoRequest" },
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
    const argsTodoController_getTodoById: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "double" },
    };
    app.get(
        "/todos/:id",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(TodoController),
        ...fetchMiddlewares<RequestHandler>(TodoController.prototype.getTodoById),

        async function TodoController_getTodoById(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsTodoController_getTodoById,
                    request,
                    response,
                });

                const controller = new TodoController();

                await templateService.apiHandler({
                    methodName: "getTodoById",
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
        id: { in: "path", name: "id", required: true, dataType: "double" },
        body: { in: "body", name: "body", required: true, ref: "UpdateTodoRequest" },
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
        id: { in: "path", name: "id", required: true, dataType: "double" },
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
        relationshipId: { in: "path", name: "relationshipId", required: true, dataType: "double" },
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
    const argsTaskTypeController_getTaskTypeById: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "double" },
    };
    app.get(
        "/task_types/:id",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(TaskTypeController),
        ...fetchMiddlewares<RequestHandler>(TaskTypeController.prototype.getTaskTypeById),

        async function TaskTypeController_getTaskTypeById(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsTaskTypeController_getTaskTypeById,
                    request,
                    response,
                });

                const controller = new TaskTypeController();

                await templateService.apiHandler({
                    methodName: "getTaskTypeById",
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
    const argsSubTaskController_getSubTaskById: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "double" },
    };
    app.get(
        "/subtasks/:id",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(SubTaskController),
        ...fetchMiddlewares<RequestHandler>(SubTaskController.prototype.getSubTaskById),

        async function SubTaskController_getSubTaskById(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsSubTaskController_getSubTaskById,
                    request,
                    response,
                });

                const controller = new SubTaskController();

                await templateService.apiHandler({
                    methodName: "getSubTaskById",
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
        taskTypeId: { in: "path", name: "taskTypeId", required: true, dataType: "double" },
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
    const argsScheduleController_getScheduleById: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "double" },
    };
    app.get(
        "/schedules/:id",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(ScheduleController),
        ...fetchMiddlewares<RequestHandler>(ScheduleController.prototype.getScheduleById),

        async function ScheduleController_getScheduleById(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsScheduleController_getScheduleById,
                    request,
                    response,
                });

                const controller = new ScheduleController();

                await templateService.apiHandler({
                    methodName: "getScheduleById",
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
        id: { in: "path", name: "id", required: true, dataType: "double" },
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
        id: { in: "path", name: "id", required: true, dataType: "double" },
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
        caregiverId: { in: "path", name: "caregiverId", required: true, dataType: "double" },
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
        recipientId: { in: "path", name: "recipientId", required: true, dataType: "double" },
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
        caregiverId: { in: "path", name: "caregiverId", required: true, dataType: "double" },
        recipientId: { in: "path", name: "recipientId", required: true, dataType: "double" },
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
    const argsRelationshipController_getCaregiversForRecipient: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "double" },
    };
    app.get(
        "/relationships/recipient/:id/caregivers",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(RelationshipController),
        ...fetchMiddlewares<RequestHandler>(RelationshipController.prototype.getCaregiversForRecipient),

        async function RelationshipController_getCaregiversForRecipient(
            request: ExRequest,
            response: ExResponse,
            next: any,
        ) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsRelationshipController_getCaregiversForRecipient,
                    request,
                    response,
                });

                const controller = new RelationshipController();

                await templateService.apiHandler({
                    methodName: "getCaregiversForRecipient",
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
    const argsRelationshipController_getRecipientsForCaregiver: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "double" },
    };
    app.get(
        "/relationships/caregiver/:id/recipients",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(RelationshipController),
        ...fetchMiddlewares<RequestHandler>(RelationshipController.prototype.getRecipientsForCaregiver),

        async function RelationshipController_getRecipientsForCaregiver(
            request: ExRequest,
            response: ExResponse,
            next: any,
        ) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsRelationshipController_getRecipientsForCaregiver,
                    request,
                    response,
                });

                const controller = new RelationshipController();

                await templateService.apiHandler({
                    methodName: "getRecipientsForCaregiver",
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
        id: { in: "path", name: "id", required: true, dataType: "double" },
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
        id: { in: "path", name: "id", required: true, dataType: "double" },
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
    const argsRecipientController_getRecipientById: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "double" },
    };
    app.get(
        "/recipients/:id",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(RecipientController),
        ...fetchMiddlewares<RequestHandler>(RecipientController.prototype.getRecipientById),

        async function RecipientController_getRecipientById(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsRecipientController_getRecipientById,
                    request,
                    response,
                });

                const controller = new RecipientController();

                await templateService.apiHandler({
                    methodName: "getRecipientById",
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
        id: { in: "path", name: "id", required: true, dataType: "double" },
        body: {
            in: "body",
            name: "body",
            required: true,
            dataType: "nestedObjectLiteral",
            nestedProperties: {
                note: { dataType: "string" },
                fourHandCareNeeded: { dataType: "boolean" },
                address: { dataType: "string", required: true },
                phone: { dataType: "string", required: true },
                email: { dataType: "string", required: true },
                name: { dataType: "string", required: true },
            },
        },
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
        id: { in: "path", name: "id", required: true, dataType: "double" },
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
        id: { in: "path", name: "id", required: true, dataType: "double" },
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
    const argsLogController_updateLogById: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "string" },
        updatedFields: { in: "body", name: "updatedFields", required: true, ref: "Partial_LogEntry_" },
    };
    app.put(
        "/logs/:id",
        ...fetchMiddlewares<RequestHandler>(LogController),
        ...fetchMiddlewares<RequestHandler>(LogController.prototype.updateLogById),

        async function LogController_updateLogById(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsLogController_updateLogById,
                    request,
                    response,
                });

                const controller = new LogController();

                await templateService.apiHandler({
                    methodName: "updateLogById",
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
    const argsLogController_deleteLogById: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "string" },
    };
    app.delete(
        "/logs/:id",
        ...fetchMiddlewares<RequestHandler>(LogController),
        ...fetchMiddlewares<RequestHandler>(LogController.prototype.deleteLogById),

        async function LogController_deleteLogById(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsLogController_deleteLogById,
                    request,
                    response,
                });

                const controller = new LogController();

                await templateService.apiHandler({
                    methodName: "deleteLogById",
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
    const argsLogController_getLogsForRecipientCaregiver: Record<string, TsoaRoute.ParameterSchema> = {
        recipientId: { in: "path", name: "recipientId", required: true, dataType: "string" },
        caregiverId: { in: "path", name: "caregiverId", required: true, dataType: "string" },
    };
    app.get(
        "/logs/relationship/:recipientId/:caregiverId",
        ...fetchMiddlewares<RequestHandler>(LogController),
        ...fetchMiddlewares<RequestHandler>(LogController.prototype.getLogsForRecipientCaregiver),

        async function LogController_getLogsForRecipientCaregiver(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsLogController_getLogsForRecipientCaregiver,
                    request,
                    response,
                });

                const controller = new LogController();

                await templateService.apiHandler({
                    methodName: "getLogsForRecipientCaregiver",
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
    const argsCaregiverController_getCaregiverById: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "double" },
    };
    app.get(
        "/caregivers/:id",
        authenticateMiddleware([{ jwt: [] }]),
        ...fetchMiddlewares<RequestHandler>(CaregiverController),
        ...fetchMiddlewares<RequestHandler>(CaregiverController.prototype.getCaregiverById),

        async function CaregiverController_getCaregiverById(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsCaregiverController_getCaregiverById,
                    request,
                    response,
                });

                const controller = new CaregiverController();

                await templateService.apiHandler({
                    methodName: "getCaregiverById",
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
        id: { in: "path", name: "id", required: true, dataType: "double" },
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
        id: { in: "path", name: "id", required: true, dataType: "double" },
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
        id: { in: "path", name: "id", required: true, dataType: "double" },
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
    const argsAdminController_getAdminById: Record<string, TsoaRoute.ParameterSchema> = {
        id: { in: "path", name: "id", required: true, dataType: "double" },
    };
    app.get(
        "/admins/:id",
        authenticateMiddleware([{ jwt: ["admin"] }]),
        ...fetchMiddlewares<RequestHandler>(AdminController),
        ...fetchMiddlewares<RequestHandler>(AdminController.prototype.getAdminById),

        async function AdminController_getAdminById(request: ExRequest, response: ExResponse, next: any) {
            // WARNING: This file was auto-generated with tsoa. Please do not modify it. Re-run tsoa to re-generate this file: https://github.com/lukeautry/tsoa

            let validatedArgs: any[] = [];
            try {
                validatedArgs = templateService.getValidatedArgs({
                    args: argsAdminController_getAdminById,
                    request,
                    response,
                });

                const controller = new AdminController();

                await templateService.apiHandler({
                    methodName: "getAdminById",
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
        id: { in: "path", name: "id", required: true, dataType: "double" },
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
        id: { in: "path", name: "id", required: true, dataType: "double" },
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
        id: { in: "path", name: "id", required: true, dataType: "double" },
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
