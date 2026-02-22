//call artist detail page
import { useEffect } from "react";
import { useLocalSearchParams, router, Href } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import TdamArtistDetail from "../../../components/ArtistCard";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useArtistDetailViewModel } from "@/viewmodel/ArtistViewModel";

export default function ArtistDetailScreen() {
    const { name } = useLocalSearchParams<{ name: string }>();
    const { artist, loading, error, loadArtist } = useArtistDetailViewModel();

    useEffect(() => {
        if (!name) return;
        try {
            loadArtist(decodeURIComponent(name as string));
        } catch (e) {
            loadArtist(name as string);
        }
    }, [name]);

    if (loading) return <LoadingSpinner visible />;

    if (!artist) return null;

    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }} edges={["top"]}>
            <TdamArtistDetail
                name={artist.name}
                bio={artist.bio}
                nationality={artist.nationality}
                birthYear={artist.birthYear}
                deathYear={artist.deathYear}
                wikipediaUrl={artist.wikipediaUrl}
                artworks={artist.artworks ?? []}
                onArtworkPress={(id) =>
                    router.push(`/(tabs)/artwork/${id}` as Href)
                }
            />
        </SafeAreaView>
    );
}