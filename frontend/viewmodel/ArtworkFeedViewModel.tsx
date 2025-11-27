//Artwork feed  view model
//retrieve and manage artworks data for the feed

import { Artwork } from "@/models/Artwork";
import { useState } from "react";


export function useArtworksViewModel() {
    const [artworks, setArtworks] = useState<Artwork[]>([]);

    const toggleSave = (id: string) => {
        setArtworks(prev =>
            prev.map(artwork =>
                artwork.id === id ? { ...artwork, isSaved: !artwork.isSaved } : artwork
            )
        );
    };

    const searchArtworks = async (query: string) => {
        if (!query.trim()) return; //if query is empty, do nothing

        try {
            const response = await fetch(`http://172.27.192.1:8080/api/artworks?query=${query}`);
            const data = await response.json();

            const mapped: Artwork[] = data.map((item: any) => ({
                id: item.objectID.toString(),
                title: item.title || "Unknown",
                artist: item.artist || "Unknown",
                year: item.year || "Unknown",
                medium: item.medium || "Unknown",
                dimensions: item.dimensions || "Unknown",
                location: item.location || "Unknown",
                imageUrl: item.imageUrl || "Unknown",
                movement: item.movement || "Unknown",
                isSaved: false
                })
            )
            setArtworks(mapped);
        } catch (error) {
            console.error("Failed to fetch artworks:", error);
        }
    }

    return { artworks, toggleSave, searchArtworks };
}