import { useEffect, useState } from "react";
import styles from "./Button.module.scss";

export interface ButtonProps {
    primary?: boolean;
    size?: "small" | "medium" | "large";
    label?: string;
    onClick?: () => void;
    fillWidth?: boolean;
    type?: "button" | "submit" | "reset";
    noText?: boolean;
    icon?: string;
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
};

export const Button = ({
    primary = false,
    size = "medium",
    label = "",
    fillWidth = false,
    onClick = () => {},
    type = "button",
    noText = false,
    icon = "",
}: ButtonProps) => {
    const [coords, setCoords] = useState({ x: -1, y: -1 });
    const [isRippling, setIsRippling] = useState(false);
    useEffect(() => {
        if (coords.x !== -1 && coords.y !== -1) {
            setIsRippling(true);
            setTimeout(() => setIsRippling(false), 300);
        } else setIsRippling(false);
    }, [coords]);
    useEffect(() => {
        if (!isRippling) setCoords({ x: -1, y: -1 });
    }, [isRippling]);

    const mode = primary ? styles.primary : styles.secondary;
    return (
        <button
            type={type}
            className={`
                ${styles.button}
                ${getSize(size)}
                ${mode}
                ${noText ? styles.noText : ""}
                ${fillWidth ? styles.fillWidth : ""}
            `}
            onClick={(e) => {
                const rect = (e.target as HTMLButtonElement).getBoundingClientRect();
                setCoords({ x: e.clientX - rect.left, y: e.clientY - rect.top });
                onClick();
            }}
        >
            {icon && <img src={icon} alt="" className={styles.icon} />}
            {!noText && label}
            {isRippling && (
                <div
                    className={styles.ripple}
                    style={{
                        left: coords.x,
                        top: coords.y,
                    }}
                />
            )}
        </button>
    );
};
