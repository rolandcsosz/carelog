import React, { useEffect, useState } from "react";
import styles from "./LogCard.module.scss";
import TextInput from "./TextInput";
import { compareTime } from "../utils";
import deleteIcon from "../assets/delete.svg";
import IconButton from "./IconButton";
import useQueryData from "../hooks/useQueryData";
import { TaskLog } from "../../api/types.gen";
import TextArea from "./TextArea";
import { useDebounce } from "../hooks/useDebounce";

interface LogCardProps {
    index: number;
    task: TaskLog;
    startTimeInvalid?: boolean;
    disabled?: boolean;
    onChange: (value: TaskLog, index: number) => void;
    onDelete: (index: number) => void;
}

const LogCard: React.FC<LogCardProps> = ({
    index,
    task,
    startTimeInvalid = false,
    disabled = false,
    onChange,
    onDelete,
}) => {
    const [note, setNote] = useState(task.note || "");
    const debouncedNote = useDebounce(note, 500);
    const [selectedStartTime, setSelectedStartTime] = useState(task.startTime);
    const [selectedEndTime, setSelectedEndTime] = useState(task.endTime);
    const [taskDone, setTaskDone] = useState(task.done);
    const { getTaskNameById } = useQueryData();

    useEffect(() => {
        if (debouncedNote.trim() !== "") {
            updateSubtask({ note: debouncedNote });
        }
    }, [debouncedNote]);

    const updateSubtask = (partial: Partial<TaskLog> = {}) => {
        onChange(
            {
                ...task,
                startTime: selectedStartTime,
                endTime: selectedEndTime,
                done: taskDone,
                ...partial,
            } as TaskLog,
            index,
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.row}>
                {!disabled && (
                    <input
                        type="checkbox"
                        checked={taskDone}
                        className={styles.checkbox}
                        onChange={(e) => {
                            const checked = e.target.checked;
                            setTaskDone(checked);
                            updateSubtask({ done: checked });
                        }}
                    />
                )}
                <div className={styles.title}>{getTaskNameById(task.subTaskId)}</div>
                <div className={styles.spacer} />
                {!disabled && <IconButton svgContent={deleteIcon} isSmall onClick={() => onDelete(index)} />}
            </div>
            <div className={styles.lowerRow}>
                <div />
                <div className={styles.timeRow}>
                    <div className={styles.textLabel}>Időtartam</div>
                    <div className={styles.row}>
                        <TextInput
                            text={selectedStartTime}
                            type="time"
                            onChange={(value) => {
                                setSelectedStartTime(value);
                                updateSubtask({ startTime: value });
                            }}
                            fillWidth
                            invalid={startTimeInvalid || compareTime(selectedStartTime, selectedEndTime) > 0}
                            disabled={disabled}
                        />
                        <div className={styles.text}>:</div>
                        <TextInput
                            text={selectedEndTime}
                            type="time"
                            onChange={(value) => {
                                setSelectedEndTime(value);
                                updateSubtask({ endTime: value });
                            }}
                            fillWidth
                            invalid={compareTime(selectedStartTime, selectedEndTime) > 0}
                            disabled={disabled}
                        />
                    </div>
                </div>

                <div className={styles.noteRow}>
                    <div className={styles.textLabel}>Megjegyzés</div>
                    <TextArea
                        text={note}
                        onChange={(value) => {
                            setNote(value);
                        }}
                        fillWidth
                        disabled={disabled}
                    />
                </div>
            </div>
        </div>
    );
};

export default LogCard;
