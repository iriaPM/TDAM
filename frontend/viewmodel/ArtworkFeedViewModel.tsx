//Artwork feed  view model
//retrieve and manage artworks data for the feed
import { useEffect, useState } from "react";
import { Artwork } from "@/models/Artwork";
import { getRandomArtworksAPI, searchArtworksAPI } from "@/services/api";

export function useArtworksViewModel() {
    const [artworks, setArtworks] = useState<Artwork[]>([]);
    const [searching, setSearching] = useState(false);

    //load default feed
    useEffect(() => {
        loadRandomArtworks();
    }, []);

    //load random feed
    const loadRandomArtworks = async () => {
        setSearching(false);
        const results = await getRandomArtworksAPI();
        const mapped = results.map(item => ({
            ...item,
            isSaved: false
        }));

        setArtworks(mapped);

    };

    //search feed
    const searchArtworks = async (query: string) => {
        if (!query.trim()) {
            loadRandomArtworks();  //go back to default feed
            return;
        }
        setSearching(true);
        const results = await searchArtworksAPI(query);
        const mapped = results.map(item => ({
            ...item,
            isSaved: false,
        }));

        setArtworks(mapped);
    };


    const toggleSave = (id: string) => {
        setArtworks(prev =>
            prev.map(a =>
                a.objectID === id ? { ...a, isSaved: !a.isSaved } : a
            )
        );
    };

    return { artworks, toggleSave, searchArtworks, loadRandomArtworks, searching };
}
