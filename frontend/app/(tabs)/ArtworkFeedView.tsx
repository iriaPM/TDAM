//Artwork feed view.tsx
//display all the artworks from the museums in a feed

import { StyleSheet, FlatList, Text } from "react-native";
import TdamArtworkCard from "@/components/ArtworkCard";
import { useArtworksViewModel } from "@/viewmodel/ArtworkFeedViewModel";
import { SafeAreaView } from "react-native-safe-area-context";
import TdamSearchBar from "@/components/SearchBar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Artwork } from "@/models/Artwork";
import RBSheet from 'react-native-raw-bottom-sheet';
import { useCallback, useRef, useState } from "react";
import SaveArtworkBottomsheet from "@/components/SaveArtworkBottomsheet";
import CreateCollectionBottomsheet from "@/components/CreateCollectionBottomsheet";
import { toggleArtworkInCollection, createCollection, getMyCollections, toggleSaveArtwork } from "@/services/api";
import { Collection } from "@/models/Collection";
import { Href, router, useFocusEffect } from "expo-router";


export default function ArtworkFeedView() {
    const { artworks, toggleSave, searchArtworks, searching, error, loadRandomArtworks } = useArtworksViewModel();
    const saveSheetRef = useRef<any>(null);
    const createSheetRef = useRef<any>(null);

    const [newCollectionName, setNewCollectionName] = useState("");
    const [newCollectionDescription, setNewCollectionDescription] = useState("");
    const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);
    const [collections, setCollections] = useState<Collection[]>([]);

    useFocusEffect(
        useCallback(() => {
            loadRandomArtworks();
        }, [])
    );

    const renderItem = ({ item }: { item: Artwork }) => (
        <TdamArtworkCard
            title={item.title}
            artist={item.artist}
            year={item.objectDate}
            movement={item.movement}
            imageUrl={item.imageUrl}
            isSaved={item.isSaved}
            onSave={async () => {
                try {
                    const result = await toggleSaveArtwork(
                        item.objectID,
                        item.imageUrl
                    );
                    toggleSave(item.objectID, result.isSaved);
                } catch (e) {
                    console.error("Failed to toggle save", e);
                }
            }}
            onAddToCollection={async () => {
                setSelectedArtwork(item);

                try {
                    const data = await getMyCollections();
                    setCollections(
                        data.map((c: any) => ({
                            id: c.id,
                            title: c.title,
                            imageUrl: c.coverImageUrl ?? "",
                            isSaved: Array.isArray(c.artworkIds)
                                ? c.artworkIds.includes(item.objectID) : false,
                        }))
                    );
                } catch (e) {
                    console.error("Failed to load collections", e);
                }

                saveSheetRef.current?.open();
            }}
            onPress={() => {
                router.push(`artwork/${item.objectID}` as Href);
            }}
            onArtistPress={() => {
                if (!item.artist) return;
                router.push(`artist/${encodeURIComponent(item.artist)}` as Href);
            }}
        />
    );

    const handleToggleCollection = async (collectionId: string) => {
        if (!selectedArtwork) return;

        try {
            await toggleArtworkInCollection(
                collectionId,
                selectedArtwork.objectID,
                selectedArtwork.imageUrl
            );

            setCollections((prev) =>
                prev.map((c) =>
                    c.id === collectionId
                        ? { ...c, isSaved: !c.isSaved }
                        : c
                )
            );
        } catch (e) {
            console.error("Failed to toggle artwork", e);
        }
    };

    const handleCreateCollection = async () => {
        if (!newCollectionName.trim()) return;

        try {
            const created = await createCollection(
                newCollectionName,
                newCollectionDescription,
                false
            );

            if (selectedArtwork) {
                await toggleArtworkInCollection(
                    created.id,
                    selectedArtwork.objectID,
                    selectedArtwork.imageUrl
                );
            }

            createSheetRef.current?.close();
            setNewCollectionName("");
            setNewCollectionDescription("");
            router.push(`collections/${created.id}` as Href);

        } catch (e) {
            console.error("Failed to create collection", e);
        }
    };

    return (
        <SafeAreaView style={styles.container} >

            <LoadingSpinner visible={searching && artworks.length === 0} />

            {/*search bar*/}
            <TdamSearchBar onSearch={searchArtworks} />

            {error && (
                <Text style={styles.errorText}>
                    {error}
                </Text>
            )}

            {/*flatlist where the artworks card will be displayed*/}
            <FlatList
                data={artworks}
                keyExtractor={(item) => item.objectID}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 16 }}
                refreshing={searching}
                onRefresh={loadRandomArtworks}
            />
            <RBSheet
                ref={saveSheetRef}
                height={700}
                draggable={true}
                dragOnContent={true}
                customStyles={{
                    wrapper: styles.BSwrapper,
                    container: styles.BScontainerAdd,
                    draggableIcon: styles.BSdraggableIcon
                }}
            >
                {selectedArtwork && (
                    <SaveArtworkBottomsheet
                        artworkTitle={selectedArtwork.title}
                        artworkArtist={selectedArtwork.artist}
                        artworkImageUrl={selectedArtwork.imageUrl}
                        collections={collections}
                        onCreateNew={() => {
                            saveSheetRef.current?.close();
                            createSheetRef.current?.open()
                        }}
                        onToggleCollection={(id) => { handleToggleCollection(id) }}
                    />
                )}
            </RBSheet>
            <RBSheet
                ref={createSheetRef}
                height={700}
                draggable={true}
                dragOnContent={true}
                customStyles={{
                    wrapper: styles.BSwrapper,
                    container: styles.BScontainerCreate,
                    draggableIcon: styles.BSdraggableIcon
                }}
            >
                <CreateCollectionBottomsheet
                    name={newCollectionName}
                    description={newCollectionDescription}
                    onChangeName={setNewCollectionName}
                    onChangeDescription={setNewCollectionDescription}
                    onSubmit={handleCreateCollection}
                    submitLabel="Create"
                    title="Create a new collection!"
                />
            </RBSheet>
        </SafeAreaView >
    );
}

// -- styling -- 
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffffff",
    },
    errorText: {
        textAlign: "center",
        color: "#f00d0dff",
        marginVertical: 8,
    },
    BSwrapper: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    BScontainerAdd: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: '#FF8F8F',
    },
    BScontainerCreate: {
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        backgroundColor: '#C2E2FA',
    },
    BSdraggableIcon: {
        backgroundColor: '#999',
    },
});