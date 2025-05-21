import { CancelablePromise } from "../api/core/CancelablePromise";
import { getSchedulesCaregiverByCaregiverId } from "../api/sdk.gen";
import { GetSchedulesCaregiverByCaregiverIdData, GetSchedulesCaregiverByCaregiverIdResponse } from "../api/types.gen";

export const getDateString = (date: Date): string => {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, "0");
    const day = String(date.getDate()).padStart(2, "0");
    return `${year}/${month}/${day}`;
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

export const fetchSchedulesForCaregiver = async (
    request: <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P) => Promise<R | null>,
    caregiverId: Id,
): Promise<Schedule[]> => {
    const schedules = await request<GetSchedulesCaregiverByCaregiverIdData, GetSchedulesCaregiverByCaregiverIdResponse>(
        getSchedulesCaregiverByCaregiverId,
        {
            caregiverId: caregiverId,
        },
    );

    if (!schedules || schedules.length === 0) {
        return [];
    }

    return schedules.map(
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

export const compareTime = (a: string, b: string) => {
    const startA = normalizeTime(a);
    const startB = normalizeTime(b);

    if (startA < startB) {
        return 1;
    } else if (startA > startB) {
        return -1;
    } else {
        return 0;
    }
};
