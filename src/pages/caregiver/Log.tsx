import styles from "./Log.module.scss";
import React from "react";
import { useCaregiverModel } from "../../hooks/useCaregiverModel.ts";
import { getDateString } from "../../utils.ts";
import { Button } from "../../components/Button.tsx";

const DailySchedule: React.FC = () => {
    const { recipients, relationships, logs } = useCaregiverModel();
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
