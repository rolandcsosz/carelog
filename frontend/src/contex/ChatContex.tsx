// context/ChatContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useApi } from "../hooks/useApi";
import { getChatHistory } from "../../api/sdk.gen";
import { GetChatHistoryData, Message, SendMessageData, SendMessageResponse } from "../../api/types.gen";
import { useCaregiverModel } from "../hooks/useCaregiverModel";
import { fetchData, getDefaultErrorModal, RequestFnType } from "../utils";
import { sendMessage } from "../../api/sdk.gen";
import usePopup from "../hooks/usePopup";

type ChatContextType = {
    chats: Message[];
    fetchNextOlderPage: () => Promise<void>;
    fetchLatestChats: () => Promise<void>;
    newMessage: (msg: string) => Promise<void>;
};

const ChatContext = createContext<ChatContextType | null>(null);

const pageSize = 20;

const fetchMessages = (request: RequestFnType, data: GetChatHistoryData) =>
    fetchData(request, getChatHistory, data, [] as Message[]);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [oldestMessageDate, setOldestMessageDate] = useState<string | null>(null);
    const [cursor, setCursor] = useState<string | null>(null);
    const [oldChats, setOldChats] = useState<Message[]>([]);
    const [newChats, setNewChats] = useState<Message[]>([]);
    const { request } = useApi();
    const { user } = useCaregiverModel();
    const initHappenedRef = React.useRef(false);
    const { openPopup } = usePopup();

    useEffect(() => {
        const fetchInitialMessages = async () => {
            if (!user.list?.id || initHappenedRef.current) {
                return;
            }

            const last20NewestMessages = await fetchMessages(request, {
                caregiverId: user.list.id,
                limit: pageSize,
            });

            if (last20NewestMessages.length === 0) {
                return;
            }

            setCursor(last20NewestMessages[0].time);
            setOldestMessageDate(last20NewestMessages[last20NewestMessages.length - 1].time);

            setOldChats(last20NewestMessages);

            initHappenedRef.current = true;
        };

        fetchInitialMessages();
    }, [user.list?.id, request]);

    const fetchNextOlderPage = useCallback(async () => {
        if (!user.list?.id) {
            return;
        }

        const next20NewestMessages = await fetchMessages(request, {
            caregiverId: user.list.id,
            limit: pageSize,
            before: oldestMessageDate || undefined,
        });

        if (next20NewestMessages.length === 0) {
            return;
        }

        setOldestMessageDate(next20NewestMessages[next20NewestMessages.length - 1].time);

        setOldChats((prev) => [...next20NewestMessages, ...prev]);
    }, [oldestMessageDate, request, user.list?.id]);

    const fetchLatestChats = useCallback(async () => {
        console.log("Fetching latest chats...");
        if (!user.list?.id) {
            return;
        }

        const newestMessages = await fetchMessages(request, {
            caregiverId: user.list.id,
            after: cursor || undefined,
        });

        if (newestMessages.length === 0) {
            return;
        }

        const itemsToInsert = newestMessages.filter(
            (msg) => !newChats.some((existingMsg) => existingMsg.id === msg.id && existingMsg.status === msg.status),
        );

        if (itemsToInsert.length === 0) {
            return;
        }

        const updatedItems = newChats.map((existingMsg) => {
            const updatedMsg = newestMessages.find((msg) => msg.id === existingMsg.id);
            return updatedMsg ? updatedMsg : existingMsg;
        });

        setNewChats(updatedItems);
    }, [cursor, newChats, request, user.list?.id]);

    const newMessage = useCallback(
        async (msg: string) => {
            if (!user.list?.id) {
                return;
            }

            const response = await request<SendMessageData, SendMessageResponse>(sendMessage, {
                requestBody: { caregiverId: user.list.id, content: msg.trim() },
            });

            if (!response || !response.ok || !response.data) {
                openPopup(getDefaultErrorModal("Hiba", "Hiba történt az üzenet küldése során.", () => {}));
                return;
            }

            const message = response.data as Message;

            if (!newChats.some((existingMsg) => existingMsg.id === message.id)) {
                setNewChats((prev) => [...prev, message]);
            }
        },
        [newChats, openPopup, request, user.list?.id],
    );

    const value: ChatContextType = {
        chats: [...oldChats, ...newChats].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()),
        fetchNextOlderPage,
        fetchLatestChats,
        newMessage,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
    const ctx = useContext(ChatContext);
    if (!ctx) throw new Error("useChat must be used within a ChatProvider");
    return ctx;
};
