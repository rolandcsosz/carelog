import React from "react";
import styles from "./SearchTextInput.module.scss";
import search from "../assets/search.svg";

interface TextInputProps {
    text: string;
    placeholder?: string;
    onChange: (value: string) => void;
    fillWidth?: boolean;
}

const TextInput: React.FC<TextInputProps> = ({ text, placeholder = "", onChange }) => {
    return (
        <div className={styles.searchContainer}>
            <input
                type="text"
                className={`${styles.textInput} ${styles.fill}`}
                value={text}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
            />
            <img src={search} alt="Search" className={styles.searchIcon} />
            <img />
        </div>
    );
};

export default TextInput;
