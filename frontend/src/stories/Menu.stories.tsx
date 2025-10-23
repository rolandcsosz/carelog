import type { Meta, StoryObj } from "@storybook/react";
import Menu from "../components/Menu";
import homeFilled from "../assets/home-filled.svg";
import homeOutline from "../assets/home-outline.svg";
import calendarFilled from "../assets/calendar-filled.svg";
import calendarOutline from "../assets/calendar-outline.svg";
import listFilled from "../assets/list-filled.svg";
import listOutline from "../assets/list-outline.svg";
import accountFilled from "../assets/account-filled.svg";
import accountOutline from "../assets/account-outline.svg";
import caregiverFilled from "../assets/caregiver-filled.svg";
import caregiverOutline from "../assets/caregiver-outline.svg";
import recipientFilled from "../assets/recipient-filled.svg";
import recipientOutline from "../assets/recipient-outline.svg";
import { MenuConfig } from "../types";

const meta = {
    component: Menu,
} satisfies Meta<typeof Menu>;

export default meta;

type Story = StoryObj<typeof meta>;

const caregiverMenuConfig: MenuConfig = {
    home: {
        selectedIcon: homeFilled,
        unselectedIcon: homeOutline,
        alt: "Home",
    },
    calendar: {
        selectedIcon: calendarFilled,
        unselectedIcon: calendarOutline,
        alt: "Calendar",
    },
    list: {
        selectedIcon: listFilled,
        unselectedIcon: listOutline,
        alt: "List view",
    },
    account: {
        selectedIcon: accountFilled,
        unselectedIcon: accountOutline,
        alt: "Account",
    },
};

const recipientMenuConfig: MenuConfig = {
    caregivers: {
        selectedIcon: caregiverFilled,
        unselectedIcon: caregiverOutline,
        alt: "Caregivers",
    },
    recipients: {
        selectedIcon: recipientFilled,
        unselectedIcon: recipientOutline,
        alt: "Recipients",
    },
    account: {
        selectedIcon: accountFilled,
        unselectedIcon: accountOutline,
        alt: "Account",
    },
};

export const CaregiverMenu: Story = {
    args: {
        config: caregiverMenuConfig,
    },
};

export const AdminMenu: Story = {
    args: {
        config: recipientMenuConfig,
    },
};
