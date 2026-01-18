//SaveArtworkBottomsheet.tsx
//This component represents the bottom sheet for saving an artwork to a collection

import React from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    FlatList,
    Image,
} from 'react-native';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Collection } from '@/models/Collection';

interface SaveArtworkBottomsheetProps {
    artworkTitle: string;
    artworkArtist: string;
    artworkImageUrl?: string;
    collections: Collection[];
    onCreateNew: () => void;
    onToggleCollection: (collectionId: string) => void;
}

export default function SaveArtworkBottomsheet({
    artworkTitle,
    artworkArtist,
    artworkImageUrl,
    collections,
    onCreateNew,
    onToggleCollection,
}: SaveArtworkBottomsheetProps) {
    return (
        <View style={styles.container}>
            {/* Header */}
            <Text style={styles.headerTitle}>Add to a collection!</Text>

            {/* Artwork info */}
            <View style={styles.artworkInfo}>
                <Image
                    source={
                        artworkImageUrl
                            ? { uri: artworkImageUrl }
                            : require('@/assets/images/placeholderArt.png')
                    }
                    style={styles.artworkImage}
                />
                <View style={styles.artworkText}>
                    <Text style={styles.artworkTitle}>{artworkTitle}</Text>
                    <Text style={styles.artworkArtist}>{artworkArtist}</Text>
                </View>
            </View>

            {/* Create New Collection button */}
            <Pressable style={styles.createNewButton} onPress={onCreateNew}>
                <Ionicons name="add-circle-outline" size={20} color="#000" />
                <Text style={styles.createNewText}>Create New Collection</Text>
            </Pressable>

            {/* Collections list */}
            <FlatList
                data={collections}
                keyExtractor={(item) => item.objectID}
                renderItem={({ item }) => (
                    <Pressable
                        style={styles.collectionItem}
                        onPress={() => onToggleCollection(item.objectID)}
                    >
                        <Image
                            source={
                                item.imageUrl
                                    ? { uri: item.imageUrl }
                                    : require('@/assets/images/placeholderArt.png')
                            }
                            style={styles.collectionThumbnail}
                        />
                        <Text style={styles.collectionTitle}>{item.title}</Text>
                        <View style={styles.checkboxContainer}>
                            {item.isSaved && (
                                <Ionicons name="checkmark" size={20} color="#000" />
                            )}
                        </View>
                    </Pressable>
                )}
                style={styles.collectionsList}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#FF8F8F',
        paddingBottom: 34,
        height: '100%',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 16,
    },
    artworkInfo: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        marginBottom: 16,
        gap: 12,
    },
    artworkImage: {
        width: 60,
        height: 60,
        borderRadius: 4,
    },
    artworkText: {
        flex: 1,
    },
    artworkTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    artworkArtist: {
        fontSize: 14,
        color: '#555',
    },
    createNewButton: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingVertical: 12,
        gap: 8,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        marginHorizontal: 20,
        borderRadius: 8,
        marginBottom: 12,
    },
    createNewText: {
        fontSize: 16,
        fontWeight: '500',
    },
    collectionsList: {
        paddingHorizontal: 20,
    },
    collectionItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 12,
        gap: 12,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        paddingHorizontal: 12,
        borderRadius: 8,
        marginBottom: 8,
    },
    collectionThumbnail: {
        width: 50,
        height: 50,
        borderRadius: 4,
    },
    collectionTitle: {
        flex: 1,
        fontSize: 16,
        fontWeight: '500',
    },
    checkboxContainer: {
        width: 24,
        height: 24,
        borderWidth: 2,
        borderColor: '#000',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
});