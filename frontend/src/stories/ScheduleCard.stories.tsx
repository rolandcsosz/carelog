import type { Meta, StoryObj } from "@storybook/react";

import ScheduleCard from "../components/ScheduleCard";

const meta = {
    component: ScheduleCard,
} satisfies Meta<typeof ScheduleCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        id: "1",
        title: "Gondozó",
        options: ["Option 1", "Option 2", "Option 3"],
        onChange: (value) => console.log(value),
        startTime: "08:50",
        endTime: "17:00",
        selectedOption: "Option 1",
    },
};
