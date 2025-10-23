import { useRecoilState } from "recoil";
import { bottomSheetOpenState, bottomSheetContentState } from "../model";
import type { JSX } from "react";

const useBottomSheet = () => {
    const [isOpen, setIsOpen] = useRecoilState(bottomSheetOpenState);
    const [content, setContent] = useRecoilState(bottomSheetContentState);

    const openSheet = (component: JSX.Element | null = null) => {
        setContent(component);
        setIsOpen(true);
    };

    const closeSheet = () => {
        setIsOpen(false);
        setContent(null);
    };

    const toggleSheet = (component?: JSX.Element) => {
        if (isOpen) {
            closeSheet();
        } else if (component) {
            openSheet(component);
        }
    };

    return {
        isOpen,
        content,
        openSheet,
        closeSheet,
        toggleSheet,
    };
};

export default useBottomSheet;
