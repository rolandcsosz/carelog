import styles from "./DailySchedule.module.scss";
import React, { useEffect } from "react";
import useNavigation from "../../hooks/useNavigation.ts";
import TimeTableRow from "../../components/TimeTableRow.tsx";
import { useCaregiverModel } from "../../hooks/useCaregiverModel.ts";
import Recipient from "./RecipientPage.tsx";
import { getHourAndMinuteTimeString, getDateString } from "../../utils.tsx";
import useBottomSheet from "../../hooks/useBottomSheet.ts";
import useQueryData from "../../hooks/useQueryData.ts";
import { actualLogTasksState, openLogState } from "../../model.ts";
import { useRecoilValue, useSetRecoilState } from "recoil";
import { PopupActionResult, Schedule } from "../../types";
import usePopup from "../../hooks/usePopup.tsx";

type TaskDescription = {
    subtaskId: number;
    startTime: string | null;
    endTime: string | null;
};

const DailySchedule: React.FC = () => {
    const { addPageToStack } = useNavigation();
    const { logs, todos } = useCaregiverModel();
    const { openSheet } = useBottomSheet();
    const { getFilteredSchedules, getRecipientForSchedule } = useQueryData();
    const today = new Date();
    const openLog = useRecoilValue(openLogState);
    const filteredSchedules = getFilteredSchedules(today);
    const { openPopup } = usePopup();
    const setSubTasks = useSetRecoilState(actualLogTasksState);

    useEffect(() => {
        logs.list?.forEach((log, index) => {
            //console.log("Log at index:", index, log.finished);
        });
    }, [logs.list]); // rerender when logs.list changes

    //"done" | "notEditable" | "new" | "error";
    //TODO: open log test
    const getStatusForSchedule = (schedule: Schedule) => {
        const log = logs.list?.find((log) => log.relationshipId === schedule.relationshipId);
        if (!log) {
            return openLog ? "notEditable" : "new";
        }

        if (log.finished) {
            return "done";
        }

        return openLog ? "notEditable" : "new";
    };

    const handleNewLog = (schedule: Schedule) => {
        setSubTasks([]);

        const copyTodos: TaskDescription[] =
            todos?.list
                ?.filter((todo) => !todo.relationshipId || todo.relationshipId === schedule.relationshipId)
                .sort((a, b) => (a.sequence ?? 0) - (b.sequence ?? 0))
                .map(
                    (todo) =>
                        ({
                            subtaskId: todo.id,
                            startTime: null,
                            endTime: null,
                        }) as TaskDescription,
                ) || [];
        const prevTodos: TaskDescription[] =
            logs?.list
                ?.filter((log) => log.relationshipId === schedule.relationshipId)
                ?.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())?.[0]
                ?.tasks.map(
                    (task) =>
                        ({
                            subtaskId: Number(task.subTaskId),
                            startTime: task.startTime || null,
                            endTime: task.endTime || null,
                        }) as TaskDescription,
                ) || [];
        const currentTime = getHourAndMinuteTimeString(today);
        const add = (mode: "copy" | "new"): Promise<PopupActionResult> => {
            return new Promise<PopupActionResult>((resolve) => {
                logs.add(
                    {
                        requestBody: {
                            id: "",
                            date: getDateString(today, "-"),
                            relationshipId: schedule.relationshipId.toString(),
                            finished: false,
                            closed: false,
                            tasks: (mode === "new" || prevTodos.length === 0 ? copyTodos : prevTodos).map((todo) => ({
                                subTaskId: String(todo.subtaskId),
                                startTime: todo.startTime || currentTime,
                                endTime: todo.endTime || currentTime,
                                done: false,
                                note: "",
                            })),
                        },
                    },
                    {
                        onSuccess: () => {
                            setTimeout(() => {
                                logs.refetch();
                                openSheet();
                            }, 2000);

                            resolve({
                                ok: true,
                                loading: true,
                                message: "Új napló létrehozása folyamatban...",
                                quitUpdate: false,
                                autoCloseAfterTimeout: 2000,
                            });
                        },
                        onError: (error) => {
                            resolve({
                                ok: false,
                                loading: false,
                                message: error.message,
                                quitUpdate: true,
                            });
                        },
                    },
                );
            });
        };

        openPopup({
            title: "Új napló indítása",
            confirmButtonText: "Másolás",
            cancelButtonText: "Új napló",
            content: <div>Az utolsó mentet naplót használnád újra vagy üres naplót kezdenél?</div>,
            onConfirm: () => add("copy"),
            onCancel: () => add("new"),
        });
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
                            key={"time-table-row" + schedule.id}
                            start={schedule.start}
                            end={schedule.end}
                            userName={recipient.name}
                            address={recipient.address}
                            type={getStatusForSchedule(schedule)}
                            onOpen={() => {
                                addPageToStack(<Recipient recipient={recipient} />);
                            }}
                            onNewLog={() => {
                                handleNewLog(schedule);
                            }}
                        />
                    );
                })}
            </div>
        </div>
    );
};

export default DailySchedule;
