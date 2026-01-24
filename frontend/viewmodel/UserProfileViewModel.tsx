//userprofileviewmodel.tsx

import { useEffect, useState } from "react";
import { Collection } from "@/models/Collection";
import { User } from "@/models/Users";
import {
    mockGetUser,
    mockGetUserCollections,
    mockUpdateUser,
} from "@/services/userProfile.mock";

const AUTH_USER_ID = "me"; // replace later with auth context

export function useUserProfileViewModel(userId?: string) {
    const isMe = !userId || userId === AUTH_USER_ID;
    const resolvedUserId = userId ?? AUTH_USER_ID;

    const [user, setUser] = useState<User | null>(null);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>();

    useEffect(() => {
        load();
    }, [userId]);

    const load = async () => {
        try {
            setLoading(true);
            const userData = await mockGetUser(resolvedUserId);
            const collectionsData = await mockGetUserCollections(
                resolvedUserId,
                isMe
            );

            setUser(userData);
            setCollections(collectionsData);
        } catch {
            setError("Failed to load profile");
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (name: string, description: string) => {
        if (!user) return;
        const updated = await mockUpdateUser(user.id, name, description);
        setUser(updated);
    };

    return {
        user,
        collections,
        isMe,
        loading,
        error,
        updateProfile,
    };
}
