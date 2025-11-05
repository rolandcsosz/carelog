import { StrictMode, useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OpenAPI } from "../api/core/OpenAPI";
import { env } from "./env";
import { RecoilRoot } from "recoil";
import { ChatProvider } from "./contex/ChatContex.tsx";

OpenAPI.BASE = env.BACKEND_URL;

const RootWithRecoil: React.FC = () => {
    const [recoilKey, setRecoilKey] = useState(0);
    const resetRecoil = () => setRecoilKey((prev) => prev + 1);
    const queryClient = useMemo(() => new QueryClient(), []);

    return (
        <QueryClientProvider client={queryClient}>
            <RecoilRoot key={recoilKey}>
                <ChatProvider>
                    <App onLogedOut={resetRecoil} />
                </ChatProvider>
            </RecoilRoot>
        </QueryClientProvider>
    );
};

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RootWithRecoil />
    </StrictMode>,
);
