// context/ChatContext.tsx
import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { useApi } from "../hooks/useApi";
import { getChatHistory } from "../../api/sdk.gen";
import { GetChatHistoryData, Message, SendMessageData, SendMessageResponse } from "../../api/types.gen";
import { useCaregiverModel } from "../hooks/useCaregiverModel";
import { fetchData, getDefaultErrorModal, RequestFnType } from "../utils";
import { sendMessage } from "../../api/sdk.gen";
import usePopup from "../hooks/usePopup";
import { env } from "../env";
import { userState } from "../model";
import { useRecoilValue } from "recoil";

type ChatContextType = {
    chats: Message[];
    fetchNextOlderPage: () => Promise<void>;
    fetchLatestChats: () => Promise<void>;
    newMessage: (msg: string) => Promise<void>;
    connected: boolean;
    pendingMessage: Message | null;
};

type WebSocketData = {
    type: "token" | "error" | "completion" | "history";
    token: string;
};

const ChatContext = createContext<ChatContextType | null>(null);

const pageSize = 20;
const baseUrl = env.BACKEND_URL || "http://localhost:8080";

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
    const [connected, setConnected] = useState(false);
    const logedInUser = useRecoilValue(userState);
    const [pendingMessage, setPendingMessage] = useState<Message | null>(null);

    useEffect(() => {
        const fetchInitialMessages = async () => {
            if (!user.list?.id || initHappenedRef.current || oldChats.length > 0) {
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

    const fetchLatestChats = useCallback(async () => {
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

        const itemsToUpdate = newestMessages.filter(
            (msg) => !newChats.some((existingMsg) => existingMsg.id === msg.id && existingMsg.status === msg.status),
        );

        const itemsToInsert = itemsToUpdate.filter((msg) => !newChats.some((existingMsg) => existingMsg.id === msg.id));

        if (itemsToInsert.length === 0 && itemsToUpdate.length === 0) {
            return;
        }

        const updatedItems = newChats.map((existingMsg) => {
            const updatedMsg = newestMessages.find((msg) => msg.id === existingMsg.id);
            return updatedMsg ? updatedMsg : existingMsg;
        });

        setNewChats([...updatedItems, ...itemsToInsert]);
    }, [cursor, newChats, request, user.list?.id]);

    const handleWebSocketMessage = useCallback(
        (event: MessageEvent) => {
            try {
                console.log("WebSocket message received:", event.data);
                const message: WebSocketData = JSON.parse(event.data);
                console.log("WebSocket message received:", message);

                if (message.type === "error" || message.type === "completion") {
                    fetchLatestChats();
                    setPendingMessage(null);
                    return;
                }

                if (message.type === "token") {
                    setPendingMessage((prev) => {
                        if (prev === null) {
                            return {
                                id: Date.now().toString(),
                                senderRole: "bot",
                                status: "processing",
                                content: message.token,
                                time: new Date().toISOString(),
                                userId: user.list?.id || "",
                            };
                        } else {
                            return {
                                ...prev,
                                content: prev.content === "..." ? message.token : prev.content + message.token,
                                time: new Date().toISOString(),
                            };
                        }
                    });
                }

                if (message.type === "history") {
                    setPendingMessage({
                        id: Date.now().toString(),
                        senderRole: "bot",
                        status: "processing",
                        content: message.token,
                        time: new Date().toISOString(),
                        userId: user.list?.id || "",
                    });
                    return;
                }
            } catch (err) {
                console.error("Invalid message:", event.data);
            }
        },
        [fetchLatestChats, user.list?.id, pendingMessage],
    );

    useEffect(() => {
        if (!logedInUser?.token) return;

        let ws: WebSocket | null = null;
        let reconnectTimeout: NodeJS.Timeout;

        const connect = () => {
            ws = new WebSocket(`${baseUrl.replace("http://", "ws://")}?token=${logedInUser.token}`);

            ws.onopen = () => {
                console.log("WebSocket connected");
                setConnected(true);
            };

            ws.onmessage = (event) => {
                handleWebSocketMessage(event);
            };

            ws.onclose = () => {
                console.log("WebSocket closed");
                setConnected(false);
                reconnectTimeout = setTimeout(connect, 2000);
            };

            ws.onerror = (err) => {
                console.error("WebSocket error:", err);
                ws?.close();
            };
        };

        connect();

        return () => {
            if (ws) ws.close();
            if (reconnectTimeout) clearTimeout(reconnectTimeout);
        };
    }, [logedInUser?.token]);

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

        const messagesToAdd = next20NewestMessages.filter(
            (msg) => !oldChats.some((existingMsg) => existingMsg.id === msg.id),
        );

        if (messagesToAdd.length === 0) {
            return;
        }

        setOldestMessageDate(messagesToAdd[messagesToAdd.length - 1].time);

        setOldChats((prev) => [...messagesToAdd, ...prev]);
    }, [oldestMessageDate, request, user.list?.id]);

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

            setNewChats((prev) => [...prev, message]);

            if (!pendingMessage) {
                setPendingMessage({
                    id: Date.now().toString(),
                    senderRole: "bot",
                    status: "processing",
                    content: "...",
                    time: new Date().toISOString(),
                    userId: user.list?.id || "",
                });
                return;
            }
        },
        [newChats, openPopup, request, user.list?.id],
    );

    const value: ChatContextType = {
        chats: [...oldChats, ...newChats].sort((a, b) => new Date(a.time).getTime() - new Date(b.time).getTime()),
        fetchNextOlderPage,
        fetchLatestChats,
        newMessage,
        connected,
        pendingMessage: pendingMessage,
    };

    return <ChatContext.Provider value={value}>{children}</ChatContext.Provider>;
};

export const useChat = () => {
    const ctx = useContext(ChatContext);
    if (!ctx) throw new Error("useChat must be used within a ChatProvider");
    return ctx;
};
