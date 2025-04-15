import React from "react";
import styles from "./Popup.module.scss";
import close from "../assets/close.svg";
import { Button } from "./Button";
import IconButton from "./IconButton";

type PopupProps = {
    cancelButtonText?: string;
    confirmButtonText: string;
    onClose: () => void;
    onConfirm: () => void;
    onCancel?: () => void;
    onlyConfirm: boolean;
    title: string;
    children: React.ReactNode;
};

const Popup: React.FC<PopupProps> = ({
    cancelButtonText = "",
    confirmButtonText,
    onClose,
    onConfirm,
    onCancel = () => {},
    onlyConfirm,
    title,
    children,
}) => {
    return (
        <div className={styles.overlay}>
            <div className={styles.modal}>
                <div className={styles.closeButton}>
                    <IconButton svgContent={close} ariaLabel="Close" onClick={onClose} isSmall={true} />
                </div>

                <div className={styles.modalHeader}>{title}</div>
                <div className={styles.modalBody}>{children}</div>
                <div className={styles.modalFooter}>
                    {onlyConfirm ? null : (
                        <Button
                            size={"medium"}
                            label={cancelButtonText}
                            onClick={onCancel}
                            primary={false}
                            fillWidth={true}
                        />
                    )}
                    <Button
                        size={"medium"}
                        label={confirmButtonText}
                        onClick={onConfirm}
                        primary={true}
                        fillWidth={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default Popup;
