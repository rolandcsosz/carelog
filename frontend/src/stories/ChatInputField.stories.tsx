import type { Meta, StoryObj } from "@storybook/react";
import { fn } from "@storybook/test";
import { useState } from "react";
import ChatInputField from "../components/ChatInputField";

const meta = {
    component: ChatInputField,
    args: {
        onChange: fn(),
        onSend: fn(),
    },
} satisfies Meta<typeof ChatInputField>;

export default meta;

type Story = StoryObj<typeof meta>;

const InteractiveChatInputField = (args: React.ComponentProps<typeof ChatInputField>) => {
    const [value, setValue] = useState(args.value || "");

    const handleChange = (newValue: string) => {
        setValue(newValue);
        args.onChange(newValue);
    };

    const handleSend = () => {
        args.onSend();
        setValue("");
    };

    return (
        <div style={{ width: "500px", padding: "20px" }}>
            <ChatInputField {...args} value={value} onChange={handleChange} onSend={handleSend} />
        </div>
    );
};

export const Default: Story = {
    render: (args) => <InteractiveChatInputField {...args} />,
    args: {
        value: "Hello, this is a test message",
        placeholder: "Type your message...",
    },
};

export const LongText: Story = {
    render: (args) => <InteractiveChatInputField {...args} />,
    args: {
        value: "This is a very long message that should make the textarea grow and eventually become scrollable when it exceeds the maximum height limit. Let's add more text to demonstrate the scrolling behavior. This is a very long message that should make the textarea grow and eventually become scrollable when it exceeds the maximum height limit. Let's add more text to demonstrate the scrolling behavior. This is a very long message that should make the textarea grow and eventually become scrollable when it exceeds the maximum height limit. Let's add more text to demonstrate the scrolling behavior. This is a very long message that should make the textarea grow and eventually become scrollable when it exceeds the maximum height limit. Let's add more text to demonstrate the scrolling behavior.",
        placeholder: "Type your message...",
    },
};

export const Disabled: Story = {
    render: (args) => <InteractiveChatInputField {...args} />,
    args: {
        value: "This input is disabled",
        placeholder: "Type your message...",
        disabled: true,
    },
};
