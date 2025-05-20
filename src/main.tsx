import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { OpenAPI } from "../api/core/OpenAPI";
import { env } from "./env";
import { RecoilRoot } from "recoil";

OpenAPI.BASE = env.BACKEND_URL;

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <RecoilRoot>
            <QueryClientProvider client={new QueryClient()}>
                <App />
            </QueryClientProvider>
        </RecoilRoot>
    </StrictMode>,
);
