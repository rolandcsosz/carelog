import { createContext, useCallback, useContext, useState, ReactNode, JSX, useRef } from "react";

type PopupProps = {
    content: ReactNode | null;
    onConfirm: () => void;
    onCancel: () => void;
    confirmButtonText?: string;
    cancelButtonText?: string;
    title: string;
    confirmOnly?: boolean;
};

interface PopupContextType {
    isOpen: boolean;
    content: ReactNode | null;
    closePopup: () => void;
    openPopup: (info: PopupProps) => void;
    onConfirm: () => void;
    onCancel: () => void;
    title: string;
    confirmButtonText: string;
    cancelButtonText: string;
    confirmOnly: boolean;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const PopupProvider = ({ children }: { children: ReactNode }): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const [popupProps, setPopupProps] = useState<PopupProps | null>(null);

    const openPopup = useCallback((info: PopupProps) => {
        setPopupProps(info);
        setIsOpen(true);
    }, []);

    const closePopup = useCallback(() => {
        setIsOpen(false);
        setPopupProps(null);
    }, []);

    return (
        <PopupContext.Provider
            value={{
                isOpen,
                content: popupProps?.content,
                title: popupProps?.title ?? "",
                confirmButtonText: popupProps?.confirmButtonText ?? "",
                cancelButtonText: popupProps?.cancelButtonText ?? "",
                confirmOnly: popupProps?.confirmOnly ?? false,
                openPopup,
                closePopup,
                onConfirm: () => {
                    popupProps?.onConfirm?.();
                    closePopup();
                },
                onCancel: () => {
                    popupProps?.onCancel?.();
                    closePopup();
                },
            }}
        >
            {children}
        </PopupContext.Provider>
    );
};

export const usePopup = (): PopupContextType => {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error("usePopup must be used within a PopupProvider");
    }
    return context;
};
