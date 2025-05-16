type MenuConfig = {
    [key: string]: {
        selectedIcon: string;
        unselectedIcon: string;
        alt: string;
        component?: React.FC;
    };
};

type Id = number;

type Ok = {};

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
    four_hand_care_needed: boolean;
    caregiver_note: string;
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
    subTaskId: string;
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
