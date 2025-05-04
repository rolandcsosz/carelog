import { createContext, useCallback, useContext, useState, ReactNode, JSX, useRef } from "react";

interface PopupContextType {
    isOpen: boolean;
    content: ReactNode | null;
    closePopup: () => void;
    openPopup: (component: ReactNode, onConfirm: () => void, onCancel?: () => void) => void;
    onConfirm: () => void;
    onCancel: () => void;
}

const PopupContext = createContext<PopupContextType | undefined>(undefined);

export const PopupProvider = ({ children }: { children: ReactNode }): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState<ReactNode | null>(null);
    const onConfirmCallbackRef = useRef<(() => void) | null>(null);
    const onCancelCallbackRef = useRef<(() => void) | null>(null);

    const openPopup = useCallback((component: ReactNode, onConfirm: () => void, onCancel: () => void = () => {}) => {
        setContent(component);
        onConfirmCallbackRef.current = onConfirm;
        onCancelCallbackRef.current = onCancel;
        setIsOpen(true);
    }, []);

    const closePopup = useCallback(() => {
        setIsOpen(false);
        setContent(null);
    }, []);

    const onConfirm = useCallback(() => {
        if (onConfirmCallbackRef.current) {
            onConfirmCallbackRef.current();
        }
        closePopup();
    }, [closePopup]);

    const onCancel = useCallback(() => {
        if (onCancelCallbackRef.current) {
            onCancelCallbackRef.current();
        }
        closePopup();
    }, [closePopup]);

    return (
        <PopupContext.Provider value={{ isOpen, content, openPopup, closePopup, onConfirm, onCancel }}>
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
