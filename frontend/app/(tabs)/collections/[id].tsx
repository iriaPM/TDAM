//collections detail view.tsx

import { useLocalSearchParams } from "expo-router";
import {
    StyleSheet,
    View,
    Text,
    FlatList,
    Pressable,
    Dimensions,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useEffect, useRef, useState } from "react";
import Ionicons from "@expo/vector-icons/Ionicons";
import RBSheet from "react-native-raw-bottom-sheet";
import ImageViewer from "@/components/imageViewer";
import LoadingSpinner from "@/components/LoadingSpinner";
import CreateCollectionBottomsheet from "@/components/CreateCollectionBottomsheet";
import { useCollectionDetailViewModel } from "@/viewmodel/CollectionDetailViewModel";

const { width } = Dimensions.get("window");
const ITEM_SIZE = (width - 48) / 2;

export default function CollectionDetailView() {
    const editSheetRef = useRef<any>(null);

    const { id } = useLocalSearchParams<{ id: string }>();
    const {
        collection,
        loading,
        isOwnCollection,
        togglePrivacy,
    } = useCollectionDetailViewModel(id);

    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");

    useEffect(() => {
        if (collection) {
            setEditName(collection.title);
            setEditDescription(collection.description ?? "");
        }
    }, [collection]);

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
                        {/* Title row */}
                        <View style={styles.inlineRow}>
                            <Text style={styles.title}>{collection.title}</Text>

                            {isOwnCollection && (
                                <>
                                    <Pressable onPress={() => editSheetRef.current?.open()}>
                                        <Ionicons name="pencil" size={20} color="blue" />
                                    </Pressable>

                                    <Pressable
                                        style={styles.privacyButton}
                                        onPress={togglePrivacy}
                                    >
                                        <Ionicons
                                            name={collection.isPrivate ? "lock-closed" : "lock-open"}
                                            size={20}
                                            color="#666"
                                        />
                                        <Text style={styles.privacyText}>
                                            {collection.isPrivate ? "Private" : "Public"}
                                        </Text>
                                    </Pressable>
                                </>
                            )}
                        </View>
                        <Text style={styles.username}>{collection.username}</Text>
                    </View>
                </View>

                {collection.description && (
                    <View style={styles.inlineRow}>
                        <Text style={styles.description}>
                            {collection.description}
                        </Text>
                    </View>
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
            <RBSheet
                ref={editSheetRef}
                height={500}
                customStyles={{
                    container: {
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                    },
                }}
            >
                <CreateCollectionBottomsheet
                    name={editName}
                    description={editDescription}
                    onChangeName={setEditName}
                    onChangeDescription={setEditDescription}
                    onSubmit={() => {
                        console.log("Save edit", editName, editDescription);
                        editSheetRef.current?.close();
                    }}
                />
            </RBSheet>
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
        position: "relative",
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
        flex: 1,
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
    inlineRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    privacyButton: {
        flexDirection: "row",
        alignItems: "center",
    },
    privacyText: {
        fontSize: 12,
        color: "#666",
    },
});