import { useRecoilState } from "recoil";
import { popupIsOpenState, popupPropsState, PopupProps } from "../model";
import { useCallback } from "react";

const usePopup = () => {
    const [isOpen, setIsOpen] = useRecoilState(popupIsOpenState);
    const [popupProps, setPopupProps] = useRecoilState(popupPropsState);

    const openPopup = useCallback(
        (props: PopupProps) => {
            setPopupProps(props);
            setIsOpen(true);
        },
        [setPopupProps, setIsOpen],
    );

    const closePopup = useCallback(() => {
        setIsOpen(false);
        setPopupProps(null);
    }, [setIsOpen, setPopupProps]);

    const onConfirm = useCallback(() => {
        popupProps?.onConfirm?.();
        closePopup();
    }, [popupProps, closePopup]);

    const onCancel = useCallback(() => {
        popupProps?.onCancel?.();
        closePopup();
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
