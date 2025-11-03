import React, { useState } from "react";
import styles from "./ChatPage.module.scss";
import Chat, { Message } from "../../components/Chat";
import { useCaregiverModel } from "../../hooks/useCaregiverModel";
import ChatInputField from "../../components/ChatInputField";

const ChatPage: React.FC = () => {
    const { user } = useCaregiverModel();
    const currentUserId = user?.list?.id || "";
    const [messages, setMessages] = useState<Message[]>([]);
    const [inputValue, setInputValue] = useState("");

    const handleSend = () => {
        if (!inputValue.trim() || !currentUserId) return;

        const newMessage: Message = {
            id: `msg-${Date.now()}`,
            senderId: Math.random() < 0.5 ? currentUserId : "advisor",
            senderName: user?.list?.name || "You",
            content: inputValue.trim(),
            time: new Date(),
        };

        setMessages((prev) => [...prev, newMessage]);
        setInputValue("");
    };

    return (
        <div className={styles.page}>
            <div className={`${styles.backRow} ${styles.sticky}`}>
                <div className={styles.pageTitle}>Tanácsadás</div>
            </div>
            <div className={styles.chatContainer}>
                <Chat messages={messages} currentUserId={currentUserId} />
            </div>
            <div className={styles.inputContainer}>
                <ChatInputField
                    value={inputValue}
                    onChange={setInputValue}
                    onSend={handleSend}
                    placeholder="Type your message..."
                    disabled={!currentUserId}
                />
            </div>
        </div>
    );
};

export default ChatPage;
