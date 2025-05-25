import { useCallback } from "react";
import { useCaregiverModel } from "./useCaregiverModel";
import { compareTime, convertToGlobalUTC } from "../utils";
import { Log, Recipient, Schedule } from "../types";

const useQueryData = () => {
    const {
        recipients: caregiverRecipients,
        relationships: caregiverRelationShips,
        logs,
        schedules: caregiverSchadules,
        taskTypes,
    } = useCaregiverModel();

    // Caregiver helper
    const getRecipientForLog = useCallback(
        (log: Log): Recipient | undefined => {
            const relationship = caregiverRelationShips.info?.find(
                (relationship) => relationship.id === log.relationshipId,
            );
            if (relationship) {
                const recipient = caregiverRecipients.info?.find(
                    (recipient) => recipient.id === relationship.recipientId,
                );
                if (recipient) {
                    return recipient;
                }
            }
            return undefined;
        },
        [caregiverRelationShips.info, caregiverRecipients.info],
    );

    // Caregiver helper
    const getRecipientForSchedule = useCallback(
        (schedule: Schedule): Recipient | undefined => {
            const relationship = caregiverRelationShips.info?.find(
                (relationship) => relationship.id === schedule.relationshipId,
            );
            if (relationship) {
                const recipient = caregiverRecipients.info?.find(
                    (recipient) => recipient.id === relationship.recipientId,
                );
                if (recipient) {
                    return recipient;
                }
            }
            return undefined;
        },
        [caregiverRelationShips.info, caregiverRecipients.info],
    );

    // Caregiver helper
    const getFilteredSchedules = useCallback(
        (selectedDate: Date): Schedule[] => {
            return (
                caregiverSchadules.info
                    ?.filter(
                        (schedule) =>
                            selectedDate && convertToGlobalUTC(schedule.date) === convertToGlobalUTC(selectedDate),
                    )
                    .sort((a, b) => compareTime(a.start, b.start)) || []
            );
        },
        [caregiverSchadules.info],
    );

    // Caregiver helper
    const getLogsForRecipient = useCallback(
        (recipient: Recipient, finishedStatus: boolean | null = null): Log[] | undefined => {
            let filteredLogs = logs.info?.filter((log) =>
                caregiverRelationShips.info?.some(
                    (relationship) =>
                        relationship.id === log.relationshipId && relationship.recipientId === recipient.id,
                ),
            );
            if (finishedStatus !== null) {
                filteredLogs = filteredLogs?.filter((log) => log.finished === finishedStatus);
            }
            return filteredLogs;
        },
        [logs.info, caregiverRelationShips.info],
    );

    const getTaskNameById = useCallback(
        (taskId: number): string => {
            const taskType = taskTypes.info?.find((task) => Number(task.id) === Number(taskId));
            return taskType ? taskType.name : "Ismeretlen feladat";
        },
        [taskTypes.info],
    );

    const getTaskIdByName = useCallback(
        (taskName: string): number | undefined => {
            const taskType = taskTypes.info?.find((task) => task.name === taskName);
            return taskType ? taskType.id : undefined;
        },
        [taskTypes.info],
    );

    return {
        getRecipientForLog,
        getFilteredSchedules,
        getRecipientForSchedule,
        getLogsForRecipient,
        getTaskNameById,
        getTaskIdByName,
    };
};

export default useQueryData;
