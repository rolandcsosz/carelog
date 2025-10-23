import { useRecoilState } from "recoil";
import { navigationPagesState, navigationActiveIndexState, navigationBufferAddedState } from "../model";
import { useCallback } from "react";
import { ReactNode } from "react";

const useNavigation = () => {
    const [pages, setPages] = useRecoilState(navigationPagesState);
    const [activeIndex, setActiveIndex] = useRecoilState(navigationActiveIndexState);
    const [bufferAdded, setBufferAdded] = useRecoilState(navigationBufferAddedState);

    const addPageToStack = useCallback(
        (page: ReactNode) => {
            setPages((prevPages) => {
                let updatedPages = [...prevPages];
                if (bufferAdded && updatedPages.length > 0) {
                    updatedPages = updatedPages.slice(0, -1);
                }
                return [...updatedPages, page];
            });

            setActiveIndex((prev) => prev + 1);
        },
        [bufferAdded, setPages, setActiveIndex],
    );

    const removeLastPageFromStack = useCallback(() => {
        setActiveIndex((prev) => Math.max(prev - 1, 0));

        setTimeout(() => {
            setPages((prevPages) => {
                const updatedPages = [...prevPages];
                if (updatedPages.length > 0) {
                    updatedPages.pop();
                }
                return updatedPages;
            });
        }, 300);
    }, [setPages, setActiveIndex]);

    const setActiveMenu = useCallback(
        (menu: string) => {
            setPages((prev) => [...prev, menu]);
            setActiveIndex((prev) => prev + 1);
        },
        [setPages, setActiveIndex],
    );

    const reset = useCallback(() => {
        setPages([]);
        setActiveIndex(0);
        setBufferAdded(false);
    }, [setPages, setActiveIndex, setBufferAdded]);

    return {
        pages,
        activeIndex,
        addPageToStack,
        removeLastPageFromStack,
        setActiveMenu,
        reset,
    };
};

export default useNavigation;
