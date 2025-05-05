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
    PostCaregiversData,
    PostCaregiversResponse,
    PostRecipientsCaregiversData,
    PostRecipientsCaregiversResponse,
    PostRecipientsData,
    PostRecipientsResponse,
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
    postCaregivers,
    postRecipients,
    postRecipientsCaregivers,
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
                id: caregiver?.id,
                name: caregiver?.name,
                phone: caregiver?.phone,
                email: caregiver?.email,
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
                id: recipient?.id || -1,
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
                    { id: caregiver.id },
                );
                if (!response || response.length === 0) {
                    return [];
                }

                return response.map((relationship) => ({
                    id: relationship.id,
                    caregiverId: caregiver.id,
                    recipientId: relationship.id,
                })) as Relationship[];
            }),
        )
    ).flat();

    return relationships;
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
        queryFn: () => fetchLogedInUser(request, user?.id ?? -1),
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
    };
};
