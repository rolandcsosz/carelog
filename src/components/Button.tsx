import styles from "./Button.module.scss";

export interface ButtonProps {
    primary?: boolean;
    size?: "small" | "medium" | "large";
    label: string;
    onClick?: () => void;
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

export const Button = ({ primary = false, size = "medium", label, ...props }: ButtonProps) => {
    const mode = primary ? styles.primary : styles.secondary;
    return (
        <button type="button" className={[styles.button, `${getSize(size)}`, mode].join(" ")} {...props}>
            {label}
        </button>
    );
};
