//CollectionFeedViewModel.tsx
//This viewmodel manages the state and logic for the collections feed
import { useEffect, useState } from "react";
import { Collection } from "@/models/Collection";
import { getPublicCollections } from "@/services/api";

export function useCollectionViewModel() {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        loadCollections();
    }, []);

    const loadCollections = async () => {
        setSearching(true);
        setError(null);

        try {
            const data = await getPublicCollections();

            setCollections(
                data.map((c: any) => ({
                    id: c.id,
                    title: c.title,
                    username: c.username,
                    imageUrl: c.coverImageUrl ?? "",
                    avatarUrl: c.avatarUrl ?? "",
                    isSaved: false,
                }))
            );
        } catch {
            setError("Failed to load collections");
        } finally {
            setSearching(false);
        }
    };

    const searchCollections = async (query: string) => {
        if (!query.trim()) {
            loadCollections();
            return;
        }

        setSearching(true);
        setError(null);

        // dummy search for now
        setCollections((prev) =>
            prev.filter((c) =>
                c.title.toLowerCase().includes(query.toLowerCase())
            )
        );

        setSearching(false);
    };

    const toggleSave = (id: string) => {
        setCollections((prev) =>
            prev.map((c) =>
                c.id === id ? { ...c, isSaved: !c.isSaved } : c
            )
        );
    };

    return {
        collections,
        searching,
        error,
        loadCollections,
        searchCollections,
        toggleSave,
    };
}
