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
    GetCaregiversResponse,
    GetRecipientsResponse,
    GetRelationshipsResponse,
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
    getRecipients,
    getRelationships,
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
import { fetchSchedulesForCaregiver, throwIfError } from "../utils";
import { Admin, Caregiver, FetchResponse, Id, Ok, Recipient, Relationship, Schedule } from "../types";

const fetchCaregivers = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<FetchResponse<R | null>>,
): Promise<Caregiver[]> => {
    const response = await request<void, GetCaregiversResponse>(getCaregivers, undefined);
    if (!response || !response.ok || !response.data || response.data.length === 0) {
        return [] as Caregiver[];
    }

    return response.data.map(
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
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<FetchResponse<R | null>>,
): Promise<Recipient[]> => {
    const response = await request<void, GetRecipientsResponse>(getRecipients, undefined);
    if (!response || !response.ok || !response.data || response.data.length === 0) {
        return [] as Recipient[];
    }

    return response.data.map(
        (recipient) =>
            ({
                id: recipient?.id || "",
                name: recipient?.name || "",
                email: recipient?.email || "",
                phone: recipient?.phone || "",
                address: recipient?.address || "",
                fourHandCareNeeded: recipient?.four_hand_care_needed || false,
                caregiverNote: recipient?.caregiver_note || "",
            }) as Recipient,
    );
};

const fetchLogedInUser = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<FetchResponse<R | null>>,
    id: number,
): Promise<Admin | null> => {
    const response = await request<GetAdminsByIdData, GetAdminsByIdResponse>(getAdminsById, { id: id });
    if (!response || !response.ok || !response.data) {
        return null;
    }

    return {
        id: response.data?.id || -1,
        name: response.data?.name || "",
        email: response.data?.email || "",
    };
};

const fetchRelationships = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<FetchResponse<R | null>>,
): Promise<Relationship[]> => {
    const response = await request<void, GetRelationshipsResponse>(getRelationships, undefined);
    if (!response || !response.ok || !response.data || response.data.length === 0) {
        return [];
    }

    const relationships = response.data.map(
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
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<FetchResponse<R | null>>,
    recipientId: Id,
): Promise<Schedule[]> => {
    const response = await request<GetSchedulesRecipientByRecipientIdData, GetSchedulesRecipientByRecipientIdResponse>(
        getSchedulesRecipientByRecipientId,
        {
            recipientId: recipientId,
        },
    );

    if (!response || !response.ok || !response.data || response.data.length === 0) {
        return [];
    }

    return response.data.map(
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
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<FetchResponse<R | null>>,
    data: PostSchedulesData,
): Promise<Schedule | null> => {
    const response = await request<PostSchedulesData, PostSchedulesResponse>(postSchedules, data);

    if (!response || !response.ok || !response.data) {
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
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<FetchResponse<R | null>>,
    data: PutSchedulesByIdData,
): Promise<Ok | null> => {
    const response = await request<PutSchedulesByIdData, PutSchedulesByIdResponse>(putSchedulesById, data);
    return response ? {} : null;
};

const deleteSchedule = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<FetchResponse<R | null>>,
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
        mutationFn: async (body: PostCaregiversData) => {
            try {
                const response = await request<PostCaregiversData, PostCaregiversResponse>(postCaregivers, body);
                throwIfError(response, "Hiba történt az új gondozó hozzáadása során.");
            } catch (error: any) {
                throw error;
            }
        },
        onSuccess: () => {
            refetchCaregivers();
        },
        onError: (error: any) => {
            console.error("Error adding caregiver:", error);
        },
    });

    const { mutate: addNewRecipient } = useMutation({
        mutationFn: async (body: PostRecipientsData) => {
            try {
                const response = await request<PostRecipientsData, PostRecipientsResponse>(postRecipients, body);
                throwIfError(response, "Hiba történt az új gondozott hozzáadása során.");
            } catch (error: any) {
                throw error;
            }
        },
        onSuccess: () => {
            refetchRecipients();
        },
        onError: (error: any) => {
            console.error("Error adding recipient:", error);
        },
    });

    const { mutate: editCaregiver } = useMutation({
        mutationFn: async (body: PutCaregiversByIdData) => {
            try {
                const response = await request<PutCaregiversByIdData, PutCaregiversByIdResponse>(
                    putCaregiversById,
                    body,
                );
                throwIfError(response, "Hiba történt a gondozó szerkesztése során.");
            } catch (error: any) {
                throw error;
            }
        },
        onSuccess: () => {
            refetchCaregivers();
        },
        onError: (error: any) => {
            console.error("Error editing caregiver:", error);
        },
    });

    const { mutate: editRecipient } = useMutation({
        mutationFn: async (body: PutRecipientsByIdData) => {
            try {
                const response = await request<PutRecipientsByIdData, PutRecipientsByIdResponse>(
                    putRecipientsById,
                    body,
                );
                throwIfError(response, "Hiba történt az gondozott szerkesztése során.");
            } catch (error: any) {
                throw error;
            }
        },
        onSuccess: () => {
            refetchRecipients();
        },
        onError: (error: any) => {
            console.error("Error editing recipient:", error);
        },
    });

    const { mutate: deleteCaregiver } = useMutation({
        mutationFn: async (body: DeleteCaregiversByIdData) => {
            try {
                const response = await request<DeleteCaregiversByIdData, DeleteCaregiversByIdResponse>(
                    deleteCaregiversById,
                    body,
                );
                throwIfError(response, "Hiba történt a gondozó törlése során.");
            } catch (error: any) {
                throw error;
            }
        },
        onSuccess: () => {
            refetchCaregivers();
        },
        onError: (error: any) => {
            console.error("Error deleting caregiver:", error);
        },
    });

    const { mutate: deleteRecipient } = useMutation({
        mutationFn: async (body: DeleteRecipientsByIdData) => {
            try {
                const response = await request<DeleteRecipientsByIdData, DeleteRecipientsByIdResponse>(
                    deleteRecipientsById,
                    body,
                );
                throwIfError(response, "Hiba történt a gondozott törlése során.");
            } catch (error: any) {
                throw error;
            }
        },
        onSuccess: () => {
            refetchRecipients();
        },
        onError: (error: any) => {
            console.error("Error deleting recipient:", error);
        },
    });

    const { mutate: updateLogedInUser } = useMutation({
        mutationFn: async (body: PutAdminsByIdData) => {
            try {
                const response = await request<PutAdminsByIdData, PutAdminsByIdResponse>(putAdminsById, body);
                throwIfError(response, "Hiba történt az adminisztrátor adatok szerkesztése során.");
            } catch (error: any) {
                throw error;
            }
        },
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
