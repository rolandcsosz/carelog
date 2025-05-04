import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { PopupProvider } from "./context/popupContext";
import { NavigationProvider } from "./context/navigationContext";
import { ScrollProvider } from "./context/scrollContext.tsx";
import { AuthProvider } from "./context/authContext.tsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AuthProvider>
            <NavigationProvider>
                <PopupProvider>
                    <ScrollProvider>
                        <QueryClientProvider client={new QueryClient()}>
                            <App />
                        </QueryClientProvider>
                    </ScrollProvider>
                </PopupProvider>
            </NavigationProvider>
        </AuthProvider>
    </StrictMode>,
);
