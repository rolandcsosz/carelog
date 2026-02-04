import type { Meta, StoryObj } from "@storybook/react";
import Chat from "../components/Chat";
import { Message } from "../../api/types.gen";

const meta = {
    component: Chat,
} satisfies Meta<typeof Chat>;

export default meta;

type Story = StoryObj<typeof meta>;

const generateSampleMessages = (count: number): Message[] => {
    const now = new Date();
    const messages: Message[] = [];
    const userId = "user-123";

    for (let i = 0; i < count; i++) {
        const time = new Date(now.getTime() - (count - i) * 60000);
        const isUser = i % 2 !== 0;

        messages.push({
            id: `msg-${i}`,
            senderRole: isUser ? "user" : "caregiver",
            status: "read",
            content: isUser ? `This is my reply ${i + 1}.` : `This is message ${i + 1} from the other user.`,
            time: time.toISOString(),
            userId: userId,
        });
    }

    return messages;
};

const fewMessages: Message[] = [
    {
        id: "1",
        senderRole: "caregiver",
        status: "read",
        content: "Hello! How are you doing today?",
        time: new Date(Date.now() - 3600000).toISOString(),
        userId: "user-123",
    },
    {
        id: "2",
        senderRole: "user",
        status: "read",
        content: "Hi! I'm doing great, thanks for asking!",
        time: new Date(Date.now() - 3300000).toISOString(),
        userId: "user-123",
    },
    {
        id: "3",
        senderRole: "caregiver",
        status: "read",
        content: "That's wonderful to hear. Would you like to meet up this weekend?",
        time: new Date(Date.now() - 3000000).toISOString(),
        userId: "user-123",
    },
    {
        id: "4",
        senderRole: "user",
        status: "read",
        content: "Sure, that sounds great! What time works for you?",
        time: new Date(Date.now() - 2700000).toISOString(),
        userId: "user-123",
    },
];

const longMessages: Message[] = generateSampleMessages(20);

const messagesWithLongText: Message[] = [
    {
        id: "1",
        senderRole: "caregiver",
        status: "read",
        content:
            "This is a very long message that should wrap properly within the message bubble. It contains multiple sentences to test how the component handles longer text content. The text should automatically wrap and not overflow the container boundaries.",
        time: new Date(Date.now() - 3600000).toISOString(),
        userId: "user-123",
    },
    {
        id: "2",
        senderRole: "user",
        status: "read",
        content:
            "I agree! The component should handle all kinds of text lengths gracefully, including short messages, medium messages, and very long messages with multiple paragraphs.",
        time: new Date(Date.now() - 3300000).toISOString(),
        userId: "user-123",
    },
    {
        id: "3",
        senderRole: "caregiver",
        status: "read",
        content: "Short reply.",
        time: new Date(Date.now() - 3000000).toISOString(),
        userId: "user-123",
    },
];

const messagesWithDifferentDates: Message[] = [
    {
        id: "1",
        senderRole: "caregiver",
        status: "read",
        content: "This message is from yesterday",
        time: new Date(Date.now() - 86400000).toISOString(), // Yesterday
        userId: "user-123",
    },
    {
        id: "2",
        senderRole: "user",
        status: "read",
        content: "This is a reply from yesterday",
        time: new Date(Date.now() - 82800000).toISOString(), // Yesterday, 10 hours ago
        userId: "user-123",
    },
    {
        id: "3",
        senderRole: "caregiver",
        status: "read",
        content: "This message is from today",
        time: new Date(Date.now() - 3600000).toISOString(), // 1 hour ago
        userId: "user-123",
    },
    {
        id: "4",
        senderRole: "user",
        status: "read",
        content: "This is a recent message",
        time: new Date(Date.now() - 300000).toISOString(), // 5 minutes ago
        userId: "user-123",
    },
];

export const EmptyState: Story = {
    render: (args) => <Chat {...args} />,
    args: {
        messages: [],
        pendingMessage: null,
        emptyStateMessage: "No messages yet. Start the conversation!",
    },
};

export const FewMessages: Story = {
    render: (args) => <Chat {...args} />,
    args: {
        messages: fewMessages,
        pendingMessage: null,
    },
};

export const ManyMessages: Story = {
    render: (args) => <Chat {...args} />,
    args: {
        messages: longMessages,
        pendingMessage: null,
    },
};

export const LongTextMessages: Story = {
    render: (args) => <Chat {...args} />,
    args: {
        messages: messagesWithLongText,
        pendingMessage: null,
    },
};

export const DifferentDates: Story = {
    render: (args) => <Chat {...args} />,
    args: {
        messages: messagesWithDifferentDates,
        pendingMessage: null,
    },
};

export const FullHeight: Story = {
    render: (args) => <Chat {...args} />,
    args: {
        messages: longMessages,
        pendingMessage: null,
    },
};

export const WithPendingMessage: Story = {
    render: (args) => <Chat {...args} />,
    args: {
        messages: fewMessages,
        pendingMessage: {
            id: "pending-1",
            senderRole: "user",
            status: "sending",
            content: "I am sending this right now...",
            time: new Date().toISOString(),
            userId: "user-123",
        },
    },
};
