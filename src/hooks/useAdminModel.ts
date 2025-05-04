import { useMutation, useQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";
import {
    DeleteCaregiversByIdData,
    DeleteCaregiversByIdResponse,
    DeleteRecipientsByIdData,
    DeleteRecipientsByIdResponse,
    GetCaregiversResponse,
    GetRecipientsResponse,
    PostCaregiversData,
    PostCaregiversResponse,
    PostRecipientsData,
    PostRecipientsResponse,
    PutCaregiversByIdData,
    PutCaregiversByIdResponse,
    PutRecipientsByIdData,
    PutRecipientsByIdResponse,
} from "../../api/types.gen";
import { CancelablePromise } from "../../api/core/CancelablePromise";
import {
    deleteCaregiversById,
    deleteRecipientsById,
    getCaregivers,
    getRecipients,
    postCaregivers,
    postRecipients,
    putCaregiversById,
    putRecipientsById,
} from "../../api/sdk.gen";

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

export const useAdminModel = () => {
    const { request } = useApi();

    const { data: caregivers = [], refetch: refetchCaregivers } = useQuery<Caregiver[]>({
        queryKey: ["caregivers"],
        queryFn: () => fetchCaregivers(request),
    });

    const { data: recipients = [], refetch: refetchRecipients } = useQuery<Recipient[]>({
        queryKey: ["recipients"],
        queryFn: () => fetchRecipients(request),
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
    };
};
