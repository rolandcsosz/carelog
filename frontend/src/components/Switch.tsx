import React, { useState } from "react";
import styles from "./Switch.module.scss";

type SwitchProps = {
    onToggle: (isOn: boolean) => void;
    initialState?: boolean;
};

const Switch: React.FC<SwitchProps> = ({ onToggle, initialState = false }) => {
    const [isOn, setIsOn] = useState<boolean>(initialState);

    const toggleSwitch = () => {
        setIsOn(!isOn);
        onToggle(!isOn);
    };

    return (
        <div className={`${styles.switch} ${isOn ? styles.on : ""}`} onClick={toggleSwitch}>
            <div className={styles.thumb} />
        </div>
    );
};

export default Switch;
