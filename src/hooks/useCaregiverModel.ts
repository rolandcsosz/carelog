import { useMutation, useQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";
import {
    DeleteLogsByIdData,
    DeleteLogsByIdResponse,
    DeleteTodosByIdData,
    DeleteTodosByIdResponse,
    GetCaregiversByIdData,
    GetCaregiversByIdRecipientsData,
    GetCaregiversByIdRecipientsResponse,
    GetCaregiversByIdResponse,
    GetLogsRelationshipByRecipientIdByCaregiverIdData,
    GetLogsRelationshipByRecipientIdByCaregiverIdResponse,
    GetRecipientsByIdData,
    GetRecipientsByIdResponse,
    GetSubtasksResponse,
    GetTasktypesResponse,
    GetTodosRelationshipByRelationshipIdData,
    GetTodosRelationshipByRelationshipIdResponse,
    GetTodosResponse,
    PostLogsData,
    PostLogsResponse,
    PostSubtasksData,
    PostSubtasksResponse,
    PostTodosData,
    PostTodosResponse,
    PutCaregiversByIdData,
    PutCaregiversByIdPasswordData,
    PutCaregiversByIdPasswordResponse,
    PutCaregiversByIdResponse,
    PutLogsByIdData,
    PutLogsByIdResponse,
    PutRecipientsByIdData,
    PutRecipientsByIdResponse,
    PutTodosByIdData,
    PutTodosByIdResponse,
} from "../../api/types.gen";
import { CancelablePromise } from "../../api/core/CancelablePromise";
import {
    deleteLogsById,
    deleteTodosById,
    getCaregiversById,
    getCaregiversByIdRecipients,
    getLogsRelationshipByRecipientIdByCaregiverId,
    getRecipientsById,
    getSubtasks,
    getTasktypes,
    getTodos,
    getTodosRelationshipByRelationshipId,
    postLogs,
    postSubtasks,
    postTodos,
    putCaregiversById,
    putCaregiversByIdPassword,
    putLogsById,
    putRecipientsById,
    putTodosById,
} from "../../api/sdk.gen";
import { useAuth } from "./useAuth";
import { fetchSchedulesForCaregiver, throwIfError } from "../utils";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { openLogState } from "../model";
import {
    Caregiver,
    FetchResponse,
    Id,
    Log,
    Recipient,
    Relationship,
    Schedule,
    SubTask,
    TaskType,
    Todo,
} from "../types";

const fetchLogedInUser = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<FetchResponse<R | null>>,
    id: number,
): Promise<Caregiver | null> => {
    const response = await request<GetCaregiversByIdData, GetCaregiversByIdResponse>(getCaregiversById, { id: id });
    if (!response || !response.ok || !response.data) {
        return null;
    }

    return {
        id: Number(response.data?.id) ?? -1,
        name: response.data?.name ?? "",
        email: response.data?.email ?? "",
        phone: response.data?.phone ?? "",
    };
};

const fetchRelationships = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<FetchResponse<R | null>>,
    caregiverId: Id,
): Promise<Relationship[]> => {
    const response = await request<GetCaregiversByIdRecipientsData, GetCaregiversByIdRecipientsResponse>(
        getCaregiversByIdRecipients,
        { id: caregiverId },
    );
    if (!response || !response.ok || !response.data || response.data.length === 0) {
        return [];
    }

    return response.data.map((relationship) => ({
        id: Number(relationship?.relationship_id) || -1,
        caregiverId: Number(caregiverId) || -1,
        recipientId: Number(relationship?.id) || -1,
    })) as Relationship[];
};

const fetchRecipients = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<FetchResponse<R | null>>,
    caregiverId: Id,
): Promise<Recipient[]> => {
    const response = await request<GetCaregiversByIdRecipientsData, GetCaregiversByIdRecipientsResponse>(
        getCaregiversByIdRecipients,
        { id: caregiverId },
    );

    if (!response || !response.ok || !response.data || response.data.length === 0) {
        return [];
    }

    const recipients = await Promise.all(
        response.data.map(async (recipient) => {
            if (!recipient?.id) {
                return null;
            }

            const recipientResponse = await request<GetRecipientsByIdData, GetRecipientsByIdResponse>(
                getRecipientsById,
                { id: recipient.id },
            );

            if (!recipientResponse || !recipientResponse.ok || !recipientResponse.data) {
                return null;
            }

            const r = recipientResponse.data;
            return {
                id: Number(r?.id) || -1,
                name: r?.name || "",
                email: r?.email || "",
                phone: r?.phone || "",
                address: r?.address || "",
                fourHandCareNeeded: r?.four_hand_care_needed || false,
                caregiverNote: r?.caregiver_note || "",
            } as Recipient;
        }),
    );

    return recipients.filter((r): r is Recipient => r !== null);
};

