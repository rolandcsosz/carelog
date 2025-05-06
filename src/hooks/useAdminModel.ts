import { useMutation, useQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";
import {
    DeleteCaregiversByIdData,
    DeleteCaregiversByIdResponse,
    DeleteRecipientsByIdData,
    DeleteRecipientsByIdResponse,
    GetAdminsByIdData,
    GetAdminsByIdResponse,
    GetCaregiversResponse,
    GetRecipientsByIdCaregiversData,
    GetRecipientsByIdCaregiversResponse,
    GetRecipientsResponse,
    GetSchedulesCaregiverByCaregiverIdData,
    GetSchedulesCaregiverByCaregiverIdResponse,
    GetSchedulesRecipientByRecipientIdData,
    GetSchedulesRecipientByRecipientIdResponse,
    PostCaregiversData,
    PostCaregiversResponse,
    PostRecipientsCaregiversData,
    PostRecipientsCaregiversResponse,
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
} from "../../api/types.gen";
import { CancelablePromise } from "../../api/core/CancelablePromise";
import {
    deleteCaregiversById,
    deleteRecipientsById,
    getAdminsById,
    getCaregivers,
    getRecipients,
    getRecipientsByIdCaregivers,
    getSchedulesCaregiverByCaregiverId,
    getSchedulesRecipientByRecipientId,
    postCaregivers,
    postRecipients,
    postRecipientsCaregivers,
    postSchedules,
    putAdminsById,
    putCaregiversById,
    putRecipientsById,
} from "../../api/sdk.gen";
import { useAuth } from "./useAuth";

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
): Promise<Admin | undefined> => {
    const response = await request<GetAdminsByIdData, GetAdminsByIdResponse>(getAdminsById, { id: id });
    if (!response || (response as any).length === 0) {
        return undefined;
    }

    const first = (response as any)[0];
    if (!first) {
        return undefined;
    }

    return {
        id: first.id ?? -1,
        name: first.name ?? "",
        email: first.email ?? "",
    };
};

const fetchRelationships = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<R | null>,
    caregivers: Caregiver[],
): Promise<Relationship[]> => {
    const relationships: Relationship[] = (
        await Promise.all(
            caregivers.map(async (caregiver) => {
                const response = await request<GetRecipientsByIdCaregiversData, GetRecipientsByIdCaregiversResponse>(
                    getRecipientsByIdCaregivers,
                    { id: Number(caregiver.id) },
                );
                if (!response || response.length === 0) {
                    return [];
                }

                return response.map((relationship) => ({
                    caregiverId: caregiver.id || "",
                    recipientId: relationship?.id || "",
                })) as Relationship[];
            }),
        )
    ).flat();

    return relationships;
};

const fetchSchedulesForRecipient = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<R | null>,
    recipientId: Id,
): Promise<Schedule[]> => {
    const schedules = await request<GetSchedulesRecipientByRecipientIdData, GetSchedulesRecipientByRecipientIdResponse>(
        getSchedulesRecipientByRecipientId,
        {
            recipientId: Number(recipientId),
        },
    );

    if (!schedules || (schedules as any).length === 0) {
        return [] as Schedule[];
    }

    type ScheduleResponse = {
        id: string;
        relationship_id: string;
        date: string;
        start_time: string;
        end_time: string;
    };

    return (schedules as ScheduleResponse[]).map(
        (schedule) =>
            ({
                relationshipId: schedule.relationship_id || -1,
                start: schedule.start_time || "00:00:00",
                end: schedule.end_time || "00:00:00",
                date: schedule.date || new Date(),
            }) as Schedule,
    );
};

