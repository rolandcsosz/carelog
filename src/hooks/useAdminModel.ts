import { useMutation, useQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";
import {
    DeleteCaregiversByIdData,
    DeleteCaregiversByIdResponse,
    DeleteRecipientsByIdData,
    DeleteRecipientsByIdResponse,
    DeleteRelationshipsByIdData,
    DeleteRelationshipsByIdResponse,
    DeleteSchedulesByIdData,
    DeleteSchedulesByIdResponse,
    GetAdminsByIdData,
    GetAdminsByIdResponse,
    GetCaregiversByIdRecipientsData,
    GetCaregiversByIdRecipientsResponse,
    GetCaregiversResponse,
    GetRecipientsResponse,
    GetRelationshipsResponse,
    GetSchedulesCaregiverByCaregiverIdData,
    GetSchedulesCaregiverByCaregiverIdResponse,
    GetSchedulesRecipientByRecipientIdData,
    GetSchedulesRecipientByRecipientIdResponse,
    PostCaregiversData,
    PostCaregiversRecipientsData,
    PostCaregiversRecipientsResponse,
    PostCaregiversResponse,
    PostRecipientsData,
    PostRecipientsResponse,
    PostSchedulesData,
    PostSchedulesResponse,
    PutAdminsByIdData,
    PutAdminsByIdResponse,
    PutCaregiversByIdData,
    PutCaregiversByIdResponse,
    PutRecipientsByIdData,
    PutRecipientsByIdResponse,
    PutRelationshipsByIdData,
    PutRelationshipsByIdResponse,
    PutSchedulesByIdData,
    PutSchedulesByIdResponse,
} from "../../api/types.gen";
import { CancelablePromise } from "../../api/core/CancelablePromise";
import {
    deleteCaregiversById,
    deleteRecipientsById,
    deleteRelationshipsById,
    deleteSchedulesById,
    getAdminsById,
    getCaregivers,
    getCaregiversByIdRecipients,
    getRecipients,
    getRelationships,
    getSchedulesCaregiverByCaregiverId,
    getSchedulesRecipientByRecipientId,
    postCaregivers,
    postCaregiversRecipients,
    postRecipients,
    postSchedules,
    putAdminsById,
    putCaregiversById,
    putRecipientsById,
    putRelationshipsById,
    putSchedulesById,
} from "../../api/sdk.gen";
import { useAuth } from "./useAuth";
import { fetchSchedulesForCaregiver } from "../utils";

const fetchCaregivers = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<R | null>,
): Promise<Caregiver[]> => {
    const response = await request<void, GetCaregiversResponse>(getCaregivers, undefined);
    if (!response) {
        return [] as Caregiver[];
    }

    return response.map(
        (caregiver) =>
            ({
                id: caregiver?.id || "",
                name: caregiver?.name || "",
                phone: caregiver?.phone || "",
                email: caregiver?.email || "",
            }) as Caregiver,
    );
};

const fetchRecipients = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<R | null>,
): Promise<Recipient[]> => {
    const response = await request<void, GetRecipientsResponse>(getRecipients, undefined);
    if (!response) {
        return [] as Recipient[];
    }

    return response.map(
        (recipient) =>
            ({
                id: recipient?.id || "",
                name: recipient?.name || "",
                email: recipient?.email || "",
                phone: recipient?.phone || "",
                address: recipient?.address || "",
                four_hand_care_needed: recipient?.four_hand_care_needed || false,
                caregiver_note: recipient?.caregiver_note || "",
            }) as Recipient,
    );
};

const fetchLogedInUser = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<R | null>,
    id: number,
): Promise<Admin | null> => {
    console.log("Fetching logged in user with ID:", id);
    const response = await request<GetAdminsByIdData, GetAdminsByIdResponse>(getAdminsById, { id: id });
    if (!response) {
        return null;
    }

    return {
        id: response?.id || -1,
        name: response?.name || "",
        email: response?.email || "",
    };
};

