import { useCallback } from "react";
import { useCaregiverModel } from "./useCaregiverModel";
import { compareTime, convertToGlobalUTC } from "../utils";
import { LogEntry, RecipientWithoutPassword, Schedule } from "../../api/types.gen";
import { useAdminModel } from "./useAdminModel";

const useQueryData = ({ mode = "caregiver" }: { mode?: "caregiver" | "admin" } = { mode: "caregiver" }) => {
    const {
        recipients: caregiverRecipients,
        relationships: caregiverRelationShips,
        logs,
        schedules: caregiverSchadules,
        taskTypes,
        subTasks,
    } = mode === "caregiver" ? useCaregiverModel() : useAdminModel();

    // Caregiver helper
    const getRecipientForLog = useCallback(
        (log: LogEntry): RecipientWithoutPassword | undefined => {
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
        (schedule: Schedule): RecipientWithoutPassword | undefined => {
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
                            selectedDate &&
                            convertToGlobalUTC(new Date(schedule.date)) === convertToGlobalUTC(new Date(selectedDate)),
                    )
                    .sort((a, b) => compareTime(a.startTime, b.startTime)) || []
            );
        },
        [caregiverSchadules.list],
    );

    // Caregiver helper
    const getLogsForRecipient = useCallback(
        (recipient: RecipientWithoutPassword): LogEntry[] | undefined => {
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
        (taskId: string): string => {
            const subTask = subTasks.list?.find((task) => task.id === taskId);
            return subTask ? subTask.title : "Ismeretlen feladat";
        },
        [taskTypes.list],
    );

    const getTaskIdByName = useCallback(
        (taskName: string): string | undefined => {
            const subTask = subTasks.list?.find((task) => task.title === taskName);
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
