import type { Meta, StoryObj } from "@storybook/react";

import TodoItem from "../components/TodoItem";

const meta = {
    component: TodoItem,
} satisfies Meta<typeof TodoItem>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        selectedItem: "selectedItem",
        options: [],
        index: 0,
        onSelectedChanged: (selected: string) => {
            void selected;
        },
        onDelete: () => {},
    },
};
