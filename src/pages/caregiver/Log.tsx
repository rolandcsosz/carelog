import styles from "./Log.module.scss";
import React from "react";
import { useCaregiverModel } from "../../hooks/useCaregiverModel.ts";
import { denormalizeTime, getDateString, getDefaultErrorModal } from "../../utils.tsx";
import { Button } from "../../components/Button.tsx";
import useQueryData from "../../hooks/useQueryData.ts";
import { openLogState } from "../../model.ts";
import { useRecoilValue } from "recoil";
import useBottomSheet from "../../hooks/useBottomSheet.ts";
import usePopup from "../../hooks/usePopup.tsx";
import { NewSubTypeData, PopupActionResult, Task } from "../../types";
import LogCard from "../../components/LogCard.tsx";
import NewSubTaskFormRow from "../../components/popup-contents/NewSubTaskFormRow.tsx";
import useLoader from "../../hooks/useLoader.tsx";

const Log: React.FC = () => {
    const { logs, subTasks } = useCaregiverModel();
    const { openLoader } = useLoader();
    const { getRecipientForLog, getTaskIdByName } = useQueryData();
    const openLog = useRecoilValue(openLogState);
    const recipient = openLog ? getRecipientForLog(openLog) : undefined;
    const { closeSheet } = useBottomSheet();
    const { openPopup, closePopup } = usePopup();
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
                        openLoader({
                            title: "Feldolgozás folyamatban...",
                            message: "Új napló bezárás folyamatban...",
                            timeout: 2000,
                            callback: () => {
                                closePopup();
                                closeSheet();
                            },
                        });
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
                    taskOptions={subTasks.list?.map((task) => task.name || "") || []}
                />
            ),
            onConfirm: (): Promise<PopupActionResult> | void => {
                const task = localTaskRef.current;
                if (!task || task.task === "") {
                    return Promise.resolve({ ok: false, quitUpdate: true, message: "" });
                }

                const newTask: Task = {
                    subTaskId: getTaskIdByName(task.task) || -1,
                    startTime: getCurrentTime(),
                    endTime: getCurrentTime(),
                    done: false,
                    note: "",
                };

                saveTask(newTask);
                return Promise.resolve({ ok: true, quitUpdate: true, message: "" });
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

    const saveTask = (task: Task | null, index: number | null = null) => {
        if (!openLog) {
            return;
        }

        let updatedTasks = openLog?.tasks;

        if (index === null) {
            updatedTasks = [...openLog.tasks, task].filter((item) => item !== null);
        } else {
            updatedTasks = updatedTasks
                .map((data, i) => {
                    if (i === index) {
                        if (!task) {
                            return null;
                        }
                        return { ...data, ...task };
                    }
                    return data;
                })
                .filter((item) => item !== null);
        }

        if (updatedTasks.length === openLog.tasks.length && index === null) {
            return;
        }

        logs.edit(
            {
                id: openLog?.id.toString(),
                requestBody: {
                    tasks: updatedTasks.map((task) => ({
                        subTaskId: task.subTaskId.toString(),
                        startTime: denormalizeTime(task.startTime),
                        endTime: denormalizeTime(task.endTime),
                        done: task.done,
                        note: task.note,
                    })),
                },
            },
            {
                onSuccess: () => {
                    if (task !== null && index === null) {
                        openLoader({
                            title: "Feldolgozás folyamatban...",
                            message: "Teendő hozzáadása folyamatban...",
                            timeout: 2000,
                            callback: () => {
                                logs.refetch();
                            },
                        });
                    } else if (task === null && index !== null) {
                        openLoader({
                            title: "Feldolgozás folyamatban...",
                            message: "Teendő törlése folyamatban...",
                            timeout: 2000,
                            callback: () => {
                                logs.refetch();
                            },
                        });
                    }
                },
                onError: (error) => {
                    openPopup(
                        getDefaultErrorModal(
                            "Sikertelen módosítás",
                            error?.message || "Ismeretlen hiba történt a napló mentése során.",
                            closePopup,
                        ),
                    );

                    Promise.resolve(null);
                },
            },
        );
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
                {openLog?.tasks.map((subTask, index) => {
                    // Check if previous card's endTime is later than this card's startTime
                    let prevEndTimeLater = false;
                    if (index > 0) {
                        const prevEnd = openLog.tasks[index - 1].endTime;
                        const currStart = subTask.startTime;
                        prevEndTimeLater = prevEnd > currStart;
                    }
                    return (
                        <LogCard
                            key={"log-card" + index}
                            index={index}
                            task={subTask}
                            startTimeInvalid={prevEndTimeLater}
                            onChange={saveTask}
                            onDelete={() => saveTask(null, index)}
                        />
                    );
                })}
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
                <Button primary={true} label="Mentés és bezárás" size="large" onClick={closeLog} fillWidth={true} />
            </div>
        </div>
    );
};

export default Log;
