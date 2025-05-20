import { atom } from "recoil";
import { ReactNode } from "react";

export const userState = atom<User | null>({
    key: "userState",
    default: null,
});

export const navigationPagesState = atom<ReactNode[]>({
    key: "navigationPagesState",
    default: [],
});

export const navigationActiveIndexState = atom<number>({
    key: "navigationActiveIndexState",
    default: 0,
});

export const navigationBufferAddedState = atom<boolean>({
    key: "navigationBufferAddedState",
    default: false,
});

export type PopupProps = {
    content: ReactNode | null;
    onConfirm: () => void;
    onCancel: () => void;
    confirmButtonText?: string;
    cancelButtonText?: string;
    title: string;
    confirmOnly?: boolean;
};

export const popupIsOpenState = atom<boolean>({
    key: "popupIsOpenState",
    default: false,
});

export const popupPropsState = atom<PopupProps | null>({
    key: "popupPropsState",
    default: null,
});

export const scrollPositionState = atom<number>({
    key: "scrollPositionState",
    default: 0,
});

export const bottomSheetOpenState = atom<boolean>({
    key: "bottomSheetOpenState",
    default: false,
});

export const bottomSheetContentState = atom<JSX.Element | null>({
    key: "bottomSheetContentState",
    default: null,
});
