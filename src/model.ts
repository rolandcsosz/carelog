import { atom } from "recoil";
import { ReactNode } from "react";
import { Log, PopupProps, User } from "./types";

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

export const openLogState = atom<Log | null>({
    key: "openLogState",
    default: null,
});

export const logoutCallbackState = atom<Set<() => void>>({
    key: "logoutCallbackState",
    default: new Set(),
});

export const isModalClosing = atom<boolean>({
    key: "isModalClosing",
    default: false,
});
