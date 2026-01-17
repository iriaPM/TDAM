//CollectionsFeedView.tsx
//This is the view that shows the feed of collections

import { StyleSheet, FlatList, Text } from "react-native";
import TdamCollectionCard from "@/components/CollectionCard";
import { SafeAreaView } from "react-native-safe-area-context";
import TdamSearchBar from "@/components/SearchBar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Collection } from "@/models/Collection";
import { useCollectionViewModel } from "@/viewmodel/CollectionFeedViewModel";

export default function CollectionsFeedView() {
   // const { collections, toggleSave, searchCollections, searching, error, loadRandomCollections } = useCollectionViewModel();
     const { collections } = useCollectionViewModel();

    const renderItem = ({ item }: { item: Collection }) => (
        <TdamCollectionCard
            title={item.title}
            username={item.username}
            time={item.time}
            description={item.description}
            imageUrl={item.imageUrl}
            isSaved={item.isSaved}
            onSave={() => {}}
        />
    );

    return (
        <SafeAreaView style={styles.container} >

            {/*<LoadingSpinner visible={searching && artworks.length === 0} />*/}

            {/*search bar*/}
            {/* <TdamSearchBar onSearch={"..."} /> */}

            {/* {error && (
                <Text style={styles.errorText}>
                    {error}
                </Text>
            )} */}

            {/*flatlist where the artworks card will be displayed*/}
            <FlatList
                data={collections}
                keyExtractor={(item) => item.objectID}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 16 }}
                refreshing={false}
                onRefresh={() => { }}
            />

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