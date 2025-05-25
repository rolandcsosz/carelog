import React from "react";
import styles from "./Popup.module.scss";
import close from "../assets/close.svg";
import { Button } from "./Button";
import IconButton from "./IconButton";
import { useRecoilValue } from "recoil";
import { isModalClosing } from "../model";

type PopupProps = {
    cancelButtonText?: string;
    confirmButtonText: string;
    onClose: () => void;
    onConfirm: () => void;
    onCancel?: () => void;
    confirmOnly: boolean;
    title: string;
    children: React.ReactNode;
};

const Popup: React.FC<PopupProps> = ({
    cancelButtonText = "Mégse",
    confirmButtonText,
    onClose,
    onConfirm,
    onCancel = () => {},
    confirmOnly,
    title,
    children,
}) => {
    const isClosing = useRecoilValue(isModalClosing);

    return (
        <div className={styles.overlay}>
            <div className={`${styles.modal} ${isClosing ? styles.closing : ""}`}>
                <div className={styles.closeButton}>
                    <IconButton svgContent={close} ariaLabel="Close" onClick={onClose} isSmall={true} />
                </div>

                <div className={styles.modalHeader}>{title}</div>
                <div className={styles.modalBody}>{children}</div>
                <div className={styles.modalFooter}>
                    {!confirmOnly && (
                        <Button
                            size="medium"
                            label={cancelButtonText || "Mégse"}
                            onClick={onCancel}
                            primary={false}
                            fillWidth={false}
                            flexGrowIsOne={true}
                        />
                    )}
                    <Button
                        size="medium"
                        label={confirmButtonText}
                        onClick={onConfirm}
                        primary={true}
                        fillWidth={false}
                        flexGrowIsOne={true}
                    />
                </div>
            </div>
        </div>
    );
};

export default Popup;
