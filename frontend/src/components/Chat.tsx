import React, { useEffect, useRef } from "react";
import styles from "./Chat.module.scss";

export interface Message {
    id: string;
    senderId: string;
    senderName: string;
    content: string;
    time: Date;
}

interface ChatProps {
    messages: Message[];
    currentUserId: string;
    emptyStateMessage?: string;
}

const Chat: React.FC<ChatProps> = ({ messages, currentUserId, emptyStateMessage = "No messages to display." }) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const formatTimestamp = (time: Date) => {
        const now = new Date();
        const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
        const messageDate = new Date(time.getFullYear(), time.getMonth(), time.getDate());

        const hours = time.getHours().toString().padStart(2, "0");
        const minutes = time.getMinutes().toString().padStart(2, "0");

        if (messageDate.getTime() === today.getTime()) {
            return `${hours}:${minutes}`;
        } else {
            const month = (time.getMonth() + 1).toString().padStart(2, "0");
            const day = time.getDate().toString().padStart(2, "0");
            return `${month}/${day} ${hours}:${minutes}`;
        }
    };

    const isCurrentUser = (senderId: string) => {
        return senderId === currentUserId;
    };

    const isSameDay = (timestamp1: Date, timestamp2: Date): boolean => {
        const day1 = new Date(timestamp1.getFullYear(), timestamp1.getMonth(), timestamp1.getDate());
        const day2 = new Date(timestamp2.getFullYear(), timestamp2.getMonth(), timestamp2.getDate());
        return day1.getTime() === day2.getTime();
    };

    if (messages.length === 0) {
        return (
            <div className={styles.container} ref={containerRef}>
                <div className={styles.emptyState}>{emptyStateMessage}</div>
                <div ref={messagesEndRef} />
            </div>
        );
    }

    const getMessageClasses = (index: number, senderId: string, time: Date) => {
        const isCurrent = isCurrentUser(senderId);
        const baseClass = isCurrent ? styles.currentUser : styles.otherUser;
        const classes = [styles.messageWrapper, baseClass];

        const prevMessage = index > 0 ? messages[index - 1] : null;
        const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;

        const hasPrevSameUser = prevMessage?.senderId === senderId;
        const hasNextSameUser = nextMessage?.senderId === senderId;
        const hasPrevDifferentDay = prevMessage && !isSameDay(prevMessage.time, time);

        if (hasPrevDifferentDay) {
            classes.push(styles.differentDay);
        }

        if (isCurrent) {
            if (hasPrevSameUser) {
                classes.push(styles.consecutiveTop);
            }
            if (hasNextSameUser) {
                classes.push(styles.consecutiveBottom);
            }
            if (!hasPrevSameUser && !hasNextSameUser) {
                classes.push(styles.standalone);
            }
        } else {
            if (hasPrevSameUser) {
                classes.push(styles.consecutiveTop);
            }
            if (hasNextSameUser) {
                classes.push(styles.consecutiveBottom);
            }
            if (!hasPrevSameUser && !hasNextSameUser) {
                classes.push(styles.standalone);
            }
        }

        return classes.join(" ");
    };

    return (
        <div className={styles.container} ref={containerRef}>
            <div className={styles.messagesList}>
                {messages.map((message, index) => {
                    const isCurrent = isCurrentUser(message.senderId);
                    const messageClasses = getMessageClasses(index, message.senderId, message.time);
                    return (
                        <div key={message.id} className={messageClasses}>
                            <div className={styles.messageBubble}>
                                {!isCurrent && <div className={styles.senderName}>{message.senderName}</div>}
                                <div className={styles.messageText}>{message.content}</div>
                                <div className={styles.time}>{formatTimestamp(message.time)}</div>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>
        </div>
    );
};

export default Chat;
