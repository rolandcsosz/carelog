import type { Meta, StoryObj } from "@storybook/react";
import Chat, { Message } from "../components/Chat";

const meta = {
    component: Chat,
} satisfies Meta<typeof Chat>;

export default meta;

type Story = StoryObj<typeof meta>;

const generateSampleMessages = (count: number): Message[] => {
    const now = new Date();
    const messages: Message[] = [];
    const currentUserId = "user1";
    const otherUserId = "user2";

    for (let i = 0; i < count; i++) {
        const time = new Date(now.getTime() - (count - i) * 60000); // 1 minute apart
        messages.push({
            id: `msg-${i}-other`,
            senderId: otherUserId,
            senderName: "John Doe",
            content: `This is message ${i + 1} from the other user.`,
            time,
        });

        if (i < count - 1) {
            const replyTimestamp = new Date(time.getTime() + 30000); // 30 seconds later
            messages.push({
                id: `msg-${i}-current`,
                senderId: currentUserId,
                senderName: "Jane Smith",
                content: `This is my reply ${i + 1}.`,
                time: replyTimestamp,
            });
        }
    }

    return messages.sort((a, b) => {
        const timeA = typeof a.time === "string" ? new Date(a.time).getTime() : a.time.getTime();
        const timeB = typeof b.time === "string" ? new Date(b.time).getTime() : b.time.getTime();
        return timeA - timeB;
    });
};

const fewMessages: Message[] = [
    {
        id: "1",
        senderId: "user2",
        senderName: "John Doe",
        content: "Hello! How are you doing today?",
        time: new Date(Date.now() - 3600000),
    },
    {
        id: "2",
        senderId: "user1",
        senderName: "Jane Smith",
        content: "Hi! I'm doing great, thanks for asking!",
        time: new Date(Date.now() - 3300000),
    },
    {
        id: "3",
        senderId: "user2",
        senderName: "John Doe",
        content: "That's wonderful to hear. Would you like to meet up this weekend?",
        time: new Date(Date.now() - 3000000),
    },
    {
        id: "4",
        senderId: "user1",
        senderName: "Jane Smith",
        content: "Sure, that sounds great! What time works for you?",
        time: new Date(Date.now() - 2700000),
    },
];

const longMessages: Message[] = generateSampleMessages(20);

const messagesWithLongText: Message[] = [
    {
        id: "1",
        senderId: "user2",
        senderName: "John Doe",
        content:
            "This is a very long message that should wrap properly within the message bubble. It contains multiple sentences to test how the component handles longer text content. The text should automatically wrap and not overflow the container boundaries.",
        time: new Date(Date.now() - 3600000),
    },
    {
        id: "2",
        senderId: "user1",
        senderName: "Jane Smith",
        content:
            "I agree! The component should handle all kinds of text lengths gracefully, including short messages, medium messages, and very long messages with multiple paragraphs.",
        time: new Date(Date.now() - 3300000),
    },
    {
        id: "3",
        senderId: "user2",
        senderName: "John Doe",
        content: "Short reply.",
        time: new Date(Date.now() - 3000000),
    },
];

const messagesWithDifferentDates: Message[] = [
    {
        id: "1",
        senderId: "user2",
        senderName: "John Doe",
        content: "This message is from yesterday",
        time: new Date(Date.now() - 86400000), // Yesterday
    },
    {
        id: "2",
        senderId: "user1",
        senderName: "Jane Smith",
        content: "This is a reply from yesterday",
        time: new Date(Date.now() - 82800000), // Yesterday, 10 hours ago
    },
    {
        id: "3",
        senderId: "user2",
        senderName: "John Doe",
        content: "This message is from today",
        time: new Date(Date.now() - 3600000), // 1 hour ago
    },
    {
        id: "4",
        senderId: "user1",
        senderName: "Jane Smith",
        content: "This is a recent message",
        time: new Date(Date.now() - 300000), // 5 minutes ago
    },
];

export const EmptyState: Story = {
    render: (args) => <Chat {...args} />,
    args: {
        messages: [],
        currentUserId: "user1",
        emptyStateMessage: "No messages yet. Start the conversation!",
    },
};

export const FewMessages: Story = {
    render: (args) => <Chat {...args} />,
    args: {
        messages: fewMessages,
        currentUserId: "user1",
    },
};

export const ManyMessages: Story = {
    render: (args) => <Chat {...args} />,
    args: {
        messages: longMessages,
        currentUserId: "user1",
    },
};

export const LongTextMessages: Story = {
    render: (args) => <Chat {...args} />,
    args: {
        messages: messagesWithLongText,
        currentUserId: "user1",
    },
};

export const DifferentDates: Story = {
    render: (args) => <Chat {...args} />,
    args: {
        messages: messagesWithDifferentDates,
        currentUserId: "user1",
    },
};

export const FullHeight: Story = {
    render: (args) => <Chat {...args} />,
    args: {
        messages: longMessages,
        currentUserId: "user1",
    },
};
