//CollectionsFeedView.tsx
//This is the view that shows the feed of collections

import { StyleSheet, FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import TdamCollectionCard from "@/components/CollectionCard";
import TdamSearchBar from "@/components/SearchBar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Collection } from "@/models/Collection";
import { useCollectionViewModel } from "@/viewmodel/CollectionFeedViewModel";

export default function CollectionsFeedView() {
    const {
        collections,
        searching,
        error,
        searchCollections,
        toggleSave,
    } = useCollectionViewModel();

    const renderItem = ({ item }: { item: Collection }) => (
        <TdamCollectionCard
            title={item.title}
            username={item.username}
            time={item.time}
            description={item.description}
            imageUrl={item.imageUrl}
            avatarUrl={item.avatarUrl}
            isSaved={item.isSaved}
            onSave={() => toggleSave(item.objectID)}
            onPress={() => {
                // open collection
                router.push("/(tabs)/CollectionsDetailView");
            }}
            onUserPress={() => {
                // open public profile
                router.push("/(tabs)/PublicProfile");
            }}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <LoadingSpinner visible={searching && collections.length === 0} />

            <TdamSearchBar onSearch={searchCollections} />

            {error && <Text style={styles.errorText}>{error}</Text>}

            <FlatList
                data={collections}
                keyExtractor={(item) => item.objectID}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 16 }}
            />
        </SafeAreaView>
    );
}

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
