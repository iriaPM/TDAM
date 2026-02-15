//CollectionsFeedView.tsx
//This is the view that shows the feed of collections

import { StyleSheet, FlatList, Text } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Href, router } from "expo-router";
import TdamCollectionCard from "@/components/CollectionCard";
import TdamSearchBar from "@/components/SearchBar";
import LoadingSpinner from "@/components/LoadingSpinner";
import { Collection } from "@/models/Collection";
import { useCollectionsViewModel } from "@/viewmodel/CollectionsViewModel";

export default function CollectionsFeedView() {
    const {
        collections,
        searching,
        feedError,
        searchCollections,
        toggleSave,
        loadCollections,
    } = useCollectionsViewModel();

    const renderItem = ({ item }: { item: Collection }) => (
        <TdamCollectionCard
            title={item.title}
            username={item.username}
            time={item.time}
            description={item.description}
            imageUrl={item.imageUrl}
            avatarUrl={item.avatarUrl}
            isSaved={item.isSaved}
            onSave={() => toggleSave(item.id)}
            onPress={() => {
                // open collection
                router.push(`/(tabs)/collections/${item.id}` as Href);
            }}
            onUserPress={() => {
                // open  profile page of user
                router.push(`/(tabs)/user/${item.userId}` as Href);
            }}
        />
    );

    return (
        <SafeAreaView style={styles.container}>
            <LoadingSpinner visible={searching && collections.length === 0} />

            <TdamSearchBar onSearch={searchCollections} />

            {feedError && <Text style={styles.errorText}>{feedError}</Text>}

            <FlatList
                data={collections}
                keyExtractor={(item) => item.id}
                renderItem={renderItem}
                contentContainerStyle={{ paddingBottom: 16 }}
                refreshing={searching}
                onRefresh={loadCollections}
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
