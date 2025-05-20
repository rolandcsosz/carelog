import { useRecoilState, useRecoilValue, useSetRecoilState } from "recoil";
import { userState } from "../model";
import { OpenAPI } from "../../api/core/OpenAPI";
import usePersistedUser from "./usePersistedUser";

export function useAuth() {
    const { storeUser, clearUser } = usePersistedUser();
    const [user, setUser] = useRecoilState(userState);

    const login = (newUser: User) => {
        OpenAPI.TOKEN = newUser.token;
        setUser(newUser);
        storeUser(newUser);
    };

    const logout = () => {
        OpenAPI.TOKEN = "";
        setUser(null);
        clearUser();
    };

    const isAuthenticated = user !== null;

    return { user, isAuthenticated, login, logout };
}
