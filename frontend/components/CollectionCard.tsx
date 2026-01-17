//CollectionCard.tsx
//This component represents a card for a collection in the collections feed

import React from "react";
import { StyleSheet, View, Pressable, Text, StyleProp, ViewStyle, Dimensions, Image } from "react-native";
import ImageViewer from "./imageViewer";
import Ionicons from '@expo/vector-icons/Ionicons';
const { height, width } = Dimensions.get("window"); //get height/width relative to the screen size 

type Props = {
    style?: StyleProp<ViewStyle>;
    title: string;
    username: string;
    imageUrl?: any;
    time?: string;
    description?: string;
    avatarUrl?: string;
    onPress?: () => void;
    isSaved?: boolean;
    onSave?: () => void;
}

function TdamCollectionCard({ style, title, username, imageUrl, avatarUrl, time, description, onPress, isSaved, onSave }: Props) {

    return (
        <View style={[styles.containter]}>
            <View style={[styles.cardContainer, style]}>

                <View style={[styles.titleRow, style]}>
                    <ImageViewer
                        imgSource={imageUrl ? { uri: imageUrl } : require("../assets/images/userPlaceholder.png")}
                        style={styles.avatar}
                    />
                    <Text style={styles.username}>{username}</Text>
                    <Text style={styles.title}>{title}</Text>
                </View>
                <View>
                    <Text style={styles.text}>
                        {[time].filter(Boolean).join(", ")}
                    </Text>
                </View>
                <ImageViewer
                    imgSource={imageUrl ? { uri: imageUrl } : require("../assets/images/placeholderArt.png")}
                    style={styles.image}
                />
                <View>
                    <Text style={styles.text}>
                        {[description].filter(Boolean).join(", ")}
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
                    <Text style={styles.text}> {isSaved ? "Saved" : "Save collection"}</Text>
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
        marginVertical: 20,
    },
    title: {
        fontSize: 12,
    },
    username: {
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
    avatar: {
        width: 30,
        height: 30,
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 3,
    },
});

export default React.memo(TdamCollectionCard);