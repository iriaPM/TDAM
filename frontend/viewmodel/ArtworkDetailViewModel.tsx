//artworkdetailviewmodel.tsx
import { useEffect, useState } from "react";
import { Collection } from "@/models/Collection";
import {
    getArtworkDetail,
    markArtworkViewed,
    toggleSaveArtwork,
    getMyCollections,
    toggleArtworkInCollection,
    createCollection,
} from "@/services/api";

export function useArtworkDetailViewModel(artworkId: string) {
    const [artwork, setArtwork] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isSaved, setIsSaved] = useState(false);
    const [collections, setCollections] = useState<Collection[]>([]);

    useEffect(() => {
        if (!artworkId) return;
        setLoading(true);
        setArtwork(null);

        const load = async () => {
            try {
                const data = await getArtworkDetail(artworkId);
                setArtwork(data);
                setIsSaved(data.isSaved ?? false);
                await markArtworkViewed(artworkId);
            } catch (e) {
                console.error("Failed to load artwork", e);
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [artworkId]);

    const toggleSave = async () => {
        if (!artwork) return;
        try {
            const result = await toggleSaveArtwork(artwork.objectID, artwork.imageUrl);
            setIsSaved(result.isSaved);
        } catch (e) {
            console.error("Failed to save artwork", e);
        }
    };

    const loadCollections = async () => {
        if (!artwork) return;
        try {
            const data = await getMyCollections();
            setCollections(
                data.map((c: any) => ({
                    id: c.id,
                    title: c.title,
                    imageUrl: c.coverImageUrl ?? "",
                    isSaved: Array.isArray(c.artworkIds)
                        ? c.artworkIds.includes(artwork.objectID)
                        : false,
                }))
            );
        } catch (e) {
            console.error("Failed to load collections", e);
        }
    };

    const toggleCollection = async (collectionId: string) => {
        if (!artwork) return;
        try {
            await toggleArtworkInCollection(collectionId, artwork.objectID, artwork.imageUrl);
            setCollections(prev =>
                prev.map(c =>
                    c.id === collectionId ? { ...c, isSaved: !c.isSaved } : c
                )
            );
        } catch (e) {
            console.error("Failed to toggle artwork in collection", e);
        }
    };

    const handleCreateCollection = async (name: string, description: string) => {
        if (!artwork) return;
        const created = await createCollection(name, description, false);
        await toggleArtworkInCollection(created.id, artwork.objectID, artwork.imageUrl);
    };

    return {
        artwork,
        loading,
        isSaved,
        collections,
        toggleSave,
        loadCollections,
        toggleCollection,
        handleCreateCollection,
    };
}