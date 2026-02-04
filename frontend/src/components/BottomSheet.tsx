import styles from "./BottomSheet.module.scss";
import sheetCloseButtonUrl from "../assets/sheet-close-button.svg";
import { useRef, useState, useEffect } from "react";
import useBottomSheet from "../hooks/useBottomSheet";
import Log from "../pages/caregiver/Log";

enum SheetSize {
    FULL = 0.05 * window.innerHeight,
    CLOSED = window.innerHeight,
}

export function BottomSheet() {
    const { isOpen, closeSheet } = useBottomSheet();
    const sheetRef = useRef(null);
    const [sheetHeight, setSheetHeight] = useState(SheetSize.CLOSED);
    const [isDragging, setIsDragging] = useState(false);

    useEffect(() => {
        if (isOpen) {
            openSheet(SheetSize.FULL);
        }
    }, [isOpen]);

    const handleDrag = (event: MouseEvent | TouchEvent) => {
        if (!isDragging) return;

        let clientY: number;
        if ("touches" in event) {
            clientY = event.touches[0].clientY;
        } else {
            clientY = event.clientY;
        }
        setSheetHeight(clientY);
    };

    const handleDragEnd = (event: MouseEvent | TouchEvent) => {
        if (!isDragging) return;

        setIsDragging(false);

        let clientY: number;
        if ("changedTouches" in event) {
            clientY = event.changedTouches[0].clientY;
        } else {
            clientY = (event as MouseEvent).clientY;
        }

        if (dragStartYRef.current !== null) {
            const deltaY = clientY - dragStartYRef.current;
            if (deltaY > 0) {
                setSheetHeight(SheetSize.CLOSED);
                setTimeout(() => closeSheet(), 300);
            } else {
                setSheetHeight(SheetSize.FULL);
            }
        }
        dragStartYRef.current = null;
    };

    const dragStartYRef = useRef<number | null>(null);

    const handleDragStart = (event: React.MouseEvent | React.TouchEvent) => {
        setIsDragging(true);
        if ("touches" in event) {
            dragStartYRef.current = event.touches[0].clientY;
        } else {
            dragStartYRef.current = event.clientY;
        }
    };

    const closeSheetAnimated = () => {
        setSheetHeight(SheetSize.CLOSED);
        setTimeout(() => closeSheet(), 300);
    };

    const openSheet = (targetSize: SheetSize) => {
        setSheetHeight(targetSize);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleDrag);
            document.addEventListener("mouseup", handleDragEnd);
            document.addEventListener("touchmove", handleDrag);
            document.addEventListener("touchend", handleDragEnd);
        } else {
            document.removeEventListener("mousemove", handleDrag);
            document.removeEventListener("mouseup", handleDragEnd);
            document.removeEventListener("touchmove", handleDrag);
            document.removeEventListener("touchend", handleDragEnd);
        }

        return () => {
            document.removeEventListener("mousemove", handleDrag);
            document.removeEventListener("mouseup", handleDragEnd);
            document.removeEventListener("touchmove", handleDrag);
            document.removeEventListener("touchend", handleDragEnd);
        };
    }, [isDragging]);

    return (
        isOpen && (
            <div
                className={styles.bottomSheet}
                ref={sheetRef}
                style={{
                    transform: `translateY(${sheetHeight}px)`,
                    height: `100vh`,
                    transition: isDragging ? "none" : "transform 0.3s ease-in-out",
                }}
            >
                <div
                    className={styles.handleArea}
                    onMouseDown={handleDragStart}
                    onTouchStart={handleDragStart}
                    onClick={() => {
                        openSheet(sheetHeight);
                    }}
                >
                    <div className={styles.handleBar} />
                </div>
                <button className={styles.closeButton} onClick={closeSheetAnimated}>
                    <img src={sheetCloseButtonUrl} alt="Close" />
                </button>
                <div className={styles.bottomSheetContent}>
                    <Log />
                </div>
            </div>
        )
    );
}
