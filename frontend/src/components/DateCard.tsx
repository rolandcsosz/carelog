"use client";
import React from "react";
import styles from "./DateCard.module.scss";
import chevronRight from "../assets/chevron-right.svg";
import IconButton from "./IconButton";
import { getDateString } from "../utils";

interface DateCardProps {
    date: Date | number;
    onClick?: () => void;
}

const DateCard: React.FC<DateCardProps> = ({ date, onClick = () => {} }) => {
    return (
        <div className={styles.container} onClick={onClick}>
            <h3 className={styles.userName}>{getDateString(new Date(date))}</h3>
            <IconButton svgContent={chevronRight} ariaLabel="Select user" />
        </div>
    );
};

export default DateCard;
