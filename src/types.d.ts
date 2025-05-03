type MenuConfig = {
    [key: string]: {
        selectedIcon: string;
        unselectedIcon: string;
        alt: string;
        component?: React.FC;
    };
};

type User = {
    id: string;
    role: "admin" | "caregiver";
    token: string;
};
