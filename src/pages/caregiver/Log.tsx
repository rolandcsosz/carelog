import styles from "./Log.module.scss";
import React from "react";
import { useCaregiverModel } from "../../hooks/useCaregiverModel.ts";
import { getDateString, getDefaultErrorModal } from "../../utils.tsx";
import { Button } from "../../components/Button.tsx";
import useQueryData from "../../hooks/useQueryData.ts";
import { actualLogTasksState, openLogState } from "../../model.ts";
import { useRecoilState, useRecoilValue } from "recoil";
import useBottomSheet from "../../hooks/useBottomSheet.ts";
import usePopup from "../../hooks/usePopup.tsx";
import Loading from "../../components/popup-contents/Loading.tsx";
import { NewSubTypeData, PopupActionResult, SubTaskEditData } from "../../types";
import LogCard from "../../components/LogCard.tsx";
import NewSubTaskFormRow from "../../components/popup-contents/NewSubTaskFormRow.tsx";

const DailySchedule: React.FC = () => {
    const { logs, taskTypes } = useCaregiverModel();
    const { getRecipientForLog } = useQueryData();
    const openLog = useRecoilValue(openLogState);
    const recipient = openLog ? getRecipientForLog(openLog) : undefined;
    const { closeSheet } = useBottomSheet();
    const { openPopup, closePopup } = usePopup();
    const [subTasks, setSubTasks] = useRecoilState(actualLogTasksState);
    const localTaskRef = React.useRef<NewSubTypeData | null>(null);
    const getCurrentTime = () => {
        const now = new Date();
        return now.toTimeString().slice(0, 5);
    };

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

    const handleNewSubTask = (): Promise<PopupActionResult> | void => {
        openPopup({
            title: "Új Teendő hozzáadása",
            confirmButtonText: "Hozzáadás",
            content: (
                <NewSubTaskFormRow
                    onChange={(task) => {
                        localTaskRef.current = task;
                    }}
                    taskOptions={taskTypes.info?.map((task) => task.name || "") || []}
                />
            ),
            onConfirm: () => {
                const task = localTaskRef.current;
                if (!task || !task.name || !task.task) {
                    return Promise.resolve({ ok: false, quitUpdate: true, message: "" });
                }

                const newSubTask: Omit<SubTaskEditData, "index"> = {
                    title: task.name,
                    catregory: task.task,
                    startTime: getCurrentTime(),
                    endTime: getCurrentTime(),
                    done: false,
                };

                setSubTasks((prev) => [...prev, newSubTask]);
            },
            onCancel: () => {},
        });
    };

    const deleteLog = () => {
        if (!openLog) {
            return;
        }

        openPopup({
            content: <div>Biztosan törölni szeretnéd ezt a naplót?</div>,
            title: "Napló törlése",
            confirmButtonText: "Törlés",
            cancelButtonText: "Mégse",
            onConfirm: (): Promise<PopupActionResult> | void => {
                logs.delete(
                    {
                        id: openLog.id,
                    },
                    {
                        onSuccess: () => {
                            setTimeout(() => {
                                logs.refetch();
                                closeSheet();
                            }, 2000);
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
                    autoCloseAfterTimeout: 2000,
                });
            },
            onCancel: closePopup,
        });
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
                {subTasks.map((subTask, index) => (
                    <LogCard
                        key={"log-card" + index}
                        index={index}
                        title={subTask.title}
                        catregory={subTask.catregory}
                        startTime={subTask.startTime}
                        endTime={subTask.endTime}
                        done={subTask.done}
                        onChange={(data) => {
                            setSubTasks((prevSubTasks) => {
                                const updated = [...prevSubTasks];
                                updated[index] = data;
                                return updated;
                            });
                        }}
                        onDelete={() => {
                            setSubTasks((prevSubTasks) => prevSubTasks.filter((_, i) => i !== index));
                        }}
                    />
                ))}
            </div>

            <div className={styles.buttonConatainer}>
                <Button
                    primary={false}
                    label="Teendő hozzáadás"
                    size="large"
                    onClick={handleNewSubTask}
                    fillWidth={true}
                />
                <Button primary={false} label="Napló törlése" size="large" onClick={deleteLog} fillWidth={true} />
                <Button primary={true} label="Mentés" size="large" onClick={closeLog} fillWidth={true} />
            </div>
        </div>
    );
};

export default DailySchedule;
