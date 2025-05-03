import { AuthContext } from "../context/authContext";
import { useContext } from "react";

export const useApiClient = () => {
    const authContext = useContext(AuthContext);

    if (!authContext) {
        throw new Error("AuthContext is undefined. Ensure the provider is set up correctly.");
    }

    const { authState, logout } = authContext;

    const fetchWithAuth = async (url: string, method: string, body?: string) => {
        if (!authState.user) {
            return null;
        }

        const headers = {
            "Content-Type": "application/json",
            Authorization: `Bearer ${authState.user?.token}`,
        };

        const options: RequestInit = { method, headers };

        if (method !== "GET" && body) {
            options.body = body;
        }

        let response = await fetch(url, options);

        if (response.status === 401) {
            logout();
            return null;
        }

        if (response.status !== 200) {
            return null;
        }

        return response;
    };

    return { fetchWithAuth, user: authState.user };
};
