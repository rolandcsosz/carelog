import { useCallback } from "react";
import { useCaregiverModel } from "./useCaregiverModel";
import { compareTime, convertToGlobalUTC } from "../utils";

const useQueryData = () => {
    const {
        recipients: caregiverRecipients,
        relationships: caregiverRelationShips,
        logs,
        schedules: caregiverSchadules,
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
        (recipient: Recipient): Log[] | undefined => {
            return logs.info?.filter((log) =>
                caregiverRelationShips.info?.some(
                    (relationship) =>
                        relationship.id === log.relationshipId && relationship.recipientId === recipient.id,
                ),
            );
        },
        [logs.info, caregiverRelationShips.info],
    );

    return { getRecipientForLog, getFilteredSchedules, getRecipientForSchedule, getLogsForRecipient };
};

export default useQueryData;
