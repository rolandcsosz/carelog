import type { Meta, StoryObj } from "@storybook/react";
import React from "react";
import LogCard from "../components/LogCard";
import { fn } from "@storybook/test";
import { RecoilRoot, MutableSnapshot } from "recoil";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Subtask } from "../../api/types.gen";
import { userState } from "../model";

const mockSubTasks: Subtask[] = [
    {
        id: "1",
        title: "Bevásárlás",
        taskTypeId: "task-type-1",
    },
    {
        id: "2",
        title: "Gyógyszerek beadása",
        taskTypeId: "task-type-2",
    },
    {
        id: "3",
        title: "Napközbeni sétáltatás",
        taskTypeId: "task-type-3",
    },
    {
        id: "4",
        title: "Ebéd készítése",
        taskTypeId: "task-type-4",
    },
    {
        id: "5",
        title: "Orvosi vizsgálat",
        taskTypeId: "task-type-5",
    },
];

const mockUser = {
    id: "mock-user-1",
    role: "caregiver" as const,
    token: "mock-token",
};

const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            retry: false,
            refetchOnWindowFocus: false,
        },
    },
});

queryClient.setQueryData(["subTasks"], mockSubTasks);
queryClient.setQueryData(["taskTypes", mockUser.id], []);

const initializeState = ({ set }: MutableSnapshot) => {
    set(userState, mockUser);
};

const withProviders = (Story: React.ComponentType) => {
    return (
        <QueryClientProvider client={queryClient}>
            <RecoilRoot initializeState={initializeState}>
                <Story />
            </RecoilRoot>
        </QueryClientProvider>
    );
};

const meta = {
    component: LogCard,
    decorators: [withProviders],
} satisfies Meta<typeof LogCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        index: 0,
        task: {
            subTaskId: "1",
            startTime: "09:00",
            endTime: "10:00",
            done: false,
            note: "Laktozmentes tej vásárlása",
        },
        onChange: fn(),
        onDelete: fn(),
    },
};

export const CompletedTask: Story = {
    args: {
        index: 0,
        task: {
            subTaskId: "2",
            startTime: "08:00",
            endTime: "08:30",
            done: true,
            note: "Gyógyszerek beadása",
        },
        onChange: fn(),
        onDelete: fn(),
    },
};

export const DisabledTask: Story = {
    args: {
        index: 0,
        task: {
            subTaskId: "4",
            startTime: "12:00",
            endTime: "13:00",
            done: false,
            note: "Ebéd készítése",
        },
        onChange: fn(),
        onDelete: fn(),
        disabled: true,
    },
};
