import styles from "./Success.module.scss";
import React from "react";

interface SuccessProps {
    title: string;
    message: string;
}

const Success: React.FC<SuccessProps> = ({ title, message }) => {
    return (
        <div className={styles.container}>
            <div className={styles.wrapper}>
                <svg
                    className={`${styles.checkmark} ${styles.success}`}
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 52 52"
                >
                    <circle className={styles.checkmark_circle_success} cx="26" cy="26" r="25" fill="none" />
                    <path
                        className={styles.checkmark_check}
                        fill="none"
                        d="M14.1 27.2l7.1 7.2 16.7-16.8"
                        stroke-linecap="round"
                    />
                </svg>
            </div>
            <div className={styles.title}>{title}</div>

            <div className={styles.message}>{message}</div>
            <div />
        </div>
    );
};

export default Success;