const fetchRelationships = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<R | null>,
): Promise<Relationship[]> => {
    const response = await request<void, GetRelationshipsResponse>(getRelationships, undefined);
    if (!response || response.length === 0) {
        return [];
    }

    const relationships = response.map(
        (relationship) =>
            ({
                id: relationship?.relationship_id || -1,
                caregiverId: relationship?.caregiver_id || -1,
                recipientId: relationship?.recipient_id || -1,
            }) as Relationship,
    );

    return relationships;
};

const fetchSchedulesForRecipient = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<R | null>,
    recipientId: Id,
): Promise<Schedule[]> => {
    const schedules = await request<GetSchedulesRecipientByRecipientIdData, GetSchedulesRecipientByRecipientIdResponse>(
        getSchedulesRecipientByRecipientId,
        {
            recipientId: recipientId,
        },
    );

    if (!schedules || schedules.length === 0) {
        return [];
    }

    return schedules.map(
        (schedule) =>
            ({
                id: schedule?.id || -1,
                relationshipId: schedule.relationship_id || -1,
                start: schedule.start_time || "00:00:00",
                end: schedule.end_time || "00:00:00",
                date: schedule.date || new Date(),
            }) as Schedule,
    );
};

const addSchedule = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<R | null>,
    data: PostSchedulesData,
): Promise<Schedule | null> => {
    const response = await request<PostSchedulesData, PostSchedulesResponse>(postSchedules, data);
    if (!response) {
        return null;
    }

    return {
        relationshipId: (response as any)?.relationship_id || -1,
        start: (response as any)?.start_time || "00:00",
        end: (response as any)?.end_time || "00:00",
        date: (response as any)?.date || new Date(),
    } as Schedule;
};

const editSchedule = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<R | null>,
    data: PutSchedulesByIdData,
): Promise<Ok | null> => {
    const response = await request<PutSchedulesByIdData, PutSchedulesByIdResponse>(putSchedulesById, data);
    return response ? {} : null;
};

const deleteSchedule = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<R | null>,
    data: DeleteSchedulesByIdData,
): Promise<Ok | null> => {
    const response = await request<DeleteSchedulesByIdData, DeleteSchedulesByIdResponse>(deleteSchedulesById, data);
    return response ? {} : null;
};

