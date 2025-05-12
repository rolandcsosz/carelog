import { useMutation, useQuery } from "@tanstack/react-query";
import { useApi } from "./useApi";
import {
    GetCaregiversByIdData,
    GetCaregiversByIdResponse,
    PutCaregiversByIdData,
    PutCaregiversByIdResponse,
} from "../../api/types.gen";
import { CancelablePromise } from "../../api/core/CancelablePromise";
import { getCaregiversById, putCaregiversById } from "../../api/sdk.gen";
import { useAuth } from "./useAuth";

const fetchLogedInUser = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<R | null>,
    id: number,
): Promise<Caregiver | undefined> => {
    const response = await request<GetCaregiversByIdData, GetCaregiversByIdResponse>(getCaregiversById, { id: id });
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
        phone: first.phone ?? "",
    };
};

export const useCaregiverModel = () => {
    const { request } = useApi();
    const { user } = useAuth();

    const { data: logedInUser, refetch: refetchLogedInUser } = useQuery<Caregiver | undefined>({
        queryKey: ["logedInCaregiverUser", user?.id ?? -1],
        queryFn: () => fetchLogedInUser(request, Number(user?.id) ?? -1),
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

    return {
        logedInUser,
        updateLogedInUser,
    };
};