const fetchSchedules = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<FetchResponse<R | null>>,
    caregiverId: Id,
): Promise<Schedule[]> => {
    return await fetchSchedulesForCaregiver(request, caregiverId);
};

const fetchTaskType = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<FetchResponse<R | null>>,
): Promise<TaskType[]> => {
    const response = await request<void, GetTasktypesResponse>(getTasktypes, undefined);

    if (!response || !response.ok || !response.data || response.data.length === 0) {
        return [];
    }

    return response.data.map((taskType) => ({
        id: Number(taskType?.id) || -1,
        name: taskType?.type || "",
    })) as TaskType[];
};

const fetchSubTasks = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<FetchResponse<R | null>>,
): Promise<SubTask[]> => {
    const response = await request<void, GetSubtasksResponse>(getSubtasks, undefined);

    if (!response || !response.ok || !response.data || response.data.length === 0) {
        return [];
    }

    return response.data.map((subtask) => ({
        id: Number(subtask?.id) || -1,
        name: subtask?.title || "",
        taskTypeId: Number((subtask as any)?.tasktypeid ?? (subtask as any)?.tasktypeId ?? -1), // TODO: handle typo
    })) as SubTask[];
};

const fetchTodosForRelationshipId = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<FetchResponse<R | null>>,
    body: GetTodosRelationshipByRelationshipIdData,
): Promise<Todo[]> => {
    const response = await request<
        GetTodosRelationshipByRelationshipIdData,
        GetTodosRelationshipByRelationshipIdResponse
    >(getTodosRelationshipByRelationshipId, body);

    if (!response || !response.ok || !response.data || response.data.length === 0) {
        return [];
    }

    return response.data.map((todo) => ({
        id: Number(todo?.id) || -1,
        subtaskId: Number(todo?.subtaskId) || "",
        relationshipId: Number(todo?.relationshipId) || -1,
        sequence: Number(todo?.sequenceNumber) || -1,
        done: todo?.done || false,
    })) as Todo[];
};

const setTodo = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<FetchResponse<R | null>>,
    body: PutTodosByIdData,
): Promise<FetchResponse<null>> => {
    const response = await request<PutTodosByIdData, PutTodosByIdResponse>(putTodosById, body);

    if (!response || !response.ok || !response.data) {
        return {
            ok: false,
            data: null,
            error: response?.error || "Ismeretlen hiba történt a teendő szerkesztése során.",
        };
    }

    return { ok: true, data: null, error: null };
};

const addTodo = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<FetchResponse<R | null>>,
    body: PostTodosData,
): Promise<FetchResponse<null>> => {
    const response = await request<PostTodosData, PostTodosResponse>(postTodos, body);

    if (!response || !response.ok || !response.data) {
        return {
            ok: false,
            data: null,
            error: response?.error || "Ismeretlen hiba történt a teendő hozzáadása során.",
        };
    }

    return { ok: true, data: null, error: null };
};

const deleteTodo = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<FetchResponse<R | null>>,
    body: DeleteTodosByIdData,
): Promise<FetchResponse<null>> => {
    const response = await request<DeleteTodosByIdData, DeleteTodosByIdResponse>(deleteTodosById, body);

    if (!response || !response.ok || !response.data) {
        return { ok: false, data: null, error: response?.error || "Ismeretlen hiba történt a teendő törlése során." };
    }

    return { ok: true, data: null, error: null };
};

const setPassword = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<FetchResponse<R | null>>,
    body: PutCaregiversByIdPasswordData,
): Promise<FetchResponse<null>> => {
    const response = await request<PutCaregiversByIdPasswordData, PutCaregiversByIdPasswordResponse>(
        putCaregiversByIdPassword,
        body,
    );

    if (!response || !response.ok) {
        return {
            ok: false,
            data: null,
            error: response?.error || "Ismeretlen hiba történt a jelszó beállítása során.",
        };
    }

    return { ok: true, data: null, error: null };
};

