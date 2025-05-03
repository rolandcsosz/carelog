import React, { createContext, useContext, useState, ReactNode, JSX } from "react";

// Define the context and its types
interface ScrollContextType {
    scrollPosition: number;
    setScrollPosition: (position: number) => void;
}

const ScrollContext = createContext<ScrollContextType | undefined>(undefined);

export const ScrollProvider: React.FC<{ children: ReactNode }> = ({ children }): JSX.Element => {
    const [scrollPosition, setScrollPosition] = useState(0);

    return <ScrollContext.Provider value={{ scrollPosition, setScrollPosition }}>{children}</ScrollContext.Provider>;
};

export const useScroll = (): ScrollContextType => {
    const context = useContext(ScrollContext);
    if (!context) {
        throw new Error("useScroll must be used within a ScrollProvider");
    }
    return context;
};
