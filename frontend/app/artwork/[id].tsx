// [id].tsx 
// displays fields that are actually returned by the APIs
import { useLocalSearchParams } from "expo-router";
import { FlatList, Dimensions, StyleSheet, View } from "react-native";
import ArtworkDetailPage from "@/components/ArtworkDetailPage";

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get("window");

export default function ArtworkDetailView() {
    const { id, ids } = useLocalSearchParams<{ id: string; ids?: string }>();

    const artworkIds = ids ? ids.split(",") : [id as string];
    const initialIndex = Math.max(artworkIds.indexOf(id as string), 0);

    if (artworkIds.length === 1) {
        return <ArtworkDetailPage artworkId={id as string} />;
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={artworkIds}
                horizontal
                pagingEnabled
                initialScrollIndex={initialIndex}
                getItemLayout={(_, index) => ({
                    length: SCREEN_WIDTH,
                    offset: SCREEN_WIDTH * index,
                    index,
                })}
                keyExtractor={(item) => item}
                showsHorizontalScrollIndicator={false}
                windowSize={3}
                maxToRenderPerBatch={1}
                renderItem={({ item }) => (
                    <View style={styles.page}>
                        <ArtworkDetailPage artworkId={item} />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
        backgroundColor: "#fff",
    },
    page: {
        width: SCREEN_WIDTH,
        height: SCREEN_HEIGHT,
    },
});