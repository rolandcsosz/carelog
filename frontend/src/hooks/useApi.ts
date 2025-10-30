import { useCallback } from "react";
import type { CancelablePromise } from "../../api/core/CancelablePromise";
import { useAuth } from "./useAuth";
import { FetchResponse } from "../types";
import { ErrorResponse } from "../../api/types.gen";

export function useApi() {
    const { logout } = useAuth();

    const request = useCallback(
        async <P, R>(
            apiCall: (params: P) => CancelablePromise<R | ErrorResponse>,
            params: P,
        ): Promise<FetchResponse<R | null>> => {
            try {
                const response = await apiCall(params);

                if (!response || typeof response !== "object") {
                    return {
                        ok: false,
                        error:
                            !response ? "A szerver nem küldött választ." : "Hiba történt a kérés feldolgozása során.",
                        data: null,
                    };
                }

                if ("error" in response && response.error && typeof response.error === "string") {
                    return {
                        ok: false,
                        error: response.error,
                        data: null,
                    };
                }

                return {
                    ok: true,
                    error: null,
                    data: response as R,
                };
            } catch (error: any) {
                console.log("API Error:", error);

                if (error?.status === 401) {
                    logout();
                }

                let errorMessage = "Hiba történt a kérés feldolgozása során.";
                let errorDetails: any = null;

                // Try to get actual error response body if present
                if (error?.body) {
                    try {
                        errorDetails = typeof error.body === "string" ? JSON.parse(error.body) : error.body;

                        // Optional: override the default errorMessage if backend sends a nice message
                        if (errorDetails?.error) {
                            errorMessage = errorDetails.error;
                        }
                    } catch (parseError) {
                        console.warn("Failed to parse error body", parseError);
                    }
                }

                return {
                    ok: false,
                    data: null,
                    error: errorMessage,
                };
            }
        },
        [logout],
    );

    return { request };
}
