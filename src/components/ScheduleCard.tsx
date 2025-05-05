import React, { useEffect } from "react";
import styles from "./ScheduleCard.module.scss";
import Dropdown from "./Dropdown";
import TextInput from "./TextInput";

interface ScheduleCardProps {
    title: string;
    options: string[];
    onChange: (value: NewScheduleData) => void;
    startTime: string;
    endTime: string;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({ title, options, onChange, startTime, endTime }) => {
    const [selectedOption, setSelectedOption] = React.useState<string>(options[0]);
    const [selectedStartTime, setSelectedStartTime] = React.useState<string>(startTime);
    const [selectedEndTime, setSelectedEndTime] = React.useState<string>(endTime);

    useEffect(() => {
        const newScheduleData: NewScheduleData = {
            selectedOption,
            start: selectedStartTime,
            end: selectedEndTime,
        };
        onChange(newScheduleData);
    }, [selectedOption, selectedStartTime, selectedEndTime]);

    return (
        <div className={styles.container}>
            <div className={styles.row}>
                <div className={styles.headerText}>{title}</div>
                <Dropdown selected={title} options={options} onChange={setSelectedOption} fillWidth={true}></Dropdown>
            </div>
            <div className={styles.row}>
                <div className={styles.timeContainer}>
                    <div className={styles.text}>Kezdés</div>
                    <TextInput text={startTime} type="time" onChange={setSelectedStartTime} fillWidth={true} />
                </div>
                <div />
                <div className={styles.timeContainer}>
                    <div className={styles.text}>Véd</div>
                    <TextInput text={endTime} type="time" onChange={setSelectedEndTime} fillWidth={true} />
                </div>
            </div>
        </div>
    );
};

export default ScheduleCard;
