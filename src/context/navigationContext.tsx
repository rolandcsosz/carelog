import { createContext, useCallback, useContext, useState, ReactNode, JSX } from "react";

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
            setPages((prevPages) => {
                let updatedPages = [...prevPages];
                if (bufferAdded && updatedPages.length > 0) {
                    updatedPages = updatedPages.slice(0, -1);
                }
                const newPages = [...updatedPages, page];
                return newPages;
            });

            setActiveIndex((prevIndex) => prevIndex + 1);
        },
        [pages, bufferAdded, setActiveIndex, setPages],
    );

    const removeLastPageFromStack = useCallback(() => {
        setActiveIndex((prevIndex) => Math.max(prevIndex - 1, 0));

        setTimeout(() => {
            setPages((prevPages) => {
                const updatedPages = [...prevPages];
                if (updatedPages.length > 0) {
                    updatedPages.pop();
                }
                return updatedPages;
            });
        }, 300);
    }, [setActiveIndex, setPages]);

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
