import React, { useEffect, useState } from "react";
import styles from "./ChatPage.module.scss";
import Chat from "../../components/Chat";
import { useCaregiverModel } from "../../hooks/useCaregiverModel";
import ChatInputField from "../../components/ChatInputField";
import { useChat } from "../../contex/ChatContex";

const ChatPage: React.FC = () => {
    const { user } = useCaregiverModel();
    const currentUserId = user?.list?.id || "";
    const [inputValue, setInputValue] = useState("");
    const { chats, fetchNextOlderPage, fetchLatestChats, newMessage, connected, pendingMessage } = useChat();

    useEffect(() => {
        fetchLatestChats();
    }, [fetchLatestChats]);

    const handleSend = async () => {
        if (!inputValue.trim() || !currentUserId) return;

        await newMessage(inputValue.trim());
        setInputValue("");
    };

    return (
        <div className={styles.page}>
            <div className={`${styles.backRow} ${styles.sticky}`}>
                <div className={styles.pageTitle}>Tanácsadás</div>
                {!connected && <div className={styles.error}>Hiba történt a kapcsolat során.</div>}
            </div>
            <div className={styles.chatContainer}>
                <Chat messages={chats} onLoadMore={fetchNextOlderPage} pendingMessage={pendingMessage} />
            </div>
            <div className={styles.inputContainer}>
                <ChatInputField
                    value={inputValue}
                    onChange={setInputValue}
                    onSend={handleSend}
                    placeholder="Type your message..."
                    disabled={!currentUserId || !connected || !!pendingMessage}
                />
            </div>
        </div>
    );
};

export default ChatPage;
