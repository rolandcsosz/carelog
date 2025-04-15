"use client";
import React from "react";
import styles from "./PersonCard.module.scss";
import chevronRight from "../assets/chevron-right.svg";
import Avatar from "./Avatar";
import IconButton from "./IconButton";

interface PersonCardProps {
    userName: string;
    onClick?: () => void;
}

const PersonCard: React.FC<PersonCardProps> = ({ userName, onClick = () => {} }) => {
    return (
        <div className={styles.container} onClick={onClick}>
            <Avatar userName={userName} size="medium" />
            <h3 className={styles.userName}>{userName}</h3>
            <IconButton svgContent={chevronRight} ariaLabel="Select user" />
        </div>
    );
};

export default PersonCard;
