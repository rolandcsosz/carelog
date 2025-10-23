import React from "react";
import styles from "./Avatar.module.scss";

interface AvatarProps {
    userName: string;
    size?: "small" | "medium" | "large";
}

const getInitials = (name: string) => {
    const initials = name
        .trim()
        .replace(/\s+/g, " ")
        .split(" ")
        .map((word) => word.charAt(0));

    if (initials.length === 0) {
        return "?";
    }

    if (initials.length === 1) {
        return initials[0].toUpperCase();
    }

    if (initials.length > 2) {
        initials.splice(2, initials.length - 2);
    }

    return initials.join("").toUpperCase();
};

const getSize = (size: string) => {
    switch (size) {
        case "small":
            return styles.small;
        case "medium":
            return styles.medium;
        case "large":
            return styles.large;
        default:
            return styles.medium;
    }
};

const Avatar: React.FC<AvatarProps> = ({ userName, size = "medium" }) => {
    return (
        <div className={`${styles.avatar} ${getSize(size)}`} role="presentation">
            {getInitials(userName)}
        </div>
    );
};

export default Avatar;
