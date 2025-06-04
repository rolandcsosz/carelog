import React, { useState } from "react";
import styles from "./LogCard.module.scss";
import TextInput from "./TextInput";
import { compareTime } from "../utils";
import { Task } from "../types";
import deleteIcon from "../assets/delete.svg";
import IconButton from "./IconButton";
import useQueryData from "../hooks/useQueryData";

interface LogCardProps {
    index: number;
    task: Task;
    startTimeInvalid?: boolean;
    onChange: (value: Task, index: number) => void;
    onDelete: (index: number) => void;
}

const LogCard: React.FC<LogCardProps> = ({ index, task, startTimeInvalid = false, onChange, onDelete }) => {
    const [selectedStartTime, setSelectedStartTime] = useState(task.startTime);
    const [selectedEndTime, setSelectedEndTime] = useState(task.endTime);
    const [taskDone, setTaskDone] = useState(task.done);
    const { getTaskNameById } = useQueryData();

    // Helper to call onChange with the latest internal state
    const updateSubtask = (partial: Partial<Task> = {}) => {
        onChange(
            {
                ...task,
                startTime: selectedStartTime,
                endTime: selectedEndTime,
                done: taskDone,
                ...partial,
            } as Task,
            index,
        );
    };

    return (
        <div className={styles.container}>
            <div className={styles.row}>
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
                <div className={styles.title}>{getTaskNameById(task.subTaskId)}</div>
                {/*<div className={styles.categoryText}>•</div>
                <div className={styles.categoryText}>{catregory}</div>*/}
                <div className={styles.spacer} />
                <IconButton svgContent={deleteIcon} isSmall onClick={() => onDelete(index)} />
            </div>
            <div className={styles.lowerRow}>
                <div className={styles.timeContainer}>
                    <div className={styles.text}>Kezdés</div>
                    <TextInput
                        text={selectedStartTime}
                        type="time"
                        onChange={(value) => {
                            setSelectedStartTime(value);
                            updateSubtask({ startTime: value });
                        }}
                        fillWidth
                        invalid={startTimeInvalid || compareTime(selectedStartTime, selectedEndTime) > 0}
                    />
                </div>
                <div />
                <div className={styles.timeContainer}>
                    <div className={styles.text}>Vég</div>
                    <TextInput
                        text={selectedEndTime}
                        type="time"
                        onChange={(value) => {
                            setSelectedEndTime(value);
                            updateSubtask({ endTime: value });
                        }}
                        fillWidth
                        invalid={compareTime(selectedStartTime, selectedEndTime) > 0}
                    />
                </div>
            </div>
        </div>
    );
};

export default LogCard;
