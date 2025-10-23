import type { Meta, StoryObj } from "@storybook/react";

import Dropdown from "../components/Dropdown";

const meta = {
    component: Dropdown,
} satisfies Meta<typeof Dropdown>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        selected: "option2",
        options: ["option1", "option2", "option3"],
        onChange: () => {},
        fillWidth: false,
    },
};
