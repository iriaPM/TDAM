//userprofileviewmodel.tsx

import { useEffect, useState } from "react";
import { Collection } from "@/models/Collection";
import { UserProfile } from "@/models/Users";
import { getUserProfile, updateUserProfile } from "@/services/api";


export function useUserProfileViewModel(userId?: string) {
    const [user, setUser] = useState<UserProfile | null>(null);
    const [collections, setCollections] = useState<Collection[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string>();

    const isMe = user?.isMe ?? false;

    const load = async () => {
        try {
            setLoading(true);
            setError(undefined);

            const profileData = await getUserProfile(userId);

            setUser({
                id: profileData.id,
                userName: profileData.userName,
                description: profileData.description,
                avatarUrl: profileData.avatarUrl,
                isMe: profileData.me,
                collections: profileData.collections || [],
            });

            const mappedCollections = (profileData.collections || [])
                .filter((col: any) => {
                   return profileData.me || !col.private;
                })
                .map((col: any) => ({
                    ...col,
                    imageUrl: col.coverImageUrl,
                }));

            setCollections(mappedCollections);
        } catch (err) {
            setError("Failed to load profile");
            console.error("Profile load error:", err);
        } finally {
            setLoading(false);
        }
    };

    const updateProfile = async (username: string, description: string) => {
        if (!user) return;

        try {
            const updated = await updateUserProfile(username, description);
            setUser({
                ...user,
                userName: updated.username,
                description: updated.description,
            });
        } catch (err) {
            setError("Failed to update profile");
            console.error("Profile update error:", err);
            throw err;
        }
    };

    return {
        user,
        collections,
        isMe,
        loading,
        error,
        load,
        updateProfile,
    };
}