export const useAdminModel = () => {
    const { request } = useApi();
    const { user } = useAuth();

    const { data: caregivers = [], refetch: refetchCaregivers } = useQuery<Caregiver[]>({
        queryKey: ["caregivers"],
        queryFn: () => fetchCaregivers(request),
        enabled: !!user?.id && user.role === "admin",
    });

    const { data: recipients = [], refetch: refetchRecipients } = useQuery<Recipient[]>({
        queryKey: ["recipients"],
        queryFn: () => fetchRecipients(request),
        enabled: !!user?.id && user.role === "admin",
    });

    const { data: logedInUser, refetch: refetchLogedInUser } = useQuery<Admin | null>({
        queryKey: ["logedInAdminUser"],
        queryFn: () => fetchLogedInUser(request, user?.id ?? -1),
        enabled: !!user?.id && user.role === "admin",
        staleTime: 0,
    });
    const { data: relationships, refetch: refetchRelationships } = useQuery<Relationship[]>({
        queryKey: ["relationships"],
        queryFn: () => fetchRelationships(request),
        enabled: !!user?.id && caregivers.length > 0 && user.role === "admin",
        staleTime: 0,
    });

    const { mutate: addNewCaregiver } = useMutation({
        mutationFn: (body: PostCaregiversData) =>
            request<PostCaregiversData, PostCaregiversResponse>(postCaregivers, body),
        onSuccess: () => {
            refetchCaregivers();
        },
        onError: (error: any) => {
            console.error("Error adding caregiver:", error);
        },
    });

    const { mutate: addNewRecipient } = useMutation({
        mutationFn: (body: PostRecipientsData) =>
            request<PostRecipientsData, PostRecipientsResponse>(postRecipients, body),
        onSuccess: () => {
            refetchRecipients();
        },
        onError: (error: any) => {
            console.error("Error adding recipient:", error);
        },
    });

    const { mutate: editCaregiver } = useMutation({
        mutationFn: (body: PutCaregiversByIdData) =>
            request<PutCaregiversByIdData, PutCaregiversByIdResponse>(putCaregiversById, body),
        onSuccess: () => {
            refetchCaregivers();
        },
        onError: (error: any) => {
            console.error("Error editing caregiver:", error);
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

    const { mutate: deleteCaregiver } = useMutation({
        mutationFn: (body: DeleteCaregiversByIdData) =>
            request<DeleteCaregiversByIdData, DeleteCaregiversByIdResponse>(deleteCaregiversById, body),
        onSuccess: () => {
            refetchCaregivers();
        },
        onError: (error: any) => {
            console.error("Error deleting caregiver:", error);
        },
    });

    const { mutate: deleteRecipient } = useMutation({
        mutationFn: (body: DeleteRecipientsByIdData) =>
            request<DeleteRecipientsByIdData, DeleteRecipientsByIdResponse>(deleteRecipientsById, body),
        onSuccess: () => {
            refetchRecipients();
        },
        onError: (error: any) => {
            console.error("Error deleting recipient:", error);
        },
    });

    const { mutate: updateLogedInUser } = useMutation({
        mutationFn: (body: PutAdminsByIdData) => request<PutAdminsByIdData, PutAdminsByIdResponse>(putAdminsById, body),
        onSuccess: () => {
            refetchLogedInUser();
        },
        onError: (error: any) => {
            console.error("Error updating user:", error);
        },
    });

    const { mutate: newRelationship } = useMutation({
        mutationFn: (body: PostCaregiversRecipientsData) =>
            request<PostCaregiversRecipientsData, PostCaregiversRecipientsResponse>(postCaregiversRecipients, body),
        onSuccess: () => {
            refetchRelationships();
        },
        onError: (error: any) => {
            console.error("Error adding relationship:", error);
        },
    });

    const { mutate: editRelationship } = useMutation({
        mutationFn: (body: PutRelationshipsByIdData) =>
            request<PutRelationshipsByIdData, PutRelationshipsByIdResponse>(putRelationshipsById, body),
        onSuccess: () => {
            refetchRelationships();
        },
        onError: (error: any) => {
            console.error("Error editing relationship:", error);
        },
    });

    const { mutate: deleteRelationship } = useMutation({
        mutationFn: (body: DeleteRelationshipsByIdData) =>
            request<DeleteRelationshipsByIdData, DeleteRelationshipsByIdResponse>(deleteRelationshipsById, body),
        onSuccess: () => {
            refetchRelationships();
        },
        onError: (error: any) => {
            console.error("Error deleting relationship:", error);
        },
    });

    const refetchData = () => {
        refetchCaregivers();
        refetchRecipients();
    };

    return {
        caregivers: {
            list: caregivers,
            add: addNewCaregiver,
            edit: editCaregiver,
            delete: deleteCaregiver,
        },
        recipients: {
            list: recipients,
            add: addNewRecipient,
            edit: editRecipient,
            delete: deleteRecipient,
        },
        relationships: {
            list: relationships,
            add: newRelationship,
            edit: editRelationship,
            delete: deleteRelationship,
        },
        schedules: {
            fetchForRecipient: fetchSchedulesForRecipient,
            fetchForCaregiver: fetchSchedulesForCaregiver,
            add: addSchedule,
            edit: editSchedule,
            delete: deleteSchedule,
        },
        user: {
            info: logedInUser,
            update: updateLogedInUser,
        },
        refetchData,
    };
};
