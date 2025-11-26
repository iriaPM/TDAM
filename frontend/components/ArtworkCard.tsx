// ArtworkCard Component - 
// Artword card to display all the artworks from the Museums

import { StyleSheet, View, Pressable, Text, StyleProp, ViewStyle } from "react-native";
import ImageViewer from "./imageViewer";

type Props = {
    style?: StyleProp<ViewStyle>;
    title: string;
    artist: string;
    imageUrl: string;
    year: string;
    movement: string;
    onPress?: () => void;

}

export default function TdamArtworkCard({ style, title, artist, imageUrl, year, movement, onPress }: Props) {

    <View style={[styles.cardContainer, style]}>
        <Text style={styles.title}>{title}</Text>
        <ImageViewer
            imgSource={imageUrl}
            style={styles.image}
        />
        <Text style={styles.card}>{artist}</Text>
        <Text style={styles.card}>{year}</Text>
        <Text style={styles.card}>{movement}</Text>
    </View>
    return null;
}

// -- styling -- 
const styles = StyleSheet.create({
    cardContainer: {
        justifyContent: "center",
    },
    title: {
        fontSize: 18,
        marginBottom: 8,
    },
    card: {
        alignItems: "center",
        justifyContent: "center",
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: '#f5f5f5',
        borderColor: "#ffffffff"
    },
    saveIcon: {
        paddingRight: 8,
    },
    image: {
        width: 420,
        height: 420,
        resizeMode: "contain"
    }
});