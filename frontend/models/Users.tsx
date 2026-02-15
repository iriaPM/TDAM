//Users model

export interface User {
    id: string;
    userName: string;
    email: string;
    token: string;
    description: string;
    avatarUrl: string;
    hasCompletedSurvey: boolean;
}

export interface UserProfile {
    id: number;
    userName: string;
    description?: string;
    avatarUrl?: string;
    isMe: boolean;
    collections: any[];
}