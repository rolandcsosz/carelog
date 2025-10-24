export interface User {
    id: number;
    role: string;
    name: string;
    email: string;
}

export interface Admin {
    id: number;
    name: string;
    email: string;
    password: string;
}

export interface Caregiver {
    id: number;
    name: string;
    email: string;
    phone: string; // e.g. "+36123456789"
    password: string;
}

export interface Recipient {
    id: number;
    name: string;
    email: string;
    phone: string;
    address: string;
    four_hand_care_needed: boolean;
    caregiver_note?: string | null;
    password: string;
}

export interface Relationship {
    relationship_id: number;
    recipient_id: number;
    caregiver_id: number;
}

export interface Schedule {
    id: number;
    relationship_id: number;
    date: string; // 'YYYY-MM-DD'
    start_time: string; // 'HH:mm:ss'
    end_time: string; // 'HH:mm:ss'
}

export interface TaskType {
    id: number;
    type: string;
}

export interface SubTask {
    id: number;
    title: string;
    taskTypeId: number;
}

export interface Todo {
    id: number;
    subtaskId: number;
    relationshipId: number;
    sequenceNumber: number;
    done: boolean;
}

export interface TaskLog {
    subTaskId: string;
    startTime: string; // "HH:mm:ss"
    endTime: string; // "HH:mm:ss"
    done: boolean;
    note?: string;
}

export interface LogEntry {
    id: string;
    date: string; // "yyyy-MM-dd"
    relationshipId: string;
    finished: boolean;
    closed: boolean;
    tasks: TaskLog[];
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
