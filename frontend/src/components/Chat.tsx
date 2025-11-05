import React, { useEffect, useRef } from "react";
import styles from "./Chat.module.scss";
import { Message } from "../../api/types.gen";
import errorMessageIcon from "../assets/error-message-icon.svg";
import { isSameDay } from "../utils";

interface ChatProps {
    messages: Message[];
    pendingMessage: Message | null;
    emptyStateMessage?: string;
    onLoadMore?: () => void;
}

const maxGapForFetching = 30;

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

const Chat: React.FC<ChatProps> = ({
    messages,
    pendingMessage,
    emptyStateMessage = "No messages to display.",
    onLoadMore = () => {},
}) => {
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const loadingMoreRef = useRef(false);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "instant" });
    };

    useEffect(() => {
        if (loadingMoreRef.current) {
            loadingMoreRef.current = false;
            return;
        }
        scrollToBottom();
    }, [messages]);

    useEffect(() => {
        const container = containerRef.current;
        if (!container || !onLoadMore) return;

        const handleScroll = () => {
            if (container.scrollTop <= maxGapForFetching) {
                loadingMoreRef.current = true;
                onLoadMore();
            }
        };

        container.addEventListener("scroll", handleScroll);
        return () => container.removeEventListener("scroll", handleScroll);
    }, [onLoadMore]);

    if (messages.length === 0) {
        return (
            <div className={styles.container} ref={containerRef}>
                <div className={styles.emptyState}>{emptyStateMessage}</div>
                <div ref={messagesEndRef} />
            </div>
        );
    }

    const getMessageClasses = (index: number, message: Message) => {
        const isCurrent = message.senderRole === "user";
        const baseClass = isCurrent ? styles.currentUser : styles.otherUser;
        const classes = [styles.messageWrapper, baseClass];

        const prevMessage = index > 0 ? messages[index - 1] : null;
        const nextMessage = index < messages.length - 1 ? messages[index + 1] : null;

        const hasPrevSameUser = prevMessage?.senderRole === message.senderRole;
        const hasNextSameUser = nextMessage?.senderRole === message.senderRole;
        const hasPrevDifferentDay = prevMessage && !isSameDay(new Date(prevMessage.time), new Date(message.time));

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
        <div className={styles.container}>
            <div className={styles.messagesList} ref={containerRef}>
                {(pendingMessage ? [...messages, pendingMessage] : messages).map((message, index) => {
                    const isCurrent = message.senderRole === "user";
                    const messageClasses = getMessageClasses(index, message);
                    return (
                        <div key={message.id} className={messageClasses}>
                            <div className={styles.messageBubble}>
                                {!isCurrent && <div className={styles.senderName}>Bot</div>}
                                <div className={styles.messageText}>{message.content}</div>
                                <div className={styles.time}>
                                    {message.status === "failed" && (
                                        <img src={errorMessageIcon} alt="Error" className={styles.errorIcon} />
                                    )}
                                    {formatTimestamp(new Date(message.time))}
                                </div>
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
