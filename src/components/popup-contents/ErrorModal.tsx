import styles from "./ErrorModal.module.scss";
import React from "react";

interface ErrorModalProps {
    title: string;
    message: string;
}

const ErrorModal: React.FC<ErrorModalProps> = ({ title, message }) => {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <svg
                    className={`${styles.checkmark} ${styles.error}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 52 52"
                >
                    <circle className={styles.checkmark_circle_error} cx="26" cy="26" r="25" fill="none" />
                    <path
                        className={styles.checkmark_check}
                        stroke-linecap="round"
                        fill="none"
                        d="M16 16 36 36 M36 16 16 36
            "
                    />
                </svg>
            </div>
            <div className={styles.title}>{title}</div>
            <div className={styles.message}>{message}</div>
            <div />
        </div>
    );
};

export default ErrorModal;
