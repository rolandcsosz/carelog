import type { Meta, StoryObj } from "@storybook/react";
import homeFilled from "../assets/home-filled.svg";
import IconButton from "../components/IconButton";
import { fn } from "@storybook/test";

const meta = {
    component: IconButton,
} satisfies Meta<typeof IconButton>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        svgContent: homeFilled,
        ariaLabel: "ariaLabel",
        onClick: fn(),
    },
};
