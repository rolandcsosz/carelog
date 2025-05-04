import { useCallback } from "react";
import type { CancelablePromise } from "../../api/core/CancelablePromise";
import { useAuth } from "./useAuth";

export function useApi() {
    const { logout } = useAuth();

    const request = useCallback(
        async <P, R>(apiCall: (params: P) => CancelablePromise<R>, params: P): Promise<R | null> => {
            try {
                const response = await apiCall(params);
                if (!response) {
                    console.error("API Error: No response received for request:", apiCall.name);
                    return null;
                }
                return response;
            } catch (error: any) {
                if (error.status) {
                    console.error(`API Error: ${error.status} - ${error.message}`);
                    if (error.status === 401) {
                        logout();
                    }
                }
                return null;
            }
        },
        [logout],
    );

    return { request };
}
