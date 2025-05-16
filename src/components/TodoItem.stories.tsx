import type { Meta, StoryObj } from "@storybook/react";

import TodoItem from "./TodoItem";

const meta = {
    component: TodoItem,
} satisfies Meta<typeof TodoItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        name: "name",
        selectedItem: "selectedItem",
        options: [],
        index: 0,
        onSelectedChanged: () => {},
    },
};
