"use client";
import React from "react";
import styles from "./DateCard.module.scss";
import chevronRight from "../assets/chevron-right.svg";
import IconButton from "./IconButton";

interface DateCardProps {
    date: Date | number;
    onClick?: () => void;
}
/*
const isValidDate = (timestamp: number): boolean => {
    const date = new Date(timestamp);
    return !isNaN(date.getTime());
};*/

/*const storeDate = (timestamp: number): Date | null => {
    if (isValidDate(timestamp)) {
        return new Date(timestamp);
    }
    return null;
};*/

const formatDate = (date: Date | number): string => {
    const parsedDate = new Date(date);
    return parsedDate.toISOString().split("T")[0];
};

const DateCard: React.FC<DateCardProps> = ({ date, onClick = () => {} }) => {
    return (
        <div className={styles.container} onClick={onClick}>
            <h3 className={styles.userName}>{formatDate(date)}</h3>
            <IconButton svgContent={chevronRight} ariaLabel="Select user" />
        </div>
    );
};

export default DateCard;
