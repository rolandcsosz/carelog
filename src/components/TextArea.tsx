import React from "react";
import styles from "./TextArea.module.scss";

interface TestAreaProps {
    text: string;
    placeholder?: string;
    type?: string;
    onChange: (value: string) => void;
    fillWidth?: boolean;
    height?: number;
    invalid?: boolean;
}

const TestArea: React.FC<TestAreaProps> = ({
    text,
    placeholder = "",
    onChange,
    fillWidth = false,
    invalid = false,
}) => {
    return (
        <textarea
            className={`
            ${styles.textInput}
            ${fillWidth ? styles.fill : ""}
            ${invalid ? styles.invalid : ""}
        `}
            value={text}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
        />
    );
};

export default TestArea;
