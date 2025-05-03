import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { PopupProvider } from "./context/popupContext";
import { NavigationProvider } from "./context/navigationContext";
import { ScrollProvider } from "./context/scrollContext.tsx";
import { AuthProvider } from "./context/authContext.tsx";

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <AuthProvider>
            <NavigationProvider>
                <PopupProvider>
                    <ScrollProvider>
                        <App />
                    </ScrollProvider>
                </PopupProvider>
            </NavigationProvider>
        </AuthProvider>
    </StrictMode>,
);
