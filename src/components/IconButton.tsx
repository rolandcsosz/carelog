import React from "react";
import styles from "./InputDesign.module.scss";

interface IconButtonProps {
  svgContent: string;
  ariaLabel: string;
  onClick?: () => void;
}

const IconButton: React.FC<IconButtonProps> = ({ svgContent, ariaLabel, onClick = () => {} }) => {
  return (
    <button className={styles.navIconButton} aria-label={ariaLabel} onClick={onClick}>
      <img src={svgContent} alt={ariaLabel} />
    </button>
  );
};

export default IconButton;
