import type { Meta, StoryObj } from "@storybook/react";
import { AudioRecorderForm } from "../components/AudioRecorderForm";
import { fn } from "@storybook/test";

const meta = {
    component: AudioRecorderForm,
} satisfies Meta<typeof AudioRecorderForm>;

export default meta;

type Story = StoryObj<typeof meta>;

export const Default: Story = {
    args: {
        onRecordingComplete: fn(),
    },
};
