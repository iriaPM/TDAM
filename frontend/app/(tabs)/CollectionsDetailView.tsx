//collections detail view.tsx

import { StyleSheet, View, Text, FlatList, Pressable, Dimensions } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import ImageViewer from "@/components/imageViewer";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useCollectionDetailViewModel } from "@/viewmodel/CollectionDetailViewModel";

const { width } = Dimensions.get("window");
const ITEM_SIZE = (width - 48) / 2;

export default function CollectionDetailView() {
    const { collection, loading } = useCollectionDetailViewModel();

    if (loading || !collection) {
        return <LoadingSpinner visible />;
    }

    return (
        <SafeAreaView style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <Pressable onPress={() => {
                        // TODO: navigate to user profile
                        console.log("User pressed:", collection.username);
                    }}>
                        <ImageViewer
                            imgSource={
                                collection.avatarUrl
                                    ? { uri: collection.avatarUrl }
                                    : require("@/assets/images/userPlaceholder.png")
                            }
                            style={styles.avatar}
                        />
                    </Pressable>

                    <View style={styles.headerText}>
                        <Text style={styles.title}>{collection.title}</Text>
                        <Text style={styles.username}>{collection.username}</Text>
                    </View>
                </View>

                {collection.description && (
                    <Text style={styles.description}>
                        {collection.description}
                    </Text>
                )}
            </View>

            {/* Artwork grid */}
            <FlatList
                data={collection.artworks}
                keyExtractor={(item) => item.id}
                numColumns={2}
                columnWrapperStyle={styles.row}
                renderItem={({ item }) => (
                    <Pressable
                        onPress={() => {
                            // TODO: open artwork detail later
                            console.log("Artwork pressed:", item.id);
                        }}
                    >
                        <ImageViewer
                            imgSource={
                                item.imageUrl
                                    ? { uri: item.imageUrl }
                                    : require("@/assets/images/placeholderArt.png")
                            }
                            style={[styles.image, { width: ITEM_SIZE, height: ITEM_SIZE }]}
                        />
                    </Pressable>
                )}
                contentContainerStyle={{ paddingBottom: 24 }}
            />
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        flex: 1,
        paddingTop: 15,
    },
    header: {
        paddingHorizontal: 16,
        paddingBottom: 16,
    },
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingBottom: 5,
    },
    headerText: {
        flexDirection: "column",
        justifyContent: "center",
    },
    avatar: {
        width: 80,
        height: 80,
        borderRadius: 18,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
    },
    username: {
        fontSize: 12,
        color: "#555",
        marginTop: 2,
    },
    description: {
        fontSize: 12,
        marginTop: 8,
        color: "#333",
    },
    row: {
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    image: {
        borderRadius: 6,
    },
});