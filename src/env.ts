interface AppConfig {
    BACKEND_URL: string;
}

declare global {
    interface Window {
        __APP_CONFIG__?: AppConfig;
    }
}

export const env: AppConfig = {
    BACKEND_URL:
        (
            typeof window.__APP_CONFIG__?.BACKEND_URL === "string" &&
            window.__APP_CONFIG__?.BACKEND_URL !== "__BACKEND_URL__"
        ) ?
            window.__APP_CONFIG__!.BACKEND_URL
        :   "http://localhost:8080",
};
