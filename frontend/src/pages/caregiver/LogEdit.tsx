import styles from "./LogEdit.module.scss";
import React from "react";
import { useCaregiverModel } from "../../hooks/useCaregiverModel.ts";
import { getDateString } from "../../utils.tsx";
import { Button } from "../../components/Button.tsx";
import useQueryData from "../../hooks/useQueryData.ts";
import usePopup from "../../hooks/usePopup.tsx";
import { PopupActionResult } from "../../types";
import LogCard from "../../components/LogCard.tsx";
import IconButton from "../../components/IconButton.tsx";
import useScroll from "../../hooks/useScroll.ts";
import chevronLeft from "../../assets/chevron-left.svg";
import useNavigation from "../../hooks/useNavigation.ts";
import { LogEntry } from "../../../api/types.gen.ts";

interface LogEditProps {
    log: LogEntry;
}

const LogEdit: React.FC<LogEditProps> = ({ log }) => {
    const { getRecipientForLog } = useQueryData();
    const { logs } = useCaregiverModel();
    const recipient = getRecipientForLog(log);
    const { openPopup, closePopup } = usePopup();
    const { scrollPosition } = useScroll();
    const { removeLastPageFromStack } = useNavigation();

    const deleteLog = () => {
        openPopup({
            content: <div>Biztosan törölni szeretnéd ezt a naplót?</div>,
            title: "Napló törlése",
            confirmButtonText: "Törlés",
            cancelButtonText: "Mégse",
            onConfirm: (): Promise<PopupActionResult> | void => {
                logs.remove(
                    {
                        id: log.id,
                    },
                    {
                        onSuccess: () => {
                            setTimeout(() => {
                                logs.refetch();
                                removeLastPageFromStack();
                            }, 1000);
                        },
                        onError: (error) => {
                            return Promise.resolve({
                                ok: false,
                                message: error?.message || "Ismeretlen hiba történt a napló törlése során.",
                                quitUpdate: false,
                            });
                        },
                    },
                );

                return Promise.resolve({
                    ok: true,
                    loading: true,
                    message: "Napló törlése folyamatban...",
                    quitUpdate: false,
                    autoCloseAfterTimeout: 1000,
                });
            },
            onCancel: closePopup,
        });
    };

    return (
        <div className={styles.page}>
            <div className={`${styles.backRow} ${scrollPosition > 0 ? styles.sticky : ""}`}>
                <IconButton svgContent={chevronLeft} onClick={removeLastPageFromStack} ariaLabel={"Vissza"} />
            </div>
            <div className={styles.headerColumn}>
                <div className={styles.profileHeaderText}>{recipient?.name}</div>
                <div className={styles.date}>{getDateString(new Date(log.date))} tevékenységek</div>
            </div>
            <div />

            <div className={styles.infoContainer}>
                <div className={styles.spacer} />
                {log.tasks.map((subTask, index) => {
                    // Check if previous card's endTime is later than this card's startTime
                    let prevEndTimeLater = false;
                    if (index > 0) {
                        const prevEnd = log.tasks[index - 1].endTime;
                        const currStart = subTask.startTime;
                        prevEndTimeLater = prevEnd > currStart;
                    }
                    return (
                        <LogCard
                            key={"log-card" + index}
                            index={index}
                            task={subTask}
                            startTimeInvalid={prevEndTimeLater}
                            onChange={() => {}}
                            onDelete={() => {}}
                            disabled
                        />
                    );
                })}
            </div>

            <div className={styles.buttonConatainer}>
                <Button primary label="Napló törlése" size="large" onClick={deleteLog} fillWidth={true} />
            </div>
        </div>
    );
};

export default LogEdit;
