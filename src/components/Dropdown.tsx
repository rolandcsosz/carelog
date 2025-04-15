import React from "react";
import styles from "./Dropdown.module.scss";

interface DropdownProps {
    selected: string;
    options: string[];
    onChange: (value: string) => void;
    fillWidth?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({ selected, options, onChange, fillWidth = false }) => {
    return (
        <select
            className={styles.dropdown}
            value={selected}
            onChange={(e) => onChange(e.target.value)}
            style={{ width: fillWidth ? "100%" : "auto" }}
        >
            {options.map((option, index) => (
                <option key={index} value={option}>
                    {option}
                </option>
            ))}
        </select>
    );
};

export default Dropdown;
