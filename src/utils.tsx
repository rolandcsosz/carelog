import { CancelablePromise } from "../api/core/CancelablePromise";
import { getSchedulesCaregiverByCaregiverId } from "../api/sdk.gen";
import { GetSchedulesCaregiverByCaregiverIdData, GetSchedulesCaregiverByCaregiverIdResponse } from "../api/types.gen";
import ErrorModal from "./components/popup-contents/ErrorModal";
import Loading from "./components/popup-contents/Loading";
import Success from "./components/popup-contents/Success";
import { FetchResponse, Id, PopupActionResult, PopupProps, Schedule } from "./types";

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

export const fetchSchedulesForCaregiver = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<FetchResponse<R | null>>,
    caregiverId: Id,
): Promise<Schedule[]> => {
    const schedules = await request<GetSchedulesCaregiverByCaregiverIdData, GetSchedulesCaregiverByCaregiverIdResponse>(
        getSchedulesCaregiverByCaregiverId,
        {
            caregiverId: caregiverId,
        },
    );

    if (!schedules || !schedules.data || schedules.data.length === 0) {
        return [];
    }

    return schedules.data.map(
        (schedule) =>
            ({
                id: Number(schedule.id) || -1,
                relationshipId: Number(schedule.relationship_id) || -1,
                start: schedule.start_time || "00:00:00",
                end: schedule.end_time || "00:00:00",
                date: schedule.date ? new Date(schedule.date) : new Date(),
            }) as Schedule,
    );
};

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
