import { useRecoilState, useSetRecoilState } from "recoil";
import { isModalClosing, popupIsOpenState, popupPropsState } from "../model";
import { useCallback } from "react";
import { PopupActionResult, PopupProps } from "../types";
import ErrorModal from "../components/popup-contents/ErrorModal";
import Success from "../components/popup-contents/Success";
import Loading from "../components/popup-contents/Loading";

const usePopup = () => {
    const [isOpen, setIsOpen] = useRecoilState(popupIsOpenState);
    const [popupProps, setPopupProps] = useRecoilState(popupPropsState);
    const setIsClosing = useSetRecoilState(isModalClosing);

    const openPopup = useCallback(
        (props: PopupProps) => {
            setPopupProps(props);
            setIsOpen(true);
        },
        [setPopupProps, setIsOpen],
    );

    const closePopup = useCallback(() => {
        setIsClosing(true);
        setTimeout(() => {
            setIsClosing(false);
            setIsOpen(false);
            setPopupProps(null);
        }, 300); // Adjust the timeout to match your closing animation duration
    }, [setIsOpen, setPopupProps, setIsClosing]);

    const handleButtonClick = useCallback(
        (response: void | PopupActionResult | undefined) => {
            if (!response) {
                closePopup();
                return;
            }

            if (response.quitUpdate) {
                return;
            }

            if (response.loading === true) {
                openPopup({
                    content: <Loading title="Feldolgozás folyamatban..." message={response.message} />,
                    title: "",
                    confirmButtonText: "Bezárás",
                    cancelButtonText: "",
                    confirmOnly: true,
                    onConfirm: closePopup,
                    onCancel: closePopup,
                });

                if (response.autoCloseAfterTimeout) {
                    setTimeout(() => {
                        closePopup();
                    }, response.autoCloseAfterTimeout);
                }

                return;
            }

            if (!response.ok) {
                openPopup({
                    content: (
                        <ErrorModal
                            title="Sikertelen művelet"
                            message={response?.message || "Ismeretlen hiba történt."}
                        />
                    ),
                    title: "",
                    confirmButtonText: "Rendben",
                    cancelButtonText: "",
                    confirmOnly: true,
                    onConfirm: closePopup,
                    onCancel: closePopup,
                });
                return;
            }

            openPopup({
                content: <Success title="Sikeres művelet" message="" />,
                title: "",
                confirmButtonText: "Rendben",
                cancelButtonText: "",
                confirmOnly: true,
                onConfirm: closePopup,
                onCancel: closePopup,
            });
        },
        [closePopup, openPopup],
    );

    const onConfirm = useCallback(async () => {
        const response = await popupProps?.onConfirm?.();
        handleButtonClick(response);
    }, [popupProps, closePopup, openPopup]);

    const onCancel = useCallback(async () => {
        const response = await popupProps?.onCancel?.();
        handleButtonClick(response);
    }, [popupProps, closePopup]);

    return {
        isOpen,
        content: popupProps?.content ?? null,
        title: popupProps?.title ?? "",
        confirmButtonText: popupProps?.confirmButtonText ?? "",
        cancelButtonText: popupProps?.cancelButtonText ?? "",
        confirmOnly: popupProps?.confirmOnly ?? false,
        openPopup,
        closePopup,
        onConfirm,
        onCancel,
    };
};

export default usePopup;
