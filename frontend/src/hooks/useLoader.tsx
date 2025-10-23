import { useCallback } from "react";
import Loading from "../components/popup-contents/Loading";
import usePopup from "./usePopup";

type LoaderInfo = {
    title: string;
    message: string;
    timeout?: number;
    callback: () => void;
};

const useLoader = () => {
    const { openPopup, closePopup } = usePopup();

    const openLoader = useCallback(
        (info: LoaderInfo) => {
            openPopup({
                content: <Loading title={info.title} message={info.message} />,
                title: "",
                confirmButtonText: "Bezárás",
                cancelButtonText: "",
                confirmOnly: true,
                onConfirm: closePopup,
                onCancel: closePopup,
            });

            setTimeout(() => {
                info.callback();
                closePopup();
            }, info.timeout);
        },
        [openPopup],
    );

    return {
        openLoader,
    };
};

export default useLoader;
