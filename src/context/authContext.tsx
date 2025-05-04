import { createContext, useState, useEffect } from "react";
import { OpenAPI } from "../../api/core/OpenAPI";

// Define the shape of the authentication state
interface AuthState {
    user: User | null;
    isAuthenticated: boolean;
}

// Define the shape of the authentication context
interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (user: User) => void;
    logout: () => void;
}

// Create a context for authentication
export const AuthContext = createContext<AuthContextType | undefined>(undefined);

// AuthProvider component that will wrap the app to provide auth context
export const AuthProvider = ({ children }: { children: any }) => {
    // Initialize the authentication state
    const [authState, setAuthState] = useState<AuthState>({
        user: null,
        isAuthenticated: false,
    });

    useEffect(() => {
        // Check if there is a user in local storage
        const userFromLocalStorage = JSON.parse(localStorage.getItem("user") || "null");
        if (userFromLocalStorage) {
            // If a user is found, update the authentication state
            setAuthState({
                user: userFromLocalStorage,
                isAuthenticated: true,
            });

            OpenAPI.TOKEN = userFromLocalStorage.token;
        } else {
            // If no user is found, set isAuthenticated to false
            setAuthState({
                ...authState,
                isAuthenticated: false,
            });
        }
    }, []);

    // Function to log in a user
    const login = (user: User) => {
        setAuthState({
            user,
            isAuthenticated: true,
        });
        OpenAPI.TOKEN = user.token;
        localStorage.setItem("user", JSON.stringify(user));
    };

    // Function to log out a user
    const logout = () => {
        setAuthState({
            user: null,
            isAuthenticated: false,
        });
        localStorage.removeItem("user");
        OpenAPI.TOKEN = "";
    };

    return (
        <AuthContext.Provider
            value={{ user: authState.user, isAuthenticated: authState.isAuthenticated, login, logout }}
        >
            {children}
        </AuthContext.Provider>
    );
};
