import styles from "./DailySchedule.module.scss";
import React from "react";
import useNavigation from "../../hooks/useNavigation.ts";
import TimeTableRow from "../../components/TimeTableRow.tsx";
import { useCaregiverModel } from "../../hooks/useCaregiverModel.ts";
import Recipient from "./Recipient.tsx";
import { getDateString } from "../../utils.ts";
import useBottomSheet from "../../hooks/useBottomSheet.ts";
import useQueryData from "../../hooks/useQueryData.ts";
import { openLogState } from "../../model.ts";
import { useRecoilValue } from "recoil";

const DailySchedule: React.FC = () => {
    const { addPageToStack } = useNavigation();
    const { logs } = useCaregiverModel();
    const { openSheet } = useBottomSheet();
    const { getFilteredSchedules, getRecipientForSchedule } = useQueryData();
    const today = new Date();
    const openLog = useRecoilValue(openLogState);
    const filteredSchedules = getFilteredSchedules(today);

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