const fetchLogs = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<FetchResponse<R | null>>,
    caregiverId: Id,
    recipientIds: Id[],
): Promise<Log[]> => {
    const logs: Log[] = (
        await Promise.all(
            recipientIds.map(async (recipientId) => {
                const response = await request<
                    GetLogsRelationshipByRecipientIdByCaregiverIdData,
                    GetLogsRelationshipByRecipientIdByCaregiverIdResponse
                >(
                    getLogsRelationshipByRecipientIdByCaregiverId,
                    { recipientId: recipientId.toString(), caregiverId: caregiverId.toString() }, // TODO check if this is correct
                );
                if (!response || !response.ok || !response.data || response.data.length === 0) {
                    return [];
                }

                return response.data.map(
                    (log) =>
                        ({
                            id: log?.id || "",
                            date: log?.date ? new Date(log.date) : new Date(),
                            relationshipId: Number(log?.relationshipId) || -1,
                            finished: log?.finished || false,
                            closed: log?.closed || false,
                            tasks:
                                log?.tasks?.map((task) => ({
                                    subTaskId: Number(task?.subTaskId) || "",
                                    startTime: task?.startTime || "",
                                    endTime: task?.endTime || "",
                                    done: task?.done || false,
                                    note: task?.note || "",
                                })) || [],
                        }) as Log,
                );
            }),
        )
    ).flat();

    return logs;
};
const fetchTodos = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<FetchResponse<R | null>>,
): Promise<Todo[]> => {
    const response = await request<void, GetTodosResponse>(getTodos, undefined);
    if (!response || !response.ok || !response.data || response.data.length === 0) {
        return [];
    }

    return response.data.map(
        (todo) =>
            ({
                id: Number(todo?.id) || -1,
                subtaskId: Number((todo as any)?.subtaskid) || -1, //TODO: backend typo
                relationshipId: Number((todo as any)?.relationshipid) || -1,
                sequence: Number((todo as any)?.sequencenumber) || -1,
                done: todo?.done || false,
            }) as Todo,
    );
};

