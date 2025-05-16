import styles from "./Log.module.scss";
import React from "react";
import { useCaregiverModel } from "../../hooks/useCaregiverModel.ts";
import { compareTime, getDateString } from "../../utils.ts";
import { Button } from "../../components/Button.tsx";
import { request } from "../../../api/core/request.ts";

const DailySchedule: React.FC = () => {
    const { recipients, schedules, relationships, logs } = useCaregiverModel();
    const today = new Date();
    const openLog = logs.info?.find((log) => !log.closed);

    const getRecipientForLog = (log: Log): Recipient | undefined => {
        const relationship = relationships.info?.find((relationship) => relationship.id === log.relationshipId);
        if (relationship) {
            const recipient = recipients.info?.find((recipient) => recipient.id === relationship.recipientId);
            if (recipient) {
                return recipient;
            }
        }
        return undefined;
    };

    const recipient = openLog ? getRecipientForLog(openLog) : undefined;

    const filteredSchedules =
        schedules.info
            ?.filter((schedule) => {
                const scheduleDate = new Date(schedule.date);
                return (
                    scheduleDate.getFullYear() === today.getFullYear() &&
                    scheduleDate.getMonth() === today.getMonth() &&
                    scheduleDate.getDate() === today.getDate() - 1 // ✅ This is the day of the month
                );
            })
            .sort((a, b) => {
                return compareTime(a.start, b.start);
            }) || [];

    const getRecipientForSchedule = (schedule: Schedule): Recipient | undefined => {
        const relationship = relationships.info?.find((relationship) => relationship.id === schedule.relationshipId);
        if (relationship) {
            const recipient = recipients.info?.find((recipient) => recipient.id === relationship.recipientId);
            if (recipient) {
                return recipient;
            }
        }
        return undefined;
    };

    //"done" | "notEditable" | "new" | "error";
    //TODO: open log test
    const getStatusForSchedule = (schedule: Schedule) => {
        const log = logs.info?.find((log) => log.relationshipId === schedule.relationshipId);
        if (!log) {
            return "new";
        }

        if (log.finished) {
            return "done";
        }

        return "new";
    };

    const closeLog = () => {
        if (openLog) {
            console.log("Closing log:", openLog);
            logs.edit({
                id: openLog.id.toString(),
                requestBody: {
                    closed: true,
                },
            });
        }
    };

    return (
        <div className={styles.page}>
            <div className={styles.headerColumn}>
                <div className={styles.mainTitle}>{recipient?.name}</div>
                <div className={styles.date}>{getDateString(openLog?.date ?? new Date())}</div>
            </div>
            <div />

            <div className={styles.infoContainer}>
                <div className={styles.title}>Általános Jegyzet</div>
                {recipient?.caregiver_note}
                <div className={styles.spacer} />
                <div className={styles.title}>Teendők</div>
            </div>

            <Button primary={true} label="Mentés" size="large" onClick={closeLog} fillWidth={true} />
        </div>
    );
};

export default DailySchedule;
