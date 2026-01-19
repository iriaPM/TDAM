//CollectionDetailViewModel.tsx

import { useEffect, useState } from "react";
import { CollectionDetail } from "@/models/CollectionDetails";
import { getCollectionDetail  } from "@/services/api";

export function useCollectionDetailViewModel(collectionId: string) {
    const [collection, setCollection] = useState<CollectionDetail | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    //flag for logged in user or other user
    const isOwnCollection = true;

    useEffect(() => {
        const load = async () => {
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
                });
            } catch {
                setError("Failed to load collection");
            } finally {
                setLoading(false);
            }
        };

        load();
    }, [collectionId]);
    return { collection, loading, isOwnCollection, error };
}
