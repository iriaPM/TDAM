//Artwork feed view.tsx
//display all the artworks from the museums in a feed
import { StyleSheet, FlatList } from "react-native";
import TdamArtworkCard from "@/components/ArtworkCard";
import { useArtworksViewModel } from "@/viewmodel/ArtworkFeedViewModel";
import { SafeAreaView } from "react-native-safe-area-context";
import TdamSearchBar from "@/components/SearchBar";
import LoadingSpinner from "@/components/LoadingSpinner";

export default function ArtworkFeedView() {
    const { artworks, toggleSave, searchArtworks, searching } = useArtworksViewModel();

    return (
        <SafeAreaView style={styles.container}>
            <LoadingSpinner visible={searching && artworks.length === 0} />

            {/*search bar*/}
            <TdamSearchBar onSearch={searchArtworks} />

            {/*flatlist where the artworks card will be displayed*/}
            <FlatList
                data={artworks}
                keyExtractor={(item) => item.objectID}
                renderItem={({ item }) => (
                    <TdamArtworkCard
                        title={item.title}
                        artist={item.artist}
                        year={item.objectDate}
                        movement={item.movement}
                        imageUrl={item.imageUrl}
                        isSaved={item.isSaved}
                        onSave={() => toggleSave(item.objectID)}
                    />
                )}
                contentContainerStyle={{ paddingBottom: 16 }}
            />
        </SafeAreaView>
    );
}

// -- styling -- 
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffffff",
    },
});