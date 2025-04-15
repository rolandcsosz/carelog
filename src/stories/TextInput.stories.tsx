import type { Meta, StoryObj } from "@storybook/react";

import TextInput from "../components/TextInput";

const meta = {
    component: TextInput,
} satisfies Meta<typeof TextInput>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        text: "text",
        placeholder: "Enter text here",
        onChange: () => {},
        fillWidth: false,
    },
};
