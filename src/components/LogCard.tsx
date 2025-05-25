import React, { useEffect, useState } from "react";
import styles from "./LogCard.module.scss";
import TextInput from "./TextInput";
import { compareTime } from "../utils";
import { SubTaskEditData } from "../types";
import deleteIcon from "../assets/delete.svg";
import IconButton from "./IconButton";

interface LogCardProps {
    index: number;
    title: string;
    catregory: string;
    startTime: string;
    endTime: string;
    done: boolean;
    onChange?: (value: SubTaskEditData) => void;
    onDelete?: (index: number) => void;
}

const LogCard: React.FC<LogCardProps> = ({
    index,
    title,
    catregory,
    startTime,
    endTime,
    done,
    onChange = () => {},
    onDelete = () => {},
}) => {
    const [selectedStartTime, setSelectedStartTime] = useState(startTime);
    const [selectedEndTime, setSelectedEndTime] = useState(endTime);
    const [taskDone, setTaskDone] = useState(done);

    // Helper to call onChange with the latest internal state
    const updateSubtask = (partial: Partial<SubTaskEditData> = {}) => {
        onChange({
            index,
            title,
            catregory,
            startTime: partial.startTime ?? selectedStartTime,
            endTime: partial.endTime ?? selectedEndTime,
            done: partial.done ?? taskDone,
        });
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
                <div className={styles.title}>{title}</div>
                <div className={styles.categoryText}>•</div>
                <div className={styles.categoryText}>{catregory}</div>
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
