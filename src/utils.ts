import { CancelablePromise } from "../api/core/CancelablePromise";
import { getSchedulesCaregiverByCaregiverId } from "../api/sdk.gen";
import { GetSchedulesCaregiverByCaregiverIdData, GetSchedulesCaregiverByCaregiverIdResponse } from "../api/types.gen";

export const getDateString = (date: Date): string => {
    const options: Intl.DateTimeFormatOptions = {
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
    };
    return date.toLocaleDateString("hu-HU", options);
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
                relationshipId: schedule.relationship_id || -1,
                start: schedule.start_time || "00:00:00",
                end: schedule.end_time || "00:00:00",
                date: schedule.date ? new Date(schedule.date) : new Date(),
            }) as Schedule,
    );
};
