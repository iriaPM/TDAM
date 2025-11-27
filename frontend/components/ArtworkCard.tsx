// ArtworkCard Component - 
// Artword card to display all the artworks from the Museums

import { StyleSheet, View, Pressable, Text, StyleProp, ViewStyle, Dimensions } from "react-native";
import ImageViewer from "./imageViewer";
import Ionicons from '@expo/vector-icons/Ionicons';
const { height, width } = Dimensions.get("window"); //get height/width relative to the screen size 

type Props = {
    style?: StyleProp<ViewStyle>;
    title: string;
    artist: string;
    imageUrl?: any;
    year: string;
    movement: string;
    onPress?: () => void;
    isSaved?: boolean;
    onSave?: () => void;
}

export default function TdamArtworkCard({ style, title, artist, imageUrl, year, movement, onPress, isSaved, onSave }: Props) {
    return (
        <View style={[styles.cardContainer, style]}>
            <Text style={styles.title}>{title}</Text>
            <ImageViewer
                imgSource={imageUrl}
                style={styles.image}
            />
            <View>
                <Text style={styles.text}>{artist}, {year}, {movement}</Text>
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
    );
}

// -- styling -- 
const styles = StyleSheet.create({
    cardContainer: {
        paddingHorizontal: width * 0.050,
        justifyContent: "center",
        alignItems: "flex-start",
        gap: 2,
        backgroundColor: "#ffffffff",
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
        gap: 4,
    },
    image: {
        width: 320,
        height: 320,
    }
});