type MenuConfig = {
    [key: string]: {
        selectedIcon: string;
        unselectedIcon: string;
        alt: string;
        component?: React.FC;
    };
};

type UserRole = "admin" | "caregiver" | "invalid";

type User = {
    id: string;
    role: UserRole;
    token: string;
};

interface NewPasswordData {
    old: string;
    new: string;
}

interface NewSubTypeData {
    name: string;
    task: string;
}

export type SubTaskEditData = {
    index: number;
    title: string;
    startTime: string;
    endTime: string;
    done: boolean;
};

interface NewScheduleData {
    id: Id;
    selectedOption: string;
    start: string;
    end: string;
}

interface NewPersonData {
    name: string;
    email: string;
    phone: string;
    password: string;
    address?: string;
}

export type PopupProps = {
    content: ReactNode | null;
    onConfirm: () => Promise<PopupActionResult> | void;
    onCancel: () => Promise<PopupActionResult> | void;
    confirmButtonText?: string;
    cancelButtonText?: string;
    title: string;
    confirmOnly?: boolean;
    timeout?: number;
};

export type PopupActionResult = {
    ok: boolean;
    loading?: boolean;
    message: string;
    quitUpdate: boolean;
    autoCloseAfterTimeout?: number;
};

export type FetchResponse<T> = {
    ok: boolean;
    data?: T;
    error?: string | null;
};
