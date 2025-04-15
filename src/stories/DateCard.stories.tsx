import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import DateCard from "../components/DateCard";

const meta = {
    component: DateCard,
} satisfies Meta<typeof DateCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        date: new Date("2025-03-01T00:00:00Z"),
        onClick: fn(),
    },
};
