import styles from "./Loading.module.scss";
import React from "react";

interface SuccessProps {
    title: string;
    message: string;
}

const Success: React.FC<SuccessProps> = ({ title, message }) => {
    return (
        <div className={styles.container}>
            <div className={styles.wrap}>
                <svg height="100" width="100" viewBox="0 0 40 40" className={styles.loaderA}>
                    <g className={styles.loadAA}>
                        <path
                            d="m 20 5 a 1 1 0 0 1 0 30 c 0 0 -15 0 -15 -15"
                            stroke="#3182ce"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                        />
                    </g>
                    <g className={styles.loadAB}>
                        <path
                            d="m 20 10 a 1 1 0 0 1 0 20"
                            stroke="#3182ce"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                        />
                    </g>
                    <g className={styles.loadAC}>
                        <path
                            d="m 20 15 c 0 0 5 0 5 5"
                            stroke="#3182ce"
                            strokeWidth="3"
                            fill="none"
                            strokeLinecap="round"
                        />
                    </g>
                </svg>
            </div>
            <div className={styles.title}>{title}</div>

            <div className={styles.message}>{message}</div>
            <div />
        </div>
    );
};

export default Success;
