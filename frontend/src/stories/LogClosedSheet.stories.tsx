import type { Meta, StoryObj } from "@storybook/react";

import LogClosedSheet from "../components/LogClosedSheet";

const meta = {
    component: LogClosedSheet,
} satisfies Meta<typeof LogClosedSheet>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        name: "name",
        date: "date",
    },
};
