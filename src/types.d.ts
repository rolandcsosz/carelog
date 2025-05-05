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
    selectedOption: string;
    start: string;
    end: string;
}

interface NewPasswordData {
    old: string;
    new: string;
}

type Admin = {
    id: number;
    name: string;
    email: string;
};

type User = {
    id: number;
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
    id: number;
    name: string;
    phone: string;
    email: string;
};

type Recipient = {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    four_hand_care_needed: boolean;
    caregiver_note: string;
};

type Relationship = {
    id: number;
    caregiverId: number;
    recipientId: number;
};
