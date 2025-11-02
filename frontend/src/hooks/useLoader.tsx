import { useCallback } from "react";
import Loading from "../components/popup-contents/Loading";
import usePopup from "./usePopup";
import { PopupActionResult } from "../types";

type LoaderInfo = {
    title: string;
    message: string;
    timeout?: number;
    callback: () => void | Promise<void> | Promise<PopupActionResult | void>;
    onSuccess?: () => void;
    onError?: (error: any) => void;
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

            const executeCallback = async () => {
                try {
                    const result = await info.callback();

                    if (result && typeof result === "object" && "ok" in result) {
                        return result;
                    }

                    if (info.onSuccess) {
                        info.onSuccess();
                    }
                    closePopup();
                } catch (error) {
                    if (info.onError) {
                        info.onError(error);
                    } else {
                        closePopup();
                    }
                    throw error;
                }
            };

            if (info.timeout) {
                setTimeout(() => {
                    executeCallback();
                }, info.timeout);
            } else {
                executeCallback();
            }
        },
        [openPopup, closePopup],
    );

    return {
        openLoader,
    };
};

export default useLoader;
