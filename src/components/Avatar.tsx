import React from "react";
import styles from "./Avatar.module.scss";

interface AvatarProps {
    userName: string;
    size?: "small" | "medium" | "large";
}

const getInitials = (name: string) => {
    const initials = name.match(/\b\w/g) || [];
    return ((initials.shift() || "") + (initials.pop() || "")).toUpperCase();
}

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
}

const Avatar: React.FC<AvatarProps> = ( { userName, size = "medium" }) => {
  return (
    <div className={`${styles.avatar} ${getSize(size)}`} role="presentation">{getInitials(userName)}</div>

  );
}

export default Avatar;
