import React from "react";
import styles from "./Dropdown.module.scss";

interface DropdownProps {
    selected: string;
    options: Map<number, string> | string[];
    onChange?: (value: string) => void;
    onIdChange?: (value: number) => void;
    fillWidth?: boolean;
    disabled?: boolean;
}

const Dropdown = ({
    selected,
    options,
    onChange = () => {},
    onIdChange = () => {},
    fillWidth = false,
    disabled = false,
}: DropdownProps) => {
    const entries: { id: number | null; label: string }[] =
        options instanceof Map ?
            Array.from(options.entries()).map(([id, label]) => ({ id, label }))
        :   options.map((v) => ({ label: v, id: null }));

    const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const label = e.target.options[e.target.selectedIndex].text;
        const raw = e.target.value;

        if (raw !== "") {
            onIdChange(Number(raw));
        }
        onChange(label);
    };

    return (
        <select
            className={styles.dropdown}
            value={selected}
            onChange={handleChange}
            style={{ width: fillWidth ? "100%" : "auto" }}
            disabled={disabled}
        >
            {entries.map(({ label, id }) => (
                <option key={label} value={id ?? ""}>
                    {label}
                </option>
            ))}
        </select>
    );
};

export default Dropdown;
