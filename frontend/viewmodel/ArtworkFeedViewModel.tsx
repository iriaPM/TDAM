//Artwork feed  view model
//retrieve and manage artworks data for the feed
import { useEffect, useState } from "react";
import { Artwork } from "@/models/Artwork";
import { getRandomArtworksAPI, searchArtworksAPI } from "@/services/api";

export function useArtworksViewModel() {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [searching, setSearching] = useState(false);
    const [error, setError] = useState<string | null>(null);

    //load default feed
    useEffect(() => {
        loadRandomArtworks();
    }, []);

    //load random feed
    const loadRandomArtworks = async () => {
        setSearching(true);
        setError(null);

        try {
            const results = await getRandomArtworksAPI();
            setArtworks(results);
        } catch {
            setError("Failed to load artworks");
        } finally {
            setSearching(false);
        }
    };

    //search feed
    const searchArtworks = async (query: string) => {
        if (!query.trim()) {
            loadRandomArtworks();
            return;
        }

        setSearching(true);
        setError(null);

        try {
            const results = await searchArtworksAPI(query);
            setArtworks(results);
        } catch {
            setError("Search failed");
        } finally {
            setSearching(false);
        }
    };

    const toggleSave = (id: string, newSavedState: boolean) => {
        setArtworks(prev =>
            prev.map(a =>
                a.objectID === id ? { ...a, isSaved: newSavedState } : a
            )
        );
    };

    return {
        artworks,
        searching,
        error,
        toggleSave,
        searchArtworks,
        loadRandomArtworks,
    };
}
