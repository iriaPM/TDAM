//CollectionCard.tsx
//This component represents a card for a collection in the collections feed

import React from "react";
import { StyleSheet, View, Pressable, Text, StyleProp, ViewStyle, Dimensions, Image } from "react-native";
import ImageViewer from "./imageViewer";

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
    onUserPress,
}: Props) {

    return (
        <View style={[styles.container]}>
            <View style={[styles.cardContainer, style]}>

                <Pressable onPress={onPress}>
                    <Image
                        source={
                            imageUrl
                                ? { uri: imageUrl }
                                : require("../assets/images/placeholderArt.png")
                        }
                        style={styles.image}
                    />
                </Pressable>

                <View style={styles.infoContainer}>
                    <Pressable onPress={onUserPress} style={styles.userRow}>
                        <ImageViewer
                            imgSource={
                                avatarUrl
                                    ? { uri: avatarUrl }
                                    : require("../assets/images/userPlaceholder.png")
                            }
                            style={styles.avatar}
                        />
                        <Text style={styles.username}>{username}</Text>
                    </Pressable>

                    <Text style={styles.title}>{title}</Text>
                    {time && <Text style={styles.text}>{time}</Text>}
                </View>
            </View>
        </View>
    );
}

// -- styling -- 
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#fff",
        marginBottom: 16,
        marginHorizontal: 16,
    },
    cardContainer: {
        backgroundColor: "#fff",
        borderRadius: 12,
        overflow: "hidden",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    image: {
        width: "100%",
        height: 150
    },
    infoContainer: {
        padding: 12,
        backgroundColor: "#fff",
    },
    userRow: {
        flexDirection: "row",
        alignItems: "center",
        gap: 8,
        marginBottom: 6,
    },
    avatar: {
        width: 30,
        height: 30,
        borderRadius: 12,
    },
    username: {
        fontSize: 13,
        fontWeight: "500",
        color: "#333",
    },
    title: {
        fontSize: 15,
        fontWeight: "600",
        color: "#000",
        marginBottom: 4,
    },
    text: {
        fontSize: 12,
        color: "#666",
    },
});

export default React.memo(TdamCollectionCard);