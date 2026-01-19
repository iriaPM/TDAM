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
import { useRef, useState } from "react";
import SaveArtworkBottomsheet from "@/components/SaveArtworkBottomsheet";
import CreateCollectionBottomsheet from "@/components/CreateCollectionBottomsheet";
import { toggleArtworkInCollection, createCollection } from "@/services/api";


export default function ArtworkFeedView() {
    const { artworks, toggleSave, searchArtworks, searching, error, loadRandomArtworks } = useArtworksViewModel();
    const saveSheetRef = useRef<any>(null);
    const createSheetRef = useRef<any>(null);

    const [newCollectionName, setNewCollectionName] = useState("");
    const [newCollectionDescription, setNewCollectionDescription] = useState("");
    const [selectedArtwork, setSelectedArtwork] = useState<Artwork | null>(null);

    const renderItem = ({ item }: { item: Artwork }) => (
        <TdamArtworkCard
            title={item.title}
            artist={item.artist}
            year={item.objectDate}
            movement={item.movement}
            imageUrl={item.imageUrl}
            isSaved={item.isSaved}
            //onSave={() => toggleSave(item.objectID)}
            onSave={() => {
                setSelectedArtwork(item);//sets the selected artwork 
                saveSheetRef.current?.open()//opensbottomsheet
            }
            } />
    );

    const handleToggleCollection = async (collectionId: string) => {
        if (!selectedArtwork) return;

        try {
            await toggleArtworkInCollection(
                collectionId,
                selectedArtwork.objectID,
                selectedArtwork.imageUrl
            );
        } catch (e) {
            console.error("Failed to toggle artwork", e);
        }
    };

    const handleCreateCollection = async () => {
        if (!newCollectionName.trim()) return;

        try {
            await createCollection(
                newCollectionName,
                newCollectionDescription,
                false
            );

            createSheetRef.current?.close();
            setNewCollectionName("");
            setNewCollectionDescription("");
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
                height={500}
                openDuration={250}
                customStyles={{
                    container: {
                        borderTopLeftRadius: 16,
                        borderTopRightRadius: 16,
                    },
                }}
            >
                {selectedArtwork && (
                    <SaveArtworkBottomsheet
                        artworkTitle={selectedArtwork.title}
                        artworkArtist={selectedArtwork.artist}
                        artworkImageUrl={selectedArtwork.imageUrl}
                        collections={[]} // mock for now
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
                height={500}
                // draggable={true}
                // useNativeDriver={true}
                customStyles={{
                    // wrapper: {
                    //     backgroundColor: 'rgba(0, 0, 0, 0.5)',
                    // },
                    container: {
                        borderTopLeftRadius: 20,
                        borderTopRightRadius: 20,
                    },
                    // draggableIcon: {
                    //     backgroundColor: '#999',
                    // },
                }}
            >
                <CreateCollectionBottomsheet
                    name={newCollectionName}
                    description={newCollectionDescription}
                    onChangeName={setNewCollectionName}
                    onChangeDescription={setNewCollectionDescription}
                    onSubmit={handleCreateCollection}
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
});