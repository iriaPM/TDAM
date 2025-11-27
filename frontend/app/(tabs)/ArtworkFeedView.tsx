//Artwork feed view.tsx
//diaplay all the artworks from the museums in a feed
import { router } from "expo-router";
import { View, StyleSheet, Dimensions, FlatList } from "react-native";
import TdamArtworkCard from "@/components/ArtworkCard";
import { useArtworksViewModel } from "@/viewmodel/ArtworkFeedViewModel";

const { height, width } = Dimensions.get("window"); //get height relative to the screen size 

export default function ArtworkFeedView() {
    const { artworks, toggleSave } = useArtworksViewModel();

    return (
        <View style={styles.container}>
            <FlatList
                style={styles.list}
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
        </View>
    );
}

// -- styling -- 
const styles = StyleSheet.create({
    container: {

    },
    list: {

    }
});