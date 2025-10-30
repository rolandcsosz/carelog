import { useQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";
import {
    AddRecipientToCaregiverData,
    AddRecipientToCaregiverResponse,
    AdminWithoutPassword,
    CaregiverWithoutPassword,
    CreateCaregiverData,
    CreateCaregiverResponse,
    CreateRecipientData,
    CreateRecipientResponse,
    CreateScheduleData,
    DeleteCaregiverData,
    DeleteCaregiverResponse,
    DeleteRecipientData,
    DeleteRecipientResponse,
    DeleteRelationshipData,
    DeleteRelationshipResponse,
    DeleteScheduleData,
    RecipientCaregiverRelationship,
    RecipientWithoutPassword,
    Schedule,
    UpdateAdminData,
    UpdateAdminPasswordData,
    UpdateAdminResponse,
    UpdateCaregiverData,
    UpdateCaregiverResponse,
    UpdateRecipientData,
    UpdateRecipientResponse,
    UpdateRelationshipData,
    UpdateRelationshipResponse,
    UpdateScheduleData,
} from "../../api/types.gen";
import {
    deleteCaregiver,
    deleteRecipient,
    deleteRelationship,
    deleteSchedule,
    getAdmin,
    getCaregivers,
    getRecipients,
    getAllRelationships,
    createCaregiver,
    createRecipient,
    addRecipientToCaregiver,
    createSchedule,
    updateAdminPassword,
    updateAdmin,
    updateCaregiver,
    updateRecipient,
    updateRelationship,
    updateSchedule,
    getSchedulesForRecipient,
} from "../../api/sdk.gen";
import { useAuth } from "./useAuth";
import {
    fetchAction,
    fetchData,
    fetchDataNullable,
    fetchSchedulesForCaregiver,
    RequestFnType,
    useApiMutation,
} from "../utils";
import { FetchResponse } from "../types";

const fetchCaregivers = (request: RequestFnType) =>
    fetchData(request, getCaregivers, undefined, [] as CaregiverWithoutPassword[]);

const fetchRecipients = (request: RequestFnType) =>
    fetchData(request, getRecipients, undefined, [] as RecipientWithoutPassword[]);

const fetchLogedInUser = (request: RequestFnType, id: string) =>
    fetchDataNullable(request, getAdmin, { id }, null as AdminWithoutPassword | null);

const fetchRelationships = (request: RequestFnType) =>
    fetchData(request, getAllRelationships, undefined, [] as RecipientCaregiverRelationship[]);

const fetchSchedulesForRecipient = (request: RequestFnType, recipientId: string) =>
    fetchData(request, getSchedulesForRecipient, { recipientId }, [] as Schedule[]);

const addSchedule = (request: RequestFnType, data: CreateScheduleData) =>
    fetchDataNullable(request, createSchedule, data, null as Schedule | null);

const editSchedule = (request: RequestFnType, data: UpdateScheduleData): Promise<FetchResponse<null>> =>
    fetchAction(request, updateSchedule, data, "Ismeretlen hiba történt a beosztás szerkesztése során.");

const removeSchedule = (request: RequestFnType, data: DeleteScheduleData): Promise<FetchResponse<null>> =>
    fetchAction(request, deleteSchedule, data, "Ismeretlen hiba történt a beosztás szerkesztése során.");

const setPassword = (request: RequestFnType, data: UpdateAdminPasswordData): Promise<FetchResponse<null>> =>
    fetchAction(request, updateAdminPassword, data, "Ismeretlen hiba történt a beosztás szerkesztése során.");

export const useAdminModel = () => {
    const { request } = useApi();
    const { user } = useAuth();

    const { data: caregivers = [], refetch: refetchCaregivers } = useQuery<CaregiverWithoutPassword[]>({
        queryKey: ["caregivers"],
        queryFn: () => fetchCaregivers(request),
        enabled: !!user?.id && user.role === "admin",
    });

    const { data: recipients = [], refetch: refetchRecipients } = useQuery<RecipientWithoutPassword[]>({
        queryKey: ["recipients"],
        queryFn: () => fetchRecipients(request),
        enabled: !!user?.id && user.role === "admin",
    });

    const { data: logedInUser, refetch: refetchLogedInUser } = useQuery<AdminWithoutPassword | null>({
        queryKey: ["logedInAdminUser"],
        queryFn: () => fetchLogedInUser(request, user?.id ?? ""),
        enabled: !!user?.id && user.role === "admin",
        staleTime: 0,
    });
    const { data: relationships, refetch: refetchRelationships } = useQuery<RecipientCaregiverRelationship[]>({
        queryKey: ["relationships"],
        queryFn: () => fetchRelationships(request),
        enabled: !!user?.id && caregivers.length > 0 && user.role === "admin",
        staleTime: 0,
    });

    const { mutate: addNewCaregiver } = useApiMutation<CreateCaregiverData, CreateCaregiverResponse>({
        request,
        apiCall: createCaregiver,
        throwMessage: "Hiba történt az új gondozó hozzáadása során.",
        onSuccess: refetchCaregivers,
        onError: (error) => console.error("Error adding caregiver:", error),
    });

    const { mutate: addNewRecipient } = useApiMutation<CreateRecipientData, CreateRecipientResponse>({
        request,
        apiCall: createRecipient,
        throwMessage: "Hiba történt az új gondozott hozzáadása során.",
        onSuccess: refetchRecipients,
        onError: (error) => console.error("Error adding recipient:", error),
    });

    const { mutate: editCaregiver } = useApiMutation<UpdateCaregiverData, UpdateCaregiverResponse>({
        request,
        apiCall: updateCaregiver,
        throwMessage: "Hiba történt a gondozó szerkesztése során.",
        onSuccess: refetchCaregivers,
        onError: (error) => console.error("Error editing caregiver:", error),
    });

    const { mutate: editRecipient } = useApiMutation<UpdateRecipientData, UpdateRecipientResponse>({
        request,
        apiCall: updateRecipient,
        throwMessage: "Hiba történt az gondozott szerkesztése során.",
        onSuccess: refetchRecipients,
        onError: (error) => console.error("Hiba történt az gondozott szerkesztése során.", error),
    });

    const { mutate: removeCaregiver } = useApiMutation<DeleteCaregiverData, DeleteCaregiverResponse>({
        request,
        apiCall: deleteCaregiver,
        throwMessage: "Hiba történt a gondozó törlése során.",
        onSuccess: refetchCaregivers,
        onError: (error) => console.error("Error deleting caregiver:", error),
    });

    const { mutate: removeRecipient } = useApiMutation<DeleteRecipientData, DeleteRecipientResponse>({
        request,
        apiCall: deleteRecipient,
        throwMessage: "Hiba történt a gondozott törlése során.",
        onSuccess: refetchRecipients,
        onError: (error) => console.error("Error deleting recipient:", error),
    });

    const { mutate: updateLogedInUser } = useApiMutation<UpdateAdminData, UpdateAdminResponse>({
        request,
        apiCall: updateAdmin,
        throwMessage: "Hiba történt az adminisztrátor adatok szerkesztése során.",
        onSuccess: refetchLogedInUser,
        onError: (error) => console.error("Error updating user:", error),
    });

    const { mutate: newRelationship } = useApiMutation<AddRecipientToCaregiverData, AddRecipientToCaregiverResponse>({
        request,
        apiCall: addRecipientToCaregiver,
        throwMessage: "Hiba történt az új kapcsolat hozzáadása során.",
        onSuccess: refetchRelationships,
        onError: (error) => console.error("Error adding relationship:", error),
    });

    const { mutate: editRelationship } = useApiMutation<UpdateRelationshipData, UpdateRelationshipResponse>({
        request,
        apiCall: updateRelationship,
        throwMessage: "Hiba történt a kapcsolat szerkesztése során.",
        onSuccess: refetchRelationships,
        onError: (error) => console.error("Error editing relationship:", error),
    });

    const { mutate: removeRelationship } = useApiMutation<DeleteRelationshipData, DeleteRelationshipResponse>({
        request,
        apiCall: deleteRelationship,
        throwMessage: "Hiba történt a kapcsolat törlése során.",
        onSuccess: refetchRelationships,
        onError: (error) => console.error("Error deleting relationship:", error),
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
            remove: removeCaregiver,
        },
        recipients: {
            list: recipients,
            add: addNewRecipient,
            edit: editRecipient,
            remove: removeRecipient,
        },
        relationships: {
            list: relationships,
            add: newRelationship,
            edit: editRelationship,
            remove: removeRelationship,
        },
        schedules: {
            fetchForRecipient: fetchSchedulesForRecipient,
            fetchForCaregiver: fetchSchedulesForCaregiver,
            add: addSchedule,
            edit: editSchedule,
            remove: removeSchedule,
        },
        user: {
            info: logedInUser,
            update: updateLogedInUser,
            setPassword: setPassword,
        },
        refetchData,
    };
};
