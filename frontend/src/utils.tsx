import { useMutation } from "@tanstack/react-query";
import { CancelablePromise } from "../api/core/CancelablePromise";
import { ErrorResponse, Schedule } from "../api/types.gen";
import ErrorModal from "./components/popup-contents/ErrorModal";
import Loading from "./components/popup-contents/Loading";
import Success from "./components/popup-contents/Success";
import { FetchResponse, PopupActionResult, PopupProps } from "./types";
import { getSchedulesForCaregiver } from "../api/sdk.gen";

export const getDateString = (date: Date, delimeter: string = "/"): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}${delimeter}${month}${delimeter}${day}`;
};

export const convertToGlobalUTC = (dateToConvert: Date): string => {
    const date = new Date(dateToConvert);
    return (
        date.getFullYear() +
        "-" +
        String(date.getMonth()).padStart(2, "0") +
        "-" +
        String(date.getDate()).padStart(2, "0") +
        "T" +
        "00:00:00"
    );
};

export const getHourAndMinuteTimeString = (date: Date): string => {
    return date.toTimeString().split(" ")[0].slice(0, 5) + ":00"; // Returns HH:mm:ss format
};

export async function fetchData<P, R>(
    request: <P_, R_>(
        apiCall: (params: P_) => CancelablePromise<R_ | ErrorResponse>,
        params: P_,
    ) => Promise<FetchResponse<R_ | null>>,
    apiCall: (params: P) => CancelablePromise<R | ErrorResponse>,
    params: P,
    defaultValue: R,
): Promise<R> {
    const response = await request<P, R>(apiCall, params);
    return response && response.ok && response.data ? response.data : defaultValue;
}

export async function fetchDataNullable<P, R>(
    request: <P_, R_>(
        apiCall: (params: P_) => CancelablePromise<R_ | ErrorResponse>,
        params: P_,
    ) => Promise<FetchResponse<R_ | null>>,
    apiCall: (params: P) => CancelablePromise<R | ErrorResponse>,
    params: P,
    defaultValue: R | null,
): Promise<R | null> {
    const response = await request<P, R>(apiCall, params);
    return response && response.ok && response.data ? response.data : defaultValue;
}

export async function fetchAction<P, R>(
    request: <P_, R_>(
        apiCall: (params: P_) => CancelablePromise<R_ | ErrorResponse>,
        params: P_,
    ) => Promise<FetchResponse<R_ | null>>,
    apiCall: (params: P) => CancelablePromise<R | ErrorResponse>,
    params: P,
    errorMessage: string,
): Promise<FetchResponse<null>> {
    const response = await request<P, R>(apiCall, params);

    if (!response || !response.ok) {
        return {
            ok: false,
            data: null,
            error: response?.error || errorMessage,
        };
    }

    return { ok: true, data: null, error: null };
}

export type RequestFnType = <P, R>(
    apiCall: (params: P) => CancelablePromise<R | ErrorResponse>,
    params: P,
) => Promise<FetchResponse<R | null>>;

export interface UseApiMutationOptions<P, R> {
    request: RequestFnType;
    apiCall: (body: P) => CancelablePromise<R | ErrorResponse>;
    throwMessage: string;
    onSuccess?: () => void;
    onError?: (error: any) => void;
}

export function useApiMutation<P, R>({
    request,
    apiCall,
    throwMessage,
    onSuccess,
    onError,
}: UseApiMutationOptions<P, R>) {
    return useMutation({
        mutationFn: async (body: P) => {
            const response = await request<P, R>(apiCall, body);
            throwIfError(response, throwMessage);
            return response.data;
        },
        onSuccess,
        onError,
    });
}

export const fetchSchedulesForCaregiver = (request: RequestFnType, caregiverId: string) =>
    fetchData(request, getSchedulesForCaregiver, { caregiverId }, [] as Schedule[]);

const normalizeTime = (time: string) => {
    if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
        return time.slice(0, 5);
    }
    if (/^\d{2}:\d{2}$/.test(time)) {
        return time;
    }
    return time;
};

export const denormalizeTime = (time: string) => {
    if (/^\d{2}:\d{2}$/.test(time)) {
        return `${time}:00`;
    }
    if (/^\d{2}:\d{2}:\d{2}$/.test(time)) {
        return time;
    }
    return time;
};

export const compareTime = (a: string, b: string) => {
    const startA = normalizeTime(a);
    const startB = normalizeTime(b);

    if (startA > startB) {
        return 1;
    } else if (startA < startB) {
        return -1;
    } else {
        return 0;
    }
};

export const getErrorMessageFromAny = (error: any): string => {
    if (error && typeof error === "object" && "error" in error && typeof error.error === "string") {
        return error.error || "Ismeretlen hiba történt.";
    }

    return "Ismeretlen hiba történt.";
};

export const isErrorMessageInResponse = (response: any): boolean => {
    return response && typeof response === "object" && "error" in response && typeof response.error === "string";
};

export const getDefaultErrorModal = (title: string, message: string, onFinish: () => void): PopupProps => {
    return {
        content: <ErrorModal title={title} message={message} />,
        title: "",
        confirmButtonText: "Rendben",
        cancelButtonText: "",
        confirmOnly: true,
        onConfirm: onFinish,
        onCancel: onFinish,
    };
};

export const getDefaultSuccessModal = (title: string, message: string, onFinish: () => void): PopupProps => {
    return {
        content: <Success title={title} message={message} />,
        title: "",
        confirmButtonText: "Rendben",
        cancelButtonText: "",
        confirmOnly: true,
        onConfirm: onFinish,
        onCancel: onFinish,
    };
};

export const getDefaultLoadModal = (
    title: string,
    message: string,
    onFinish: () => void,
    timeout: number,
): PopupProps => {
    return {
        content: <Loading title={title} message={message} />,
        title: "",
        confirmButtonText: "Rendben",
        cancelButtonText: "",
        confirmOnly: true,
        onConfirm: onFinish,
        onCancel: onFinish,
        timeout: timeout || 0,
    };
};

export const getEmptyResponse = (): PopupActionResult => {
    return {
        ok: false,
        message: "",
        quitUpdate: true,
    };
};

export const throwIfError = (response: FetchResponse<any>, errorMessage: string): void => {
    if (!response || !response.ok || !response.data) {
        throw new Error(response?.error || errorMessage);
    }
    return response.data;
};

export const isSameDay = (timestamp1: Date, timestamp2: Date): boolean => {
    const day1 = new Date(timestamp1.getFullYear(), timestamp1.getMonth(), timestamp1.getDate());
    const day2 = new Date(timestamp2.getFullYear(), timestamp2.getMonth(), timestamp2.getDate());
    return day1.getTime() === day2.getTime();
};