export const useCaregiverModel = () => {
    const { request } = useApi();
    const { user } = useAuth();
    const setOpenLog = useSetRecoilState(openLogState);

    const { data: logedInUser, refetch: refetchLogedInUser } = useQuery<Caregiver | null>({
        queryKey: ["logedInCaregiverUser"],
        queryFn: () => fetchLogedInUser(request, Number(user?.id) ?? -1),
        enabled: !!user?.id && user?.role === "caregiver",
        staleTime: 0,
    });

    const { data: recipients, refetch: refetchRecipients } = useQuery<Recipient[]>({
        queryKey: ["caregiverRecipients", user?.id],
        queryFn: () => fetchRecipients(request, user?.id ?? -1),
        enabled: !!user?.id && user.role === "caregiver",
    });

    const { data: schedule, refetch: refetchSchedules } = useQuery<Schedule[]>({
        queryKey: ["caregiverSchedules", user?.id],
        queryFn: () => fetchSchedules(request, user?.id ?? -1),
        enabled: !!user?.id && user.role === "caregiver",
    });

    const { data: relationships, refetch: refetchRelationships } = useQuery<Relationship[]>({
        queryKey: ["caregiverRelationships", user?.id],
        queryFn: () => fetchRelationships(request, user?.id ?? -1),
        enabled: !!user?.id && user?.role === "caregiver",
        staleTime: 0,
    });

    const { data: subTasks, refetch: refetchSubTasks } = useQuery<SubTask[]>({
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

    const { data: logs, refetch: refetchLogs } = useQuery<Log[]>({
        queryKey: ["logs", user?.id, recipients?.map((c) => c.id).join(",")],
        queryFn: () => fetchLogs(request, user?.id ?? -1, recipients?.map((c) => c.id) || []),
        enabled: !!user?.id && user?.role === "caregiver",
        staleTime: 0,
    });

    const { data: todos, refetch: refetchTodos } = useQuery<Todo[]>({
        queryKey: ["todo", user?.id, recipients?.map((c) => c.id).join(",")],
        queryFn: () => fetchTodos(request),
        enabled: !!user?.id && user?.role === "caregiver",
        staleTime: 0,
    });
    const { mutate: addSubTask } = useMutation({
        mutationFn: async (updateInfo: PostSubtasksData) => {
            const response = await request<PostSubtasksData, PostSubtasksResponse>(postSubtasks, updateInfo);
            throwIfError(response, "Hiba történt a részfeladat hozzáadásakor.");
        },
        onSuccess: () => {
            refetchSubTasks();
        },
        onError: (error: any) => {
            console.error("Error adding subtask:", error);
        },
    });

    const { mutate: updateLogedInUser } = useMutation({
        mutationFn: async (updateInfo: PutCaregiversByIdData) => {
            const response = await request<PutCaregiversByIdData, PutCaregiversByIdResponse>(
                putCaregiversById,
                updateInfo,
            );
            throwIfError(response, "Hiba történt a felhasználó frissítésekor.");
        },
        onSuccess: () => {
            refetchLogedInUser();
        },
        onError: (error: any) => {
            console.error("Error updating user:", error);
        },
    });

    const { mutate: editRecipient } = useMutation({
        mutationFn: async (body: PutRecipientsByIdData) => {
            const response = await request<PutRecipientsByIdData, PutRecipientsByIdResponse>(putRecipientsById, body);
            throwIfError(response, "Hiba történt a kliens szerkesztésekor.");
        },
        onSuccess: () => {
            refetchRecipients();
        },
        onError: (error: any) => {
            console.error("Error editing recipient:", error);
        },
    });

    const { mutate: addLog } = useMutation({
        mutationFn: async (body: PostLogsData) => {
            const response = await request<PostLogsData, PostLogsResponse>(postLogs, body);
            throwIfError(response, "Hiba történt a napló hozzáadásakor.");
        },
        onSuccess: () => {
            setTimeout(() => {
                refetchLogs();
            }, 2000);
        },
        onError: (error: any) => {
            console.error("Error adding log:", error);
        },
    });

    const { mutateAsync: editLog } = useMutation({
        mutationFn: async (body: PutLogsByIdData) => {
            const response = await request<PutLogsByIdData, PutLogsByIdResponse>(putLogsById, body);
            throwIfError(response, "Hiba történt a napló szerkesztése során.");
        },
        onSuccess: () => {
            refetchLogs();
        },
        onError: (error: any) => {
            console.error("Error editing log:", error);
        },
    });

    const { mutate: deleteLog } = useMutation({
        mutationFn: async (body: DeleteLogsByIdData) => {
            const response = await request<DeleteLogsByIdData, DeleteLogsByIdResponse>(deleteLogsById, body);
            throwIfError(response, "Hiba történt a napló törlése során.");
        },
        onSuccess: () => {
            refetchLogs();
        },
        onError: (error: any) => {
            console.error("Error deleting log:", error);
        },
    });

    const { mutate: addTodo } = useMutation({
        mutationFn: async (body: PostTodosData) => {
            const response = await request<PostTodosData, PostTodosResponse>(postTodos, body);
            throwIfError(response, "Hiba történt a teendő hozzáadásakor.");
        },
        onSuccess: () => {
            refetchTodos();
        },
        onError: (error: any) => {
            console.error("Error adding todo:", error);
        },
    });

    const { mutateAsync: editTodo } = useMutation({
        mutationFn: async (body: PutTodosByIdData) => {
            const response = await request<PutTodosByIdData, PutTodosByIdResponse>(putTodosById, body);
            throwIfError(response, "Hiba történt a teendő szerkesztése során.");
        },
        onSuccess: () => {
            refetchTodos();
        },
        onError: (error: any) => {
            console.error("Error editing todo:", error);
        },
    });

    const { mutate: deleteTodo } = useMutation({
        mutationFn: async (body: DeleteTodosByIdData) => {
            const response = await request<DeleteTodosByIdData, DeleteTodosByIdResponse>(deleteTodosById, body);
            throwIfError(response, "Hiba történt a teendő törlése során.");
        },
        onSuccess: () => {
            refetchTodos();
        },
        onError: (error: any) => {
            console.error("Error deleting todo:", error);
        },
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
            return Number(relationship.caregiverId) === Number(user.id);
        });

        const openLog = logs.find(
            (log) =>
                !log.finished &&
                relationshipsForUser.some((relationship) => Number(relationship.id) === Number(log.relationshipId)),
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
            delete: deleteLog,
        },
        todos: {
            list: todos,
            edit: editTodo,
            add: addTodo,
            delete: deleteTodo,
            refetch: refetchTodos,
        },
    };
};
