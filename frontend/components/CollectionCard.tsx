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
    onUserPress?: () => void;
}

function TdamCollectionCard({
    style,
    title,
    username,
    imageUrl,
    avatarUrl,
    time,
    description,
    onPress,
    isSaved,
    onSave,
    onUserPress,
}: Props) {

    return (
        <View style={[styles.containter]}>
            <View style={[styles.cardContainer, style]}>

                <View style={styles.headerRow}>
                    <Pressable onPress={onUserPress}>
                        <ImageViewer
                            imgSource={
                                avatarUrl
                                    ? { uri: avatarUrl }
                                    : require("../assets/images/userPlaceholder.png")
                            }
                            style={styles.avatar}
                        />
                    </Pressable>

                    <View style={styles.headerText}>
                        <Pressable onPress={onUserPress}>
                            <Text style={styles.username}>{username}</Text>
                        </Pressable>

                        <Text style={styles.title}>{title}</Text>
                        {time && <Text style={styles.text}>{time}</Text>}
                    </View>
                </View>

                <Pressable onPress={onPress}>
                    <ImageViewer
                        imgSource={
                            imageUrl
                                ? { uri: imageUrl }
                                : require("../assets/images/placeholderArt.png")
                        }
                        style={styles.image}
                    />
                </Pressable>

                <View>
                    <Text style={styles.text}>
                        {[description].filter(Boolean).join(", ")}
                    </Text>
                </View>
                <View style={styles.saveIcon}>
                    <Pressable onPress={onSave}>
                        <Ionicons
                            name={isSaved ? "heart-sharp" : "heart-outline"}
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
        gap: 5,
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
        fontSize: 12,
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
    headerRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 10,
        paddingBottom: 5,
    },

    headerText: {
        flexDirection: "column",
        justifyContent: "center",
    },

    avatar: {
        width: 36,
        height: 36,
        borderRadius: 18,
    },
    titleRow: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        gap: 3,
    },
});

export default React.memo(TdamCollectionCard);