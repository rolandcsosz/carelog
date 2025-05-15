import React, { useEffect } from "react";
import styles from "./ScheduleCard.module.scss";
import Dropdown from "./Dropdown";
import TextInput from "./TextInput";

interface ScheduleCardProps {
    title: string;
    options: Map<number, string>;
    onChange: (value: NewScheduleData) => void;
    startTime: string;
    endTime: string;
    dropDownDisabled?: boolean;
}

const ScheduleCard: React.FC<ScheduleCardProps> = ({
    title,
    options,
    onChange,
    startTime,
    endTime,
    dropDownDisabled = false,
}) => {
    const [selectedId, setSelectedId] = React.useState<number>(Array.from(options.keys())[0] || -1);
    const [selectedStartTime, setSelectedStartTime] = React.useState<string>(startTime);
    const [selectedEndTime, setSelectedEndTime] = React.useState<string>(endTime);

    useEffect(() => {
        const newScheduleData: NewScheduleData = {
            selectedId,
            start: selectedStartTime,
            end: selectedEndTime,
        };
        onChange(newScheduleData);
    }, [selectedId, selectedStartTime, selectedEndTime]);

    return (
        <div className={styles.container}>
            <div className={styles.row}>
                <div className={styles.headerText}>{title}</div>
                <Dropdown
                    disabled={dropDownDisabled}
                    selected={options.get(selectedId) || ""}
                    options={options}
                    onIdChange={setSelectedId}
                    fillWidth={true}
                ></Dropdown>
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
