//collections detail view.tsx

import { Href, router, useLocalSearchParams } from "expo-router";
import {
    StyleSheet,
    View,
    Text,
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
import { useCollectionsViewModel } from "@/viewmodel/CollectionsViewModel";
import MasonryList from '@react-native-seoul/masonry-list';

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
        updateDetails
    } = useCollectionsViewModel(id);

    const [editName, setEditName] = useState("");
    const [editDescription, setEditDescription] = useState("");

    const openEditSheet = () => {
        if (!collection) return;

        setEditName(collection.title);
        setEditDescription(collection.description ?? "");
        editSheetRef.current?.open();
    };


    useEffect(() => {
        if (collection) {
            setEditName(collection.title);
            setEditDescription(collection.description ?? "");
        }
    }, [collection]);

    if (loading || !collection) {
        return <LoadingSpinner visible />;
    }

    const handleUpdateCollection = async () => {
        await updateDetails(editName, editDescription);
        editSheetRef.current?.close();
    };

    return (
        <SafeAreaView style={styles.container}>

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerRow}>
                    <Pressable onPress={() => {
                        // TODO: navigate to user profile
                        router.push(`/(tabs)/user/[id]` as Href);
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
                            <Text
                                style={styles.title}
                                numberOfLines={2}
                                ellipsizeMode="tail"
                            >
                                {collection.title}
                            </Text>

                            {isOwnCollection && (
                                <View style={styles.iconsContainer}>
                                    <Pressable
                                        style={styles.icons}
                                        onPress={openEditSheet}>
                                        <Ionicons name="pencil" size={20} color="#666" />
                                    </Pressable>

                                    <Pressable
                                        style={styles.icons}
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
                                </View>
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
            <MasonryList
                data={collection.artworks}
                keyExtractor={(item) => item.id}
                numColumns={2}
                renderItem={({ item }: { item: any }) => (
                    <Pressable
                    style={{ paddingHorizontal: 4 }}
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
                            style={styles.masonryImage}
                        />
                    </Pressable>
                )}
                containerStyle={styles.masonryContainer}
            />
            <RBSheet
                ref={editSheetRef}
                height={700}
                draggable={true}
                dragOnContent={true}
                customStyles={{
                    wrapper: styles.BSwrapper,
                    container: styles.BScontainer,
                    draggableIcon: styles.BSdraggableIcon
                }}
            >
                <CreateCollectionBottomsheet
                    title="Edit collection details :)"
                    submitLabel="Update"
                    name={editName}
                    description={editDescription}
                    onChangeName={setEditName}
                    onChangeDescription={setEditDescription}
                    onSubmit={handleUpdateCollection}
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
    inlineRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
    },
    title: {
        fontSize: 16,
        fontWeight: "bold",
        flex: 1,
        flexShrink: 1,
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
    iconsContainer: {
        flexDirection: "row",
        gap: 6,
        flexShrink: 0,
    },
    icons: {
        flexDirection: "row",
        alignItems: "center",
        padding: 8,
        borderRadius: 20,
        backgroundColor: "#f2f2f2",
    },
    privacyText: {
        fontSize: 12,
        color: "#666",
    },
    masonryContainer: {
        paddingHorizontal: 16,
        paddingBottom: 24,
    },
    masonryImage: {
        width: '100%',
        borderRadius: 6,
        marginBottom: 8,
    },
    row: {
        justifyContent: "space-between",
        paddingHorizontal: 16,
        marginBottom: 16,
    },
    artworkContainer: {
        width: ITEM_SIZE,
    },
    image: {
        width: "100%",
        aspectRatio: 1,
        borderRadius: 6,
        objectFit: 'cover',
    },
    imageContainer: {
        borderRadius: 6,
        overflow: 'hidden',
    },
    BSwrapper: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    BScontainer: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: '#C2E2FA',
    },
    BSdraggableIcon: {
        backgroundColor: '#999',
    },
});