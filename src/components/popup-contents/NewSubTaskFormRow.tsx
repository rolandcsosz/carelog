import styles from "./NewSubTaskFormRow.module.scss";
import React, { useEffect } from "react";
import TextInput from "../TextInput";
import { NewSubTypeData } from "../../types";
import Dropdown from "../Dropdown";

interface NewSubTaskFormRowProps {
    taskOptions: string[];
    onChange: (info: NewSubTypeData) => void;
}

const NewSubTaskFormRow: React.FC<NewSubTaskFormRowProps> = ({ taskOptions, onChange }) => {
    const [name, setName] = React.useState<string>("");
    const [task, setTask] = React.useState<string>(taskOptions[0] || "");

    useEffect(() => {
        onChange({ name, task });
    }, [name, task, onChange]);

    return (
        <>
            <div className={styles.formRow}>
                <div className={styles.formLabel}>Megnevezés</div>
                <TextInput text={name} placeholder="Megnevezés" onChange={setName} fillWidth={true} />
            </div>
            <div className={styles.formRow}>
                <div className={styles.formLabel}>Kategória</div>
                <Dropdown options={taskOptions} selected={task} onChange={setTask} fillWidth={true} />
            </div>
        </>
    );
};

export default NewSubTaskFormRow;
