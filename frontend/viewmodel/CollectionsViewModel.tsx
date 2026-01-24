// CollectionsViewModel.tsx

import { useEffect, useState } from "react";
import { Collection } from "@/models/Collection";
import { CollectionDetail } from "@/models/CollectionDetails";
import { formatDistanceToNow } from "date-fns";
import {
    getPublicCollections,
    getCollectionDetail,
    toggleCollectionPrivacy,
    updateCollection,
} from "@/services/api";

export function useCollectionsViewModel(collectionId?: string) {

    // feed state
    const [collections, setCollections] = useState<Collection[]>([]);
    const [searching, setSearching] = useState(false);
    const [feedError, setFeedError] = useState<string | null>(null);


    // detail state
    const [collection, setCollection] = useState<CollectionDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [detailError, setDetailError] = useState<string | null>(null);

    const isOwnCollection = !!collection?.owner;

    // feed logic
    const loadCollections = async () => {
        setSearching(true);
        setFeedError(null);

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
                    time: c.time
                        ? formatDistanceToNow(new Date(c.time), { addSuffix: true })
                        : undefined,

                    description: c.description ?? "",
                }))
            );
        } catch {
            setFeedError("Failed to load collections");
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
        setCollections(prev =>
            prev.filter(c =>
                c.title.toLowerCase().includes(query.toLowerCase())
            )
        );
        setSearching(false);
    };

    const toggleSave = (id: string) => {
        setCollections(prev =>
            prev.map(c =>
                c.id === id ? { ...c, isSaved: !c.isSaved } : c
            )
        );
    };


    // detail logic
    const loadCollectionDetail = async () => {
        if (!collectionId) return;

        setLoading(true);
        setDetailError(null);

        try {
            const data = await getCollectionDetail(collectionId);
            setCollection({
                id: data.id,
                title: data.title,
                username: data.username,
                avatarUrl: data.avatarUrl ?? "",
                description: data.description,
                isPrivate: data.private,
                artworks: data.artworks.map((a: any) => ({
                    id: a.artworkId,
                    imageUrl: a.imageUrl,
                })),
                owner: data.owner,
            });
        } catch {
            setDetailError("Failed to load collection");
        } finally {
            setLoading(false);
        }
    };

    const togglePrivacy = async () => {
        if (!collection) return;

        try {
            await toggleCollectionPrivacy(collection.id);
            setCollection(prev =>
                prev ? { ...prev, isPrivate: !prev.isPrivate } : prev
            );
        } catch {
            setDetailError("Failed to toggle privacy");
        }
    };

    const updateDetails = async (title: string, description: string) => {
        if (!collection) return;

        try {
            const updated = await updateCollection(
                collection.id,
                title,
                description
            );
            setCollection(updated);
        } catch {
            setDetailError("Failed to update collection");
        }
    };


    // effects
    useEffect(() => {
        loadCollections();
    }, []);

    useEffect(() => {
        if (collectionId) {
            loadCollectionDetail();
        }
    }, [collectionId]);

    return {
        // feed
        collections,
        searching,
        feedError,
        loadCollections,
        searchCollections,
        toggleSave,

        // detail
        collection,
        loading,
        detailError,
        isOwnCollection,
        togglePrivacy,
        updateDetails,
    };
}
