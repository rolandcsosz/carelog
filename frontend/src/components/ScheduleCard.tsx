import React, { useEffect } from "react";
import styles from "./ScheduleCard.module.scss";
import Dropdown from "./Dropdown";
import TextInput from "./TextInput";
import { compareTime } from "../utils";
import { NewScheduleData } from "../types";

interface ScheduleCardProps {
    id: number;
    title: string;
    options: string[];
    selectedOption: string;
    onChange: (value: NewScheduleData) => void;
    startTime: string;
    endTime: string;
    dropDownDisabled?: boolean;
    startTimeInvalid?: boolean;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({
    id,
    title,
    options,
    selectedOption,
    onChange,
    startTime,
    endTime,
    dropDownDisabled = false,
    startTimeInvalid = false,
}) => {
    const [selectedStartTime, setSelectedStartTime] = React.useState<string>(startTime);
    const [selectedEndTime, setSelectedEndTime] = React.useState<string>(endTime);

    useEffect(() => {
        const newScheduleData: NewScheduleData = {
            id: id,
            selectedOption: selectedOption,
            start: selectedStartTime,
            end: selectedEndTime,
        };
        onChange(newScheduleData);
    }, [selectedOption, selectedStartTime, selectedEndTime]);

    return (
        <div className={styles.container}>
            <div className={styles.row}>
                <div className={styles.headerText}>{title}</div>
                <Dropdown
                    disabled={dropDownDisabled}
                    selected={selectedOption}
                    options={options}
                    onChange={(value) => {
                        const newScheduleData: NewScheduleData = {
                            id: id,
                            selectedOption: value,
                            start: selectedStartTime,
                            end: selectedEndTime,
                        };
                        onChange(newScheduleData);
                    }}
                    fillWidth={true}
                ></Dropdown>
            </div>
            <div className={styles.row}>
                <div className={styles.timeContainer}>
                    <div className={styles.text}>Kezdés</div>
                    <TextInput
                        text={selectedStartTime}
                        type="time"
                        onChange={setSelectedStartTime}
                        invalid={startTimeInvalid || compareTime(selectedStartTime, selectedEndTime) > 0}
                    />
                </div>
                <div />
                <div className={styles.timeContainer}>
                    <div className={styles.text}>Vég</div>
                    <TextInput
                        text={selectedEndTime}
                        type="time"
                        onChange={setSelectedEndTime}
                        invalid={compareTime(selectedStartTime, selectedEndTime) > 0}
                    />
                </div>
            </div>
        </div>
    );
};

export default ScheduleCard;
