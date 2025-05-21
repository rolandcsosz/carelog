import { useMutation, useQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";
import {
    GetCaregiversByIdData,
    GetCaregiversByIdRecipientsData,
    GetCaregiversByIdRecipientsResponse,
    GetCaregiversByIdResponse,
    GetLogsRelationshipByRecipientIdByCaregiverIdData,
    GetLogsRelationshipByRecipientIdByCaregiverIdResponse,
    GetTasktypesResponse,
    PostLogsData,
    PostLogsResponse,
    PutCaregiversByIdData,
    PutCaregiversByIdResponse,
    PutLogsByIdData,
    PutLogsByIdResponse,
    PutRecipientsByIdData,
    PutRecipientsByIdResponse,
} from "../../api/types.gen";
import { CancelablePromise } from "../../api/core/CancelablePromise";
import {
    getCaregiversById,
    getCaregiversByIdRecipients,
    getLogsRelationshipByRecipientIdByCaregiverId,
    getTasktypes,
    postLogs,
    putCaregiversById,
    putLogsById,
    putRecipientsById,
} from "../../api/sdk.gen";
import { useAuth } from "./useAuth";
import { fetchSchedulesForCaregiver } from "../utils";
import { useEffect } from "react";
import { useSetRecoilState } from "recoil";
import { openLogState } from "../model";

const fetchLogedInUser = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<R | null>,
    id: number,
): Promise<Caregiver | null> => {
    const response = await request<GetCaregiversByIdData, GetCaregiversByIdResponse>(getCaregiversById, { id: id });
    if (!response) {
        return null;
    }

    return {
        id: response.id ?? -1,
        name: response.name ?? "",
        email: response.email ?? "",
        phone: response.phone ?? "",
    };
};

const fetchRelationships = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<R | null>,
    caregiverId: Id,
): Promise<Relationship[]> => {
    const response = await request<GetCaregiversByIdRecipientsData, GetCaregiversByIdRecipientsResponse>(
        getCaregiversByIdRecipients,
        { id: caregiverId },
    );
    if (!response || response.length === 0) {
        return [];
    }

    return response.map((relationship) => ({
        id: Number(relationship?.relationship_id) || -1,
        caregiverId: Number(caregiverId) || -1,
        recipientId: Number(relationship?.id) || -1,
    })) as Relationship[];
};

const fetchRecipients = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<R | null>,
    caregiverId: Id,
): Promise<Recipient[]> => {
    const response = await request<GetCaregiversByIdRecipientsData, GetCaregiversByIdRecipientsResponse>(
        getCaregiversByIdRecipients,
        { id: caregiverId },
    );
    if (!response || response.length === 0) {
        return [];
    }

    return response.map(
        (recipient) =>
            ({
                id: Number(recipient?.id) || "",
                name: recipient?.name || "",
                email: recipient?.email || "",
                phone: recipient?.phone || "",
                address: recipient?.address || "",
                fourHandCareNeeded: false, // recipient?.four_hand_care_needed TODO missing?
                caregiverNote: "", // recipient?.caregiver_note TODO missing?
            }) as Recipient,
    );
};

const fetchSchedules = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<R | null>,
    caregiverId: Id,
): Promise<Schedule[]> => {
    return await fetchSchedulesForCaregiver(request, caregiverId);
};

const fetchTaskType = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<R | null>,
): Promise<TaskType[]> => {
    const response = await request<void, GetTasktypesResponse>(getTasktypes, undefined);

    if (!response || response.length === 0) {
        return [];
    }

    return response.map((taskType) => ({
        id: Number(taskType?.id) || -1,
        name: taskType?.type || "",
    })) as TaskType[];
};

const fetchLogs = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<R | null>,
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
                if (!response || response.length === 0) {
                    return [];
                }

                return response.map(
                    (log) =>
                        ({
                            id: log?.id || "",
                            date: log?.date ? new Date(log.date) : new Date(),
                            relationshipId: Number(log?.relationshipId) || -1,
                            finished: log?.finished || false,
                            closed: log?.closed || false,
                            tasks:
                                log?.tasks?.map((task) => ({
                                    subTaskId: task?.subTaskId || "",
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

    const { data: taskTypes, refetch: refetchTaskTypes } = useQuery<TaskType[]>({
        queryKey: ["taskTypes", user?.id],
        queryFn: () => fetchTaskType(request),
        enabled: !!user?.id && user?.role === "caregiver",
        staleTime: 0,
    });

    const { data: logs, refetch: refetchLogs } = useQuery<Log[]>({
        queryKey: ["taskTypes", user?.id, recipients?.map((c) => c.id).join(",")],
        queryFn: () => fetchLogs(request, user?.id ?? -1, recipients?.map((c) => c.id) || []),
        enabled: !!user?.id && user?.role === "caregiver",
        staleTime: 0,
    });

    const { mutate: updateLogedInUser } = useMutation({
        mutationFn: (updateInfo: PutCaregiversByIdData) =>
            request<PutCaregiversByIdData, PutCaregiversByIdResponse>(putCaregiversById, updateInfo),
        onSuccess: () => {
            refetchLogedInUser();
        },
        onError: (error: any) => {
            console.error("Error updating user:", error);
        },
    });

    const { mutate: editRecipient } = useMutation({
        mutationFn: (body: PutRecipientsByIdData) =>
            request<PutRecipientsByIdData, PutRecipientsByIdResponse>(putRecipientsById, body),
        onSuccess: () => {
            refetchRecipients();
        },
        onError: (error: any) => {
            console.error("Error editing recipient:", error);
        },
    });

    const { mutate: addLog } = useMutation({
        mutationFn: (body: PostLogsData) => request<PostLogsData, PostLogsResponse>(postLogs, body),
        onSuccess: () => {
            refetchLogs();
        },
        onError: (error: any) => {
            console.error("Error adding log:", error);
        },
    });

    const { mutate: editLog } = useMutation({
        mutationFn: (body: PutLogsByIdData) => request<PutLogsByIdData, PutLogsByIdResponse>(putLogsById, body),
        onSuccess: () => {
            refetchLogs();
        },
        onError: (error: any) => {
            console.error("Error editing log:", error);
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
            return relationship.caregiverId === Number(user.id);
        });

        const openLog = logs.find(
            (log) =>
                !log.finished && relationshipsForUser.some((relationship) => relationship.id === log.relationshipId),
        );
        setOpenLog(openLog || null);
    }, [logs, relationships, user?.role, setOpenLog]);

    return {
        user: {
            info: logedInUser,
            update: updateLogedInUser,
        },
        recipients: {
            info: recipients,
            edit: editRecipient,
            refetch: refetchRecipients,
        },
        schedules: {
            info: schedule,
            refetch: refetchSchedules,
        },
        relationships: {
            info: relationships,
            refetch: refetchRelationships,
        },
        taskTypes: {
            info: taskTypes,
            refetch: refetchTaskTypes,
        },
        logs: {
            info: logs,
            add: addLog,
            refetch: refetchLogs,
            edit: editLog,
        },
    };
};
