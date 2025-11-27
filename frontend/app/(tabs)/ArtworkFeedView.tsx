//Artwork feed view.tsx
//diaplay all the artworks from the museums in a feed
import { router } from "expo-router";
import { View, StyleSheet, Dimensions, FlatList } from "react-native";
import TdamArtworkCard from "@/components/ArtworkCard";
import { useArtworksViewModel } from "@/viewmodel/ArtworkFeedViewModel";
import { SafeAreaView } from "react-native-safe-area-context";
import TdamSearchBar from "@/components/SearchBar";

const { height, width } = Dimensions.get("window"); //get height relative to the screen size 

export default function ArtworkFeedView() {
    const { artworks, toggleSave } = useArtworksViewModel();

    return (
        <SafeAreaView style={styles.container}>
            <TdamSearchBar />
            <FlatList
                data={artworks}
                keyExtractor={(item) => item.id}
                renderItem={({ item }) => (
                    <TdamArtworkCard
                        title={item.title}
                        artist={item.artist}
                        year={item.year}
                        movement={item.movement}
                        imageUrl={item.image}
                        isSaved={item.isSaved}
                        onSave={() => toggleSave(item.id)}
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