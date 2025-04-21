// PopupContext.tsx
import { createContext, useCallback, useContext, useState, ReactNode, JSX } from "react";

// Define the context type interface
interface PopupContextType {
    isOpen: boolean;
    content: ReactNode | null;
    closePopup: () => void;
    openPopup: (component: ReactNode) => void;
}

// Create the PopupContext with an undefined default value
export const PopupContext = createContext<PopupContextType | undefined>(undefined);

// Provider component
export const PopupProvider = ({ children }: { children: ReactNode }): JSX.Element => {
    const [isOpen, setIsOpen] = useState(false);
    const [content, setContent] = useState<ReactNode | null>(null);

    const openPopup = useCallback((component: ReactNode) => {
        setContent(component);
        setIsOpen(true);
    }, []);

    const closePopup = useCallback(() => {
        setIsOpen(false);
        setContent(null);
    }, []);

    return <PopupContext.Provider value={{ isOpen, content, openPopup, closePopup }}>{children}</PopupContext.Provider>;
};

// Custom hook to use the popup context
export const usePopup = (): PopupContextType => {
    const context = useContext(PopupContext);
    if (!context) {
        throw new Error("usePopup must be used within a PopupProvider");
    }
    return context;
};
