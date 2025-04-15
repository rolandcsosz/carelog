import React from "react";
import styles from "./TextInput.module.scss";

interface TextInputProps {
    text: string;
    placeholder?: string;
    onChange: (value: string) => void;
    fillWidth?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ text, placeholder = "", onChange, fillWidth = false }) => {
    return (
        <input
            type="text"
            className={`${styles.textInput} ${fillWidth ? styles.fill : ""}`}
            value={text}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
        />
    );
};

export default TextInput;
