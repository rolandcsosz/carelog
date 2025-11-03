import React, { useEffect, useRef } from "react";
import styles from "./ChatInputField.module.scss";
import sendButton from "../assets/send-button.svg";

interface ChatInputFieldProps {
    value: string;
    placeholder?: string;
    onChange: (value: string) => void;
    onSend: () => void;
    disabled?: boolean;
    maxHeight?: number;
}

const initHeight = 54;
const paddingVertical = 16;
const initTextareaHeight = initHeight - paddingVertical;

const ChatInputField: React.FC<ChatInputFieldProps> = ({
    value,
    placeholder = "Type your message...",
    onChange,
    onSend,
    disabled = false,
    maxHeight = 100,
}) => {
    const textAreaRef = useRef<HTMLTextAreaElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (textAreaRef.current && containerRef.current) {
            textAreaRef.current.style.height = "auto";
            const scrollHeight = textAreaRef.current.scrollHeight;
            const maxTextareaHeight = maxHeight - paddingVertical;
            const textareaHeight = Math.max(initTextareaHeight, Math.min(scrollHeight, maxTextareaHeight));
            textAreaRef.current.style.height = `${textareaHeight}px`;
            const containerHeight = Math.max(initHeight, Math.min(textareaHeight + paddingVertical, maxHeight));
            containerRef.current.style.height = `${containerHeight}px`;
        }
    }, [value, maxHeight]);

    const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            if (value.trim()) {
                onSend();
            }
        }
    };

    const handleSend = () => {
        if (value.trim() && !disabled) {
            onSend();
        }
    };

    return (
        <div ref={containerRef} className={styles.container}>
            <textarea
                ref={textAreaRef}
                className={styles.textArea}
                value={value}
                onChange={(e) => onChange(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder={placeholder}
                disabled={disabled}
            />
            <button
                className={styles.sendButton}
                onClick={handleSend}
                disabled={disabled || !value.trim()}
                aria-label="Send message"
            >
                <img src={sendButton} alt="Send" />
            </button>
        </div>
    );
};

export default ChatInputField;
