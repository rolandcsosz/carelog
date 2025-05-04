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
