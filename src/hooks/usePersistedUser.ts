import { useCallback } from "react";
import { useSetRecoilState } from "recoil";
import { userState } from "../model";
import { OpenAPI } from "../../api/core/OpenAPI";

const usePersistedUser = () => {
    const setUser = useSetRecoilState(userState);

    const restoreUser = useCallback(() => {
        const stored = localStorage.getItem("user");
        if (!stored) {
            return;
        }

        try {
            const parsed: User = JSON.parse(stored);
            if (!parsed?.token) {
                console.warn("Stored user is missing token, clearing");
                localStorage.removeItem("user");
                return;
            }

            OpenAPI.TOKEN = parsed.token;
            setUser(parsed);
        } catch (err) {
            console.warn("Failed to parse stored user:", err);
            localStorage.removeItem("user");
        }
    }, [setUser]);

    const storeUser = useCallback(
        (user: User) => {
            localStorage.setItem("user", JSON.stringify(user));
        },
        [setUser],
    );

    const clearUser = useCallback(() => {
        localStorage.removeItem("user");
    }, [setUser]);

    return { restoreUser, storeUser, clearUser };
};

export default usePersistedUser;
