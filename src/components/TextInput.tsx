import React from "react";
import styles from "./TextInput.module.scss";

interface TextInputProps {
    text: string;
    placeholder?: string;
    type?: string;
    onChange: (value: string) => void;
    fillWidth?: boolean;
    height?: number;
    invalid?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({
    text,
    placeholder = "",
    type = "text",
    onChange,
    fillWidth = false,
    height = 32,
    invalid = false,
}) => {
    return (
        <input
            type={type}
            className={`
                ${styles.textInput} 
                ${fillWidth ? styles.fill : ""} 
                ${invalid ? styles.invalid : ""}
            `}
            value={text}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            style={{ height: `${height}px` }}
        />
    );
};

export default TextInput;
