import { useRecoilState } from "recoil";
import { logoutCallbackState, userState } from "../model";
import { OpenAPI } from "../../api/core/OpenAPI";
import usePersistedUser from "./usePersistedUser";
import { User } from "../types";

export function useAuth() {
    const { storeUser, clearUser } = usePersistedUser();
    const [user, setUser] = useRecoilState(userState);
    const [callbacks, setCallbacks] = useRecoilState(logoutCallbackState);

    const subscribe = (callback: () => void) => {
        if (callbacks.has(callback)) {
        } else {
            setCallbacks((prev) => new Set(prev).add(callback));
        }

        return () => {
            if (callbacks.has(callback)) {
                setCallbacks((prev) => {
                    const newSet = new Set(prev);
                    newSet.delete(callback);
                    return newSet;
                });
            }
        };
    };

    const login = (newUser: User) => {
        OpenAPI.TOKEN = newUser.token;
        setUser(newUser);
        storeUser(newUser);
    };

    const logout = () => {
        OpenAPI.TOKEN = "";
        setUser(null);
        clearUser();
        callbacks.forEach((callback) => callback());
        setCallbacks(new Set());
    };

    const isAuthenticated = user !== null;

    return { user, isAuthenticated, login, logout, subscribeForLogout: subscribe };
}
