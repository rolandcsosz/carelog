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
        subTasks,
    } = useCaregiverModel();

    // Caregiver helper
    const getRecipientForLog = useCallback(
        (log: Log): Recipient | undefined => {
            const relationship = caregiverRelationShips.list?.find(
                (relationship) => relationship.id === log.relationshipId,
            );
            if (relationship) {
                const recipient = caregiverRecipients.list?.find(
                    (recipient) => recipient.id === relationship.recipientId,
                );
                if (recipient) {
                    return recipient;
                }
            }
            return undefined;
        },
        [caregiverRelationShips.list, caregiverRecipients.list],
    );

    // Caregiver helper
    const getRecipientForSchedule = useCallback(
        (schedule: Schedule): Recipient | undefined => {
            const relationship = caregiverRelationShips.list?.find(
                (relationship) => relationship.id === schedule.relationshipId,
            );
            if (relationship) {
                const recipient = caregiverRecipients.list?.find(
                    (recipient) => recipient.id === relationship.recipientId,
                );
                if (recipient) {
                    return recipient;
                }
            }
            return undefined;
        },
        [caregiverRelationShips.list, caregiverRecipients.list],
    );

    // Caregiver helper
    const getFilteredSchedules = useCallback(
        (selectedDate: Date): Schedule[] => {
            return (
                caregiverSchadules.list
                    ?.filter(
                        (schedule) =>
                            selectedDate && convertToGlobalUTC(schedule.date) === convertToGlobalUTC(selectedDate),
                    )
                    .sort((a, b) => compareTime(a.start, b.start)) || []
            );
        },
        [caregiverSchadules.list],
    );

    // Caregiver helper
    const getLogsForRecipient = useCallback(
        (recipient: Recipient): Log[] | undefined => {
            let filteredLogs = logs.list?.filter((log) =>
                caregiverRelationShips.list?.some(
                    (relationship) =>
                        relationship.id === log.relationshipId && relationship.recipientId === recipient.id,
                ),
            );
            return filteredLogs;
        },
        [logs.list, caregiverRelationShips.list],
    );

    const getTaskNameById = useCallback(
        (taskId: number): string => {
            const subTask = subTasks.list?.find((task) => Number(task.id) === Number(taskId));
            return subTask ? subTask.name : "Ismeretlen feladat";
        },
        [taskTypes.list],
    );

    const getTaskIdByName = useCallback(
        (taskName: string): number | undefined => {
            const subTask = subTasks.list?.find((task) => task.name === taskName);
            return subTask ? subTask.id : undefined;
        },
        [taskTypes.list],
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
