import type { Meta, StoryObj } from "@storybook/react";

import Popup from "../components/Popup";

const meta = {
    component: Popup,
} satisfies Meta<typeof Popup>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        cancelButtonText: "Cancel",
        confirmButtonText: "Hozzáad",
        onClose: () => {},
        onConfirm: () => {},
        onCancel: () => {},
        confirmOnly: true,
        title: "Új gondozó hozzáadása ",
        children: <div>Popup Content</div>,
    },
};
