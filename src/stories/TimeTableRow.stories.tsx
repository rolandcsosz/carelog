import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import TimeTableRow from "../components/TimeTableRow";

const meta = {
    component: TimeTableRow,
} satisfies Meta<typeof TimeTableRow>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        start: "09:00",
        end: "12:00",
        userName: "Nagy Mária",
        address: "Budapest, 1111 Csorba Hosszú utca 23. 3/12A",
        type: "done",
        onOpen: fn(),
        onNewLog: fn(),
    },
};
