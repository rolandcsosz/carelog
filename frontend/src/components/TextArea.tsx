import React, { useEffect, useRef } from "react";
import styles from "./TextArea.module.scss";

interface TextAreaProps {
    text: string;
    placeholder?: string;
    onChange: (value: string) => void;
    fillWidth?: boolean;
    invalid?: boolean;
    disabled?: boolean;
    autoSize?: boolean;
}

const TextArea: React.FC<TextAreaProps> = ({
    text,
    placeholder = "",
    onChange,
    fillWidth = false,
    invalid = false,
    disabled = false,
}) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        if (textAreaRef.current) {
            textAreaRef.current.style.height = "auto"; // reset height
            textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight - 16}px`; // grow to fit content
        }
    }, [text]);

    return (
        <textarea
            ref={textAreaRef}
            className={`
                ${styles.textInput}
                ${fillWidth ? styles.fill : ""}
                ${invalid ? styles.invalid : ""}
            `}
            value={text}
            onChange={(e) => onChange(e.target.value)}
            placeholder={placeholder}
            disabled={disabled}
        />
    );
};

export default TextArea;
