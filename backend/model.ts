export interface User {
    id: number;
    role: string;
    name: string;
    email: string;
}

export interface CaregiverWithoutPassword {
    id: string;
    name: string;
    email: string;
    phone: string;
}

export interface RecipientWithoutPassword {
    id: string;
    name: string;
    email: string;
    phone: string;
    address: string;
    fourHandCareNeeded: boolean;
    caregiverNote: string;
}

export interface ErrorResponse {
    error: string;
    message: string;
}

export interface SuccessResponse {
    message: string;
}

export const successResponse: SuccessResponse = {
    message: "OK",
};

export interface LogedInUser {
    id: string;
    role: string;
}
