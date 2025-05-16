import React from "react";
import styles from "./IconButton.module.scss";

interface IconButtonProps {
    svgContent: string | null | undefined;
    ariaLabel?: string;
    onClick?: () => void;
    isSmall?: boolean;
}

const IconButton: React.FC<IconButtonProps> = ({ svgContent, ariaLabel, onClick = () => {}, isSmall = false }) => {
    return svgContent === null ? null : (
            <button className={`${styles.iconButton} ${styles.small}`} aria-label={ariaLabel} onClick={onClick}>
                <img src={svgContent} alt={ariaLabel} />
            </button>
        );
};

export default IconButton;
