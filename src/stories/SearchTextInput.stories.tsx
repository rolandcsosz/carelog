import type { Meta, StoryObj } from "@storybook/react";

import SearchTextInput from "../components/SearchTextInput";

const meta = {
    component: SearchTextInput,
} satisfies Meta<typeof SearchTextInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        text: "text",
        placeholder: "Search...",
        onChange: () => {},
    },
};
