// ArtworkCard Component - 
// Artword card to display all the artworks from the Museums

import { StyleSheet, View, Pressable, Text, StyleProp, ViewStyle, Dimensions } from "react-native";
import ImageViewer from "./imageViewer";

const { height, width } = Dimensions.get("window"); //get height/width relative to the screen size 

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
    },
    image: {
        width: 320,
        height: 320,
    }
});