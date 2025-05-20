import styles from "./DailySchedule.module.scss";
import React from "react";
import useNavigation from "../../hooks/useNavigation.ts";
import TimeTableRow from "../../components/TimeTableRow.tsx";
import { useCaregiverModel } from "../../hooks/useCaregiverModel.ts";
import Recipient from "./Recipient.tsx";
import { compareTime, getDateString } from "../../utils.ts";
import useBottomSheet from "../../hooks/useBottomSheet.ts";

const DailySchedule: React.FC = () => {
    const { addPageToStack } = useNavigation();
    const { recipients, schedules, relationships, logs } = useCaregiverModel();
    const { openSheet } = useBottomSheet();
    const today = new Date();
    const openLog = logs.info?.find((log) => !log.closed);

    const filteredSchedules =
        schedules.info
            ?.filter((schedule) => {
                const scheduleDate = new Date(schedule.date);
                return (
                    scheduleDate.getFullYear() === today.getFullYear() &&
                    scheduleDate.getMonth() === today.getMonth() &&
                    scheduleDate.getDate() === today.getDate()
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
        if (openLog) {
            return "notEditable";
        }
        const log = logs.info?.find((log) => log.relationshipId === schedule.relationshipId);
        if (!log) {
            return "new";
        }

        if (log.finished) {
            return "done";
        }

        return "new";
    };

    return (
        <div className={styles.page}>
            <div className={styles.headerColumn}>
                <div className={styles.title}>Napi beosztás</div>
                <div className={styles.date}>{getDateString(new Date())}</div>
            </div>
            <div />

            <div className={styles.table}>
                <div className={styles.tableHeaderRow}>
                    <div className={styles.timeCell}>Óra</div>
                    <div className={styles.dataCell}>Gondozott adatai</div>
                </div>
                {filteredSchedules.map((schedule) => {
                    const recipient = getRecipientForSchedule(schedule);
                    if (!recipient) {
                        return null;
                    }
                    return (
                        <TimeTableRow
                            start={schedule.start}
                            end={schedule.end}
                            userName={recipient.name}
                            address={recipient.address}
                            type={getStatusForSchedule(schedule)}
                            onOpen={() => {
                                addPageToStack(<Recipient recipient={recipient} />);
                            }}
                            onNewLog={openSheet}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default DailySchedule;
