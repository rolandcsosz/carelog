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
        // Use CSS transition for smoother closing
        setSheetHeight(SheetSize.CLOSED);
        setTimeout(() => closeSheet(), 300); // Wait for the animation to complete before closing
    };

    const openSheet = (targetSize: SheetSize) => {
        // Use CSS transition to smoothly open the sheet
        setSheetHeight(targetSize);
    };

    useEffect(() => {
        if (isDragging) {
            document.addEventListener("mousemove", handleDrag); // Add mousemove event listener
            document.addEventListener("mouseup", handleDragEnd); // Add mouseup event listener
            document.addEventListener("touchmove", handleDrag); // Add touchmove event listener
            document.addEventListener("touchend", handleDragEnd); // Add touchend event listener
        } else {
            document.removeEventListener("mousemove", handleDrag); // Remove mousemove event listener
            document.removeEventListener("mouseup", handleDragEnd); // Remove mouseup event listener
            document.removeEventListener("touchmove", handleDrag); // Remove touchmove event listener
            document.removeEventListener("touchend", handleDragEnd); // Remove touchend event listener
        }

        return () => {
            document.removeEventListener("mousemove", handleDrag); // Cleanup mousemove event listener
            document.removeEventListener("mouseup", handleDragEnd); // Cleanup mouseup event listener
            document.removeEventListener("touchmove", handleDrag); // Cleanup touchmove event listener
            document.removeEventListener("touchend", handleDragEnd); // Cleanup touchend event listener
        };
    }, [isDragging]);

    return (
        isOpen && (
            <div
                className={styles.bottomSheet}
                ref={sheetRef}
                style={{
                    transform: `translateY(${sheetHeight}px)`, // Translate sheet based on height
                    height: `100vh`,
                    transition: isDragging ? "none" : "transform 0.3s ease-in-out", // Use transform instead of height for smoother animations
                }}
            >
                <div
                    className={styles.handleArea}
                    onMouseDown={handleDragStart} // Start drag on mousedown
                    onTouchStart={handleDragStart} // Start drag on touchstart
                    onClick={() => {
                        openSheet(sheetHeight);
                    }} // Toggle sheet size on click
                >
                    <div className={styles.handleBar} />
                </div>
                <button
                    className={styles.closeButton}
                    onClick={closeSheetAnimated} // Close sheet with animation
                >
                    <img src={sheetCloseButtonUrl} alt="Close" />
                </button>
                <div className={styles.bottomSheetContent}>
                    <Log />
                </div>{" "}
                {/* Render sheet content */}
            </div>
        )
    );
}
