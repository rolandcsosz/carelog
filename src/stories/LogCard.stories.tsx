import type { Meta, StoryObj } from "@storybook/react";

import LogCard from "../components/LogCard";

const meta = {
    component: LogCard,
} satisfies Meta<typeof LogCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        index: 0,
        title: "Title",
        catregory: "Catregory",
        startTime: "startTime",
        endTime: "endTime",
        done: true,
    },
};
