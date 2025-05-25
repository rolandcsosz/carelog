import styles from "./Log.module.scss";
import React from "react";
import { useCaregiverModel } from "../../hooks/useCaregiverModel.ts";
import { getDateString } from "../../utils.tsx";
import { Button } from "../../components/Button.tsx";
import useQueryData from "../../hooks/useQueryData.ts";
import { openLogState } from "../../model.ts";
import { useRecoilValue } from "recoil";
import useBottomSheet from "../../hooks/useBottomSheet.ts";
import usePopup from "../../hooks/usePopup.tsx";
import Loading from "../../components/popup-contents/Loading.tsx";

const DailySchedule: React.FC = () => {
    const { logs } = useCaregiverModel();
    const { getRecipientForLog } = useQueryData();
    const openLog = useRecoilValue(openLogState);
    const recipient = openLog ? getRecipientForLog(openLog) : undefined;
    const { closeSheet } = useBottomSheet();
    const { openPopup, closePopup } = usePopup();

    const closeLog = () => {
        if (openLog) {
            logs.edit(
                {
                    id: openLog.id.toString(),
                    requestBody: {
                        finished: true,
                    },
                },
                {
                    onSuccess: () => {
                        setTimeout(() => {
                            logs.refetch();
                            closeSheet();
                        }, 2000);

                        openPopup({
                            content: (
                                <Loading
                                    title="Feldolgozás folyamatban..."
                                    message={"Új napló mentés folyamatban..."}
                                />
                            ),
                            title: "",
                            confirmButtonText: "Bezárás",
                            cancelButtonText: "",
                            confirmOnly: true,
                            onConfirm: closePopup,
                            onCancel: closePopup,
                        });
                        setTimeout(() => {
                            closePopup();
                        }, 2000);
                    },
                },
            );
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
                {recipient?.caregiverNote}
                <div className={styles.spacer} />
                <div className={styles.title}>Teendők</div>
            </div>

            <Button primary={true} label="Mentés" size="large" onClick={closeLog} fillWidth={true} />
        </div>
    );
};

export default DailySchedule;
