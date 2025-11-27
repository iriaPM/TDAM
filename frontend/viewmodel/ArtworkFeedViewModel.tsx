//Artwork feed  view model
//retrieve and manage artworks data for the feed
import { Artwork } from "@/models/Artwork";
import { getArtworksAPI } from "@/services/api";
import { useState } from "react";

export function useArtworksViewModel() {
    const [artworks, setArtworks] = useState<Artwork[]>([]);

    const toggleSave = (id: string) => {
        setArtworks(prev =>
            prev.map(art =>
                art.id === id ? { ...art, isSaved: !art.isSaved } : art
            )
        );
    };

    const searchArtworks = async (query: string) => {
        if (!query.trim()) return;

        try {
            const results = await getArtworksAPI(query);
            const mapped = results.map((item: Artwork) => ({
                ...item,
                isSaved: false,
            }));

            setArtworks(mapped);

        } catch (err) {
            console.error("Error fetching artworks:", err);
        }
    };

    return { artworks, toggleSave, searchArtworks };
}
