//Artist Viewmodel
import { useState } from "react";
import { ArtistDetail } from "@/models/Artist";
import { getArtistDetail } from "@/services/api";

export function useArtistDetailViewModel() {
    const [artist, setArtist] = useState<ArtistDetail | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const loadArtist = async (name: string) => {
        setLoading(true);
        setError(null);

        try {
            const data = await getArtistDetail(name);
            setArtist(data);
        } catch {
            setError("Failed to load artist");
        } finally {
            setLoading(false);
        }
    };

    return { artist, loading, error, loadArtist };
}