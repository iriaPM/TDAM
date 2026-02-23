// ArtworkCard Component - 
// Artword card to display all the artworks from the Museums

import React from "react";
import { StyleSheet, View, Pressable, Text, StyleProp, ViewStyle, Dimensions, Image } from "react-native";
import ImageViewer from "./imageViewer";
import Ionicons from '@expo/vector-icons/Ionicons';
const { height, width } = Dimensions.get("window"); //get height/width relative to the screen size 
const SMALL_CARD_SIZE = width * 0.42;

type Props = {
    style?: StyleProp<ViewStyle>;
    title: string;
    artist: string;
    imageUrl?: any;
    year?: string;
    movement?: string;
    onPress?: () => void;
    isSaved?: boolean;
    onSave?: () => void;
    onAddToCollection?: () => void;
    onArtistPress?: () => void;
    size?: "small" | "large";
}

function TdamArtworkCard({ style, title, artist, imageUrl, year, movement, onPress, isSaved, onSave, onAddToCollection, onArtistPress, size }: Props) {
    if (size === "small") {
        return (
            <Pressable style={[styles.smallContainer, style]} onPress={onPress}>
                <ImageViewer
                    imgSource={imageUrl ? { uri: imageUrl } : require("../assets/images/placeholderArt.png")}
                    style={styles.smallImage}
                />
                <Text style={styles.smallTitle} numberOfLines={2}>{title}</Text>
            </Pressable>
        );
    }
    return (
        <View style={[styles.containter]}>
            <Pressable onPress={onPress}>
                <View style={[styles.cardContainer, style]}>
                    <Text style={styles.title}>{title}</Text>
                    <ImageViewer
                        imgSource={imageUrl ? { uri: imageUrl } : require("../assets/images/placeholderArt.png")}
                        style={styles.image}
                    />
                    <View>
                        <Pressable onPress={onArtistPress}>
                            <Text style={styles.text}>
                                {[artist, year, movement].filter(Boolean).join(", ")}
                            </Text>
                        </Pressable>
                    </View>
                    <View style={styles.saveIcon}>
                        <Pressable onPress={onSave}>
                            <Ionicons
                                name={isSaved ? "heart" : "heart-outline"}
                                size={24}
                                color="black"
                            />
                        </Pressable>
                        <Pressable onPress={onAddToCollection}>
                            <Ionicons
                                name={"add-circle-outline"}
                                size={24}
                                color="black"
                            />
                        </Pressable>
                        <Text style={styles.text}> {isSaved ? "Saved" : "Add to collection"}</Text>
                    </View>
                </View>
            </Pressable>
            <View style={styles.separator} />
        </View>
    );
}

// -- styling -- 
const styles = StyleSheet.create({
    containter: {
        backgroundColor: "#ffffffff",
        width: width,
    },
    cardContainer: {
        paddingHorizontal: width * 0.050,
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 2,
        backgroundColor: "#ffffffff",
    },
    separator: {
        height: 1,
        backgroundColor: "#ccc",
        width: "100%",
        marginVertical: 15,
    },
    title: {
        fontSize: 12,
        fontWeight: "bold",
    },
    text: {
        fontSize: 11,
    },
    saveIcon: {
        flexDirection: "row",
        alignItems: "center",
        gap: 2,
    },
    image: {
        width: width * 0.9,
        height: undefined,
    },
    smallContainer: {
        width: SMALL_CARD_SIZE,
        backgroundColor: "#fff",
    },
    smallImage: {
    width: SMALL_CARD_SIZE,
    height: SMALL_CARD_SIZE,
    borderRadius: 8,
    backgroundColor: "#eee",
    resizeMode: "cover",
},
    smallTitle: {
        fontSize: 12,
        fontWeight: "600",
        marginTop: 4,
        color: "#111",
    },
    smallArtist: {
        fontSize: 11,
        color: "#555",
        marginTop: 2,
    },
    smallMeta: {
        fontSize: 10,
        color: "#888",
    },
    smallActions: {
        flexDirection: "row",
        gap: 8,
        marginTop: 4,
    },
});

export default React.memo(TdamArtworkCard);