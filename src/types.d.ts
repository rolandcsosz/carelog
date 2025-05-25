type MenuConfig = {
    [key: string]: {
        selectedIcon: string;
        unselectedIcon: string;
        alt: string;
        component?: React.FC;
    };
};

type Id = number;

type UserRole = "admin" | "caregiver" | "invalid";

interface NewScheduleData {
    id: Id;
    selectedOption: string;
    start: string;
    end: string;
}

interface NewPasswordData {
    old: string;
    new: string;
}

type Admin = {
    id: Id;
    name: string;
    email: string;
};

type User = {
    id: Id;
    role: UserRole;
    token: string;
};

interface NewPersonData {
    name: string;
    email: string;
    phone: string;
    password: string;
    address?: string;
}

interface NewSubTypeData {
    name: string;
    task: string;
}

type Caregiver = {
    id: Id;
    name: string;
    phone: string;
    email: string;
};

type Recipient = {
    id: Id;
    name: string;
    email: string;
    phone: string;
    address: string;
    fourHandCareNeeded: boolean;
    caregiverNote: string;
};

type Relationship = {
    id: Id;
    caregiverId: Id;
    recipientId: Id;
};

type Schedule = {
    id: Id;
    relationshipId: Id;
    start: string;
    end: string;
    date: Date;
};

type TaskType = {
    id: Id;
    name: string;
};

type Task = {
    subTaskId: Id;
    startTime: string;
    endTime: string;
    done: boolean;
    note: string;
};

type Log = {
    id: string;
    date: Date;
    relationshipId: Id;
    finished: boolean;
    closed: boolean;
    tasks: Task[];
};

type Todo = {
    id: Id;
    subtaskId: Id;
    relationshipId: Id;
    sequence: number;
    done: boolean;
};

type SubTask = {
    id: Id;
    name: string;
    taskTypeId: Id;
};

export type PopupProps = {
    content: ReactNode | null;
    onConfirm: () => Promise<PopupActionResult> | void;
    onCancel: () => Promise<PopupActionResult> | void;
    confirmButtonText?: string;
    cancelButtonText?: string;
    title: string;
    confirmOnly?: boolean;
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

export type SubTaskEditData = {
    index: number;
    title: string;
    catregory: string;
    startTime: string;
    endTime: string;
    done: boolean;
};
