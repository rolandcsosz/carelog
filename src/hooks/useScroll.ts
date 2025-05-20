import { useRecoilState } from "recoil";
import { scrollPositionState } from "../model";

const useScroll = () => {
    const [scrollPosition, setScrollPosition] = useRecoilState(scrollPositionState);

    return {
        scrollPosition,
        setScrollPosition,
    };
};

export default useScroll;
