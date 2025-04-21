import { createContext, useCallback, useContext, useState, ReactNode, JSX, useEffect } from "react";

interface NavigationContextType {
    pages: ReactNode[];
    activeIndex: number;
    addPageToStack: (page: ReactNode) => void;
    removeLastPageFromStack: () => void;
    setActiveMenu: (menu: string) => void;
    reset: () => void;
}

const NavigationContext = createContext<NavigationContextType | undefined>(undefined);

export const NavigationProvider = ({ children }: { children: ReactNode }): JSX.Element => {
    const [pages, setPages] = useState<ReactNode[]>([]);
    const [activeIndex, setActiveIndex] = useState<number>(0);
    const [bufferAdded, setBufferAdded] = useState<boolean>(false);

    const addPageToStack = useCallback(
        (page: ReactNode) => {
            let updatedPages = [...pages];

            if (bufferAdded) {
                setBufferAdded(false);
                updatedPages = updatedPages.slice(0, -1);
            }

            setPages([...updatedPages, page]);

            setActiveIndex((prevIndex) => prevIndex + 1);
        },
        [[pages]],
    );

    const removeLastPageFromStack = useCallback(() => {
        setActiveIndex((prevIndex) => prevIndex - 1);

        if (activeIndex === pages.length) {
            setBufferAdded(true);
            return;
        }

        setPages((prevPages) => prevPages.slice(0, -1));
    }, [activeIndex, pages]);

    const setActiveMenu = useCallback((menu: string) => {
        setActiveIndex((prevIndex) => prevIndex + 1);
        setPages((prevPages) => [...prevPages, menu]);
    }, []);

    const reset = useCallback(() => {
        setPages([]);
        setActiveIndex(0);
        setBufferAdded(false);
    }, []);

    return (
        <NavigationContext.Provider
            value={{
                pages,
                activeIndex,
                addPageToStack,
                removeLastPageFromStack,
                setActiveMenu,
                reset,
            }}
        >
            {children}
        </NavigationContext.Provider>
    );
};

export const useNavigation = (): NavigationContextType => {
    const context = useContext(NavigationContext);
    if (!context) {
        throw new Error("useNavigation must be used within a NavigationProvider");
    }
    return context;
};
