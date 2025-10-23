import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import ButtonGroup from "../components/ButtonGroup";

const meta = {
    component: ButtonGroup,
} satisfies Meta<typeof ButtonGroup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        menus: ["Data", "Settings", "Help"],
        onChange: fn(),
    },
};
