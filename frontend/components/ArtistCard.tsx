// Artist Component
// Artist card to display all the artworks and information from a specific artist
import React from "react";
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    Pressable,
    Linking,
    Dimensions,
} from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import ImageViewer from "./imageViewer";
import MasonryList from '@react-native-seoul/masonry-list';

const { width } = Dimensions.get("window");

type Artwork = {
    objectID: string;
    title: string;
    artist: string;
    objectDate?: string;
    medium?: string;
    imageUrl?: string;
    isSaved?: boolean;
};

type Props = {
    name: string;
    bio?: string;
    nationality?: string;
    birthYear?: string;
    deathYear?: string;
    wikipediaUrl?: string;
    artworks: Artwork[];
    onArtworkPress?: (id: string) => void;
    onToggleSave?: (id: string) => void;
    onAddToCollection?: (id: string) => void;
};

export default function TdamArtistDetail({
    name,
    bio,
    nationality,
    birthYear,
    deathYear,
    wikipediaUrl,
    artworks,
    onArtworkPress,
}: Props) {
    return (
        <ScrollView style={styles.container}>

            <Text style={styles.name}>{name}</Text>

            <View style={styles.subRow}>
                {nationality && (
                    <>
                        <Ionicons name="location-outline" size={14} />
                        <Text style={styles.subText}>{nationality}</Text>
                    </>
                )}
                {(birthYear || deathYear) && (
                    <>
                        <Ionicons name="calendar-outline" size={14} />
                        <Text style={styles.subText}>
                            {birthYear} {deathYear ? `- ${deathYear}` : ""}
                        </Text>
                    </>
                )}
            </View>

            {bio && (
                <>
                    <Text style={styles.sectionTitle}>Biography</Text>
                    <Text style={styles.bio}>{bio}</Text>
                </>
            )}

            {wikipediaUrl && (
                <Pressable onPress={() => Linking.openURL(wikipediaUrl)}>
                    <Text style={styles.link}>Read more on Wikipedia</Text>
                </Pressable>
            )}

            <Text style={styles.sectionTitle}>Artworks ({artworks.length})</Text>

            <MasonryList
                data={artworks}
                keyExtractor={(item) => item.objectID}
                numColumns={2}
                renderItem={({ item }: { item: any }) => (
                    <Pressable
                        style={styles.masonryItem}
                        onPress={() => onArtworkPress?.(item.objectID)}
                    >
                        <ImageViewer
                            imgSource={item.imageUrl
                                ? { uri: item.imageUrl }
                                : require("@/assets/images/placeholderArt.png")}
                            style={styles.masonryImage}
                        />
                        <Text style={styles.gridTitle} numberOfLines={2}>
                            {item.title}
                        </Text>
                    </Pressable>
                )}
                containerStyle={styles.masonryContainer}
            />

        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
        paddingHorizontal: width * 0.05,
        paddingTop: 20,
    },
    name: {
        fontSize: 24,
        fontWeight: "bold",
    },
    subRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 6,
        marginTop: 6,
    },
    subText: {
        fontSize: 12,
        marginRight: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: "bold",
        marginTop: 20,
        marginBottom: 6,
    },
    bio: {
        fontSize: 13,
    },
    link: {
        color: "#3b82f6",
        marginTop: 6,
        fontSize: 13,
    },
    masonryContainer: {
        paddingBottom: 24,
    },
    masonryItem: {
        paddingHorizontal: 4,
        marginBottom: 4,
    },
    masonryImage: {
        width: "100%",
        borderRadius: 8,
        marginBottom: 4,
    },
    gridTitle: {
        fontSize: 12,
        fontWeight: "600",
        color: "#111",
    },
});