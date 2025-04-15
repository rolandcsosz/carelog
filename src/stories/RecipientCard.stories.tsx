import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import RecipientCard from "../components/RecipientCard";

const meta = {
    component: RecipientCard,
} satisfies Meta<typeof RecipientCard>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        userName: "Nagy Mária",
        address: "Budapest, 1111 Csorba Hosszú utca 23. 3/12A",
        type: "done",
        onOpen: fn(),
        onNewLog: fn(),
    },
};
