import { useQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";
import {
    CaregiverWithoutPassword,
    CreateLogData,
    CreateLogResponse,
    CreateSubTaskData,
    CreateSubTaskResponse,
    CreateTodoData,
    CreateTodoResponse,
    DeleteLogData,
    DeleteLogResponse,
    DeleteTodoData,
    DeleteTodoResponse,
    ErrorResponse,
    GetLogsForRelationshipData,
    GetLogsForRelationshipResponse,
    GetRecipientData,
    GetRecipientResponse,
    GetRelationshipsForCaregiverData,
    GetRelationshipsForCaregiverResponse,
    LogEntry,
    RecipientCaregiverRelationship,
    RecipientWithoutPassword,
    Schedule,
    Subtask,
    SupportedMimeType,
    TaskType,
    Todo,
    UpdateCaregiverData,
    UpdateCaregiverPasswordData,
    UpdateCaregiverResponse,
    UpdateLogData,
    UpdateLogResponse,
    UpdateRecipientData,
    UpdateRecipientResponse,
    UpdateTodoData,
    UpdateTodoResponse,
} from "../../api/types.gen";
import { CancelablePromise } from "../../api/core/CancelablePromise";
import {
    deleteLog,
    deleteTodo,
    getLogsForRelationship,
    getRecipient,
    getSubTasks,
    getTaskTypes,
    getTodos,
    createLog,
    createSubTask,
    updateCaregiver,
    updateCaregiverPassword,
    updateLog,
    updateRecipient,
    updateTodo,
    getCaregiver,
    getRelationshipsForCaregiver,
    createTodo,
    getSupportedMimeTypes,
} from "../../api/sdk.gen";
import { useAuth } from "./useAuth";
import {
    fetchAction,
    fetchData,
    fetchDataNullable,
    fetchSchedulesForCaregiver as fetchSchedules,
    RequestFnType,
    useApiMutation,
} from "../utils";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { openLogState } from "../model";
import { FetchResponse } from "../types";

const fetchRecipients = async (
    request: <P, R>(
        apiCall: (params: P) => CancelablePromise<R | ErrorResponse>,
        params: P,
    ) => Promise<FetchResponse<R | null>>,
    caregiverId: string,
): Promise<RecipientWithoutPassword[]> => {
    const response = await request<GetRelationshipsForCaregiverData, GetRelationshipsForCaregiverResponse>(
        getRelationshipsForCaregiver,
        { id: caregiverId },
    );

    if (!response || !response.ok || !response.data) {
        return [];
    }

    const relationships = response.data as RecipientCaregiverRelationship[];

    const recipients = await Promise.all(
        relationships.map(async (relationship) => {
            if (!relationship.recipientId) {
                return null;
            }

            const recipientResponse = await request<GetRecipientData, GetRecipientResponse>(getRecipient, {
                id: relationship.recipientId,
            });

            if (!recipientResponse || !recipientResponse.ok || !recipientResponse.data) {
                return null;
            }

            return recipientResponse.data as RecipientWithoutPassword;
        }),
    );

    return recipients.filter((recipient): recipient is RecipientWithoutPassword => recipient !== null);
};

const fetchLogs = async (
    request: <P, R>(
        apiCall: (params: P) => CancelablePromise<R | ErrorResponse>,
        params: P,
    ) => Promise<FetchResponse<R | null>>,
    caregiverId: string,
    recipientIds: string[],
): Promise<LogEntry[]> => {
    const logs: LogEntry[] = (
        await Promise.all(
            recipientIds.map(async (recipientId) => {
                const response = await request<GetLogsForRelationshipData, GetLogsForRelationshipResponse>(
                    getLogsForRelationship,
                    {
                        recipientId: recipientId.toString(),
                        caregiverId: caregiverId.toString(),
                    },
                );

                if (!response || !response.ok || !response.data) {
                    return [];
                }

                return response.data as LogEntry[];
            }),
        )
    ).flat();

    return logs;
};

const fetchLogedInUser = (request: RequestFnType, id: string) =>
    fetchDataNullable(request, getCaregiver, { id }, null as CaregiverWithoutPassword | null);

const fetchRelationships = (request: RequestFnType, id: string) =>
    fetchData(request, getRelationshipsForCaregiver, { id }, [] as RecipientCaregiverRelationship[]);

const fetchTaskType = (request: RequestFnType) => fetchData(request, getTaskTypes, undefined, [] as TaskType[]);

const fetchSubTasks = (request: RequestFnType) => fetchData(request, getSubTasks, undefined, [] as Subtask[]);

const setPassword = (request: RequestFnType, data: UpdateCaregiverPasswordData): Promise<FetchResponse<null>> =>
    fetchAction(request, updateCaregiverPassword, data, "Ismeretlen hiba történt a jelszó beállítása során.");

const fetchTodos = (request: RequestFnType) => fetchData(request, getTodos, undefined, [] as Todo[]);

const fetchMimeTypes = (request: RequestFnType) =>
    fetchData(request, getSupportedMimeTypes, undefined, [] as SupportedMimeType[]);

export const useCaregiverModel = () => {
    const { request } = useApi();
    const { user } = useAuth();
    const setOpenLog = useSetRecoilState(openLogState);

    const { data: logedInUser, refetch: refetchLogedInUser } = useQuery<CaregiverWithoutPassword | null>({
        queryKey: ["logedInCaregiverUser"],
        queryFn: () => fetchLogedInUser(request, user?.id ?? ""),
        enabled: !!user?.id && user?.role === "caregiver",
        staleTime: 0,
    });

    const { data: recipients, refetch: refetchRecipients } = useQuery<RecipientWithoutPassword[]>({
        queryKey: ["caregiverRecipients", user?.id],
        queryFn: () => fetchRecipients(request, user?.id ?? ""),
        enabled: !!user?.id && user.role === "caregiver",
    });

    const { data: schedule, refetch: refetchSchedules } = useQuery<Schedule[]>({
        queryKey: ["caregiverSchedules", user?.id],
        queryFn: () => fetchSchedules(request, user?.id ?? ""),
        enabled: !!user?.id && user.role === "caregiver",
    });

    const { data: relationships, refetch: refetchRelationships } = useQuery<RecipientCaregiverRelationship[]>({
        queryKey: ["caregiverRelationships", user?.id],
        queryFn: () => fetchRelationships(request, user?.id ?? ""),
        enabled: !!user?.id && user?.role === "caregiver",
        staleTime: 0,
    });

    const { data: subTasks, refetch: refetchSubTasks } = useQuery<Subtask[]>({
        queryKey: ["subTasks"],
        queryFn: () => fetchSubTasks(request),
        enabled: !!user?.id && user?.role === "caregiver",
        staleTime: 0,
    });

    const { data: taskTypes, refetch: refetchTaskTypes } = useQuery<TaskType[]>({
        queryKey: ["taskTypes", user?.id],
        queryFn: () => fetchTaskType(request),
        enabled: !!user?.id && user?.role === "caregiver",
        staleTime: 0,
    });

    const { data: logs, refetch: refetchLogs } = useQuery<LogEntry[]>({
        queryKey: ["logs", user?.id, recipients?.map((c) => c.id).join(",")],
        queryFn: () => fetchLogs(request, user?.id ?? "", recipients?.map((c) => c.id) || []),
        enabled: !!user?.id && user?.role === "caregiver",
        staleTime: 0,
    });

    const { data: todos, refetch: refetchTodos } = useQuery<Todo[]>({
        queryKey: ["todo", user?.id, recipients?.map((c) => c.id).join(",")],
        queryFn: () => fetchTodos(request),
        enabled: !!user?.id && user?.role === "caregiver",
        staleTime: 0,
    });

    const { data: mimeTypes } = useQuery<SupportedMimeType[]>({
        queryKey: ["mimeTypes"],
        queryFn: () => fetchMimeTypes(request),
        enabled: !!user?.id && user?.role === "caregiver",
    });

    const { mutate: addSubTask } = useApiMutation<CreateSubTaskData, CreateSubTaskResponse>({
        request,
        apiCall: createSubTask,
        throwMessage: "Hiba történt a részfeladat hozzáadásakor.",
        onSuccess: refetchSubTasks,
        onError: (error) => console.error("Error adding subtask:", error),
    });

    const { mutate: updateLogedInUser } = useApiMutation<UpdateCaregiverData, UpdateCaregiverResponse>({
        request,
        apiCall: updateCaregiver,
        throwMessage: "Hiba történt a felhasználó frissítésekor.",
        onSuccess: refetchLogedInUser,
        onError: (error) => console.error("Error updating user:", error),
    });

    const { mutate: editRecipient } = useApiMutation<UpdateRecipientData, UpdateRecipientResponse>({
        request,
        apiCall: updateRecipient,
        throwMessage: "Hiba történt a kliens szerkesztésekor.",
        onSuccess: refetchRecipients,
        onError: (error) => console.error("Error editing recipient:", error),
    });

    const { mutate: addLog } = useApiMutation<CreateLogData, CreateLogResponse>({
        request,
        apiCall: createLog,
        throwMessage: "Hiba történt a napló hozzáadásakor.",
        onSuccess: () => {
            setTimeout(() => {
                refetchLogs();
            }, 1000);
        },
        onError: (error) => console.error("Error adding log:", error),
    });

    const { mutate: editLog } = useApiMutation<UpdateLogData, UpdateLogResponse>({
        request,
        apiCall: updateLog,
        throwMessage: "Hiba történt a napló szerkesztése során.",
        onSuccess: refetchLogs,
        onError: (error) => console.error("Error editing log:", error),
    });

    const { mutate: removeLog } = useApiMutation<DeleteLogData, DeleteLogResponse>({
        request,
        apiCall: deleteLog,
        throwMessage: "Hiba történt a napló törlése során.",
        onSuccess: refetchLogs,
        onError: (error) => console.error("Error deleting log:", error),
    });

    const { mutate: addTodo } = useApiMutation<CreateTodoData, CreateTodoResponse>({
        request,
        apiCall: createTodo,
        throwMessage: "Hiba történt a teendő hozzáadásakor.",
        onSuccess: refetchTodos,
        onError: (error) => console.error("Error adding todo:", error),
    });

    const { mutate: editTodo } = useApiMutation<UpdateTodoData, UpdateTodoResponse>({
        request,
        apiCall: updateTodo,
        throwMessage: "Hiba történt a teendő szerkesztése során.",
        onSuccess: refetchTodos,
        onError: (error) => console.error("Error editing todo:", error),
    });

    const { mutate: removeTodo } = useApiMutation<DeleteTodoData, DeleteTodoResponse>({
        request,
        apiCall: deleteTodo,
        throwMessage: "Hiba történt a teendő szerkesztése során.",
        onSuccess: refetchTodos,
        onError: (error) => console.error("Error deleting todo:", error),
    });

    useEffect(() => {
        if (user?.role === "caregiver" && relationships) {
            refetchRecipients();
        }
    }, [relationships]);

    useEffect(() => {
        if (user?.role !== "caregiver" || !logs || !relationships) {
            return;
        }
        const relationshipsForUser = relationships.filter((relationship) => {
            return relationship.caregiverId === user.id;
        });

        const openLog = logs.find(
            (log) =>
                !log.finished && relationshipsForUser.some((relationship) => relationship.id === log.relationshipId),
        );
        setOpenLog(openLog || null);
    }, [logs, relationships, user?.role, setOpenLog]);

    return {
        user: {
            list: logedInUser,
            update: updateLogedInUser,
            setPassword: setPassword,
        },
        recipients: {
            list: recipients,
            edit: editRecipient,
            refetch: refetchRecipients,
        },
        schedules: {
            list: schedule,
            refetch: refetchSchedules,
            fetchForRecipient: fetchSchedules,
            fetchForCaregiver: fetchSchedules,
            add: () => Promise.resolve(),
            edit: () => Promise.resolve(),
            remove: () => Promise.resolve(),
        },
        relationships: {
            list: relationships,
            refetch: refetchRelationships,
        },
        taskTypes: {
            list: taskTypes,
            refetch: refetchTaskTypes,
        },
        subTasks: {
            list: subTasks,
            add: addSubTask,
            refetch: refetchTaskTypes,
        },
        logs: {
            list: logs,
            add: addLog,
            refetch: refetchLogs,
            edit: editLog,
            remove: removeLog,
        },
        todos: {
            list: todos,
            edit: editTodo,
            add: addTodo,
            remove: removeTodo,
            refetch: refetchTodos,
        },
        mimeTypes: mimeTypes,
    };
};