const fetchSchedulesForCaregiver = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<R | null>,
    caregiverId: Id,
): Promise<Schedule[]> => {
    const schedules = await request<GetSchedulesCaregiverByCaregiverIdData, GetSchedulesCaregiverByCaregiverIdResponse>(
        getSchedulesCaregiverByCaregiverId,
        {
            caregiverId: Number(caregiverId),
        },
    );

    if (!schedules || (schedules as any)?.length === 0) {
        return [] as Schedule[];
    }

    type ScheduleResponse = {
        id: string;
        relationship_id: string;
        date: string;
        start_time: string;
        end_time: string;
    };

    return (schedules as ScheduleResponse[]).map(
        (schedule) =>
            ({
                relationshipId: schedule.relationship_id || -1,
                start: schedule.start_time || "00:00:00",
                end: schedule.end_time || "00:00:00",
                date: new Date(schedule.date) || new Date(),
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

export const useAdminModel = () => {
    const { request } = useApi();
    const { user } = useAuth();

    const { data: caregivers = [], refetch: refetchCaregivers } = useQuery<Caregiver[]>({
        queryKey: ["caregivers"],
        queryFn: () => fetchCaregivers(request),
    });

    const { data: recipients = [], refetch: refetchRecipients } = useQuery<Recipient[]>({
        queryKey: ["recipients"],
        queryFn: () => fetchRecipients(request),
    });

    const { data: logedInUser, refetch: refetchLogedInUser } = useQuery<Admin | undefined>({
        queryKey: ["logedInUser", user?.id ?? -1],
        queryFn: () => fetchLogedInUser(request, Number(user?.id) ?? -1),
        enabled: !!user?.id,
        staleTime: 0,
    });
    const { data: relationships, refetch: refetchRelationships } = useQuery<Relationship[]>({
        queryKey: ["relationships", caregivers.map((c) => c.id).join(",")],
        queryFn: () => fetchRelationships(request, caregivers),
        enabled: !!user?.id && caregivers.length > 0,
        staleTime: 0,
    });

    const { mutate: addNewCaregiver } = useMutation({
        mutationFn: (newCaregiverData: PostCaregiversData) =>
            request<PostCaregiversData, PostCaregiversResponse>(postCaregivers, newCaregiverData),
        onSuccess: () => {
            refetchCaregivers();
        },
        onError: (error: any) => {
            console.error("Error adding caregiver:", error);
        },
    });

    const { mutate: addNewRecipient } = useMutation({
        mutationFn: (newRecipientData: PostRecipientsData) =>
            request<PostRecipientsData, PostRecipientsResponse>(postRecipients, newRecipientData),
        onSuccess: () => {
            refetchRecipients();
        },
        onError: (error: any) => {
            console.error("Error adding recipient:", error);
        },
    });

    const { mutate: editCaregiver } = useMutation({
        mutationFn: (editedCaregiverData: PutCaregiversByIdData) =>
            request<PutCaregiversByIdData, PutCaregiversByIdResponse>(putCaregiversById, editedCaregiverData),
        onSuccess: () => {
            refetchCaregivers();
        },
        onError: (error: any) => {
            console.error("Error editing caregiver:", error);
        },
    });

    const { mutate: editRecipient } = useMutation({
        mutationFn: (editedRecipientData: PutRecipientsByIdData) =>
            request<PutRecipientsByIdData, PutRecipientsByIdResponse>(putRecipientsById, editedRecipientData),
        onSuccess: () => {
            refetchRecipients();
        },
        onError: (error: any) => {
            console.error("Error editing recipient:", error);
        },
    });

    const { mutate: deleteCaregiver } = useMutation({
        mutationFn: (deleteCaregiversData: DeleteCaregiversByIdData) =>
            request<DeleteCaregiversByIdData, DeleteCaregiversByIdResponse>(deleteCaregiversById, deleteCaregiversData),
        onSuccess: () => {
            refetchCaregivers();
        },
        onError: (error: any) => {
            console.error("Error deleting caregiver:", error);
        },
    });

    const { mutate: deleteRecipient } = useMutation({
        mutationFn: (deleteRecipientData: DeleteRecipientsByIdData) =>
            request<DeleteRecipientsByIdData, DeleteRecipientsByIdResponse>(deleteRecipientsById, deleteRecipientData),
        onSuccess: () => {
            refetchRecipients();
        },
        onError: (error: any) => {
            console.error("Error deleting recipient:", error);
        },
    });

    const { mutate: updateLogedInUser } = useMutation({
        mutationFn: (updateInfo: PutAdminsByIdData) =>
            request<PutAdminsByIdData, PutAdminsByIdResponse>(putAdminsById, updateInfo),
        onSuccess: () => {
            refetchLogedInUser();
        },
        onError: (error: any) => {
            console.error("Error updating user:", error);
        },
    });

    const { mutate: newRelationship } = useMutation({
        mutationFn: (updateInfo: PostRecipientsCaregiversData) =>
            request<PostRecipientsCaregiversData, PostRecipientsCaregiversResponse>(
                postRecipientsCaregivers,
                updateInfo,
            ),
        onSuccess: () => {
            refetchRelationships();
        },
        onError: (error: any) => {
            console.error("Error adding relationship:", error);
        },
    });

    const refetchData = () => {
        refetchCaregivers();
        refetchRecipients();
    };

    return {
        caregivers,
        addNewCaregiver,
        editCaregiver,
        deleteCaregiver,
        recipients,
        addNewRecipient,
        editRecipient,
        refetchData,
        deleteRecipient,
        logedInUser,
        updateLogedInUser,
        relationships,
        newRelationship,
        fetchSchedulesForRecipient,
        fetchSchedulesForCaregiver,
        addSchedule,
    };
};
