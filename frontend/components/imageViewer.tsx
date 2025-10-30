import { StyleSheet, StyleProp, ImageStyle } from 'react-native';
import { Image } from "expo-image";

type Props = {
    imgSource: any;
    style?: StyleProp<ImageStyle>;
}

export default function ImageViewer({ imgSource, style }: Props) {
    return <Image source={imgSource} style={[styles.image, style]}></Image>
}

const styles = StyleSheet.create({
    image: {
        resizeMode: "contain",
    },
});