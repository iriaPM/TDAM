// ArtworkCard Component - 
// Artword card to display all the artworks from the Museums

import React from "react";
import { StyleSheet, View, Pressable, Text, StyleProp, ViewStyle, Dimensions, Image } from "react-native";
import ImageViewer from "./imageViewer";
import Ionicons from '@expo/vector-icons/Ionicons';
const { height, width } = Dimensions.get("window"); //get height/width relative to the screen size 

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
}

function TdamArtworkCard({ style, title, artist, imageUrl, year, movement, onPress, isSaved, onSave }: Props) {

    return (
        <View style={[styles.containter]}>
            <View style={[styles.cardContainer, style]}>
                <Text style={styles.title}>{title}</Text>
                <ImageViewer
                    imgSource={imageUrl ? { uri: imageUrl } : require("../assets/images/placeholderArt.png")}
                    style={styles.image}
                />
                <View>
                    <Text style={styles.text}>
                        {[artist, year, movement].filter(Boolean).join(", ")}
                    </Text>
                </View>
                <View style={styles.saveIcon}>
                    <Pressable onPress={onSave}>
                        <Ionicons
                            name={isSaved ? "add-circle" : "add-circle-outline"}
                            size={24}
                            color="black"
                        />
                    </Pressable>
                    <Text style={styles.text}> {isSaved ? "Saved" : "Add to collection"}</Text>
                </View>
            </View>
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
    }
});

export default React.memo(TdamArtworkCard);