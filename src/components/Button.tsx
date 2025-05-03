import styles from "./Button.module.scss";

export interface ButtonProps {
    primary?: boolean;
    size?: "small" | "medium" | "large";
    label: string;
    onClick?: () => void;
    fillWidth?: boolean;
    type?: "button" | "submit" | "reset";
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
    label,
    fillWidth = false,
    onClick = () => {},
    type = "button",
}: ButtonProps) => {
    const mode = primary ? styles.primary : styles.secondary;
    return (
        <button
            type={type}
            className={[styles.button, `${getSize(size)}`, mode].join(" ")}
            style={{ width: fillWidth ? "100%" : "auto" }}
            onClick={onClick}
        >
            {label}
        </button>
    );
};
