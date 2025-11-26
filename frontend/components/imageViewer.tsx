// Image Viewer Component - 
// This is made so I have a reusable image viewer component eg.login screen, reg screen etc
// it contains the source and style  props so I can customise the component in a differnt screen 

import { StyleSheet, StyleProp, ImageStyle } from 'react-native';
import { Image } from "expo-image";

type Props = {
    imgSource: any;
    style?: StyleProp<ImageStyle>;
}

export default function ImageViewer({ imgSource, style }: Props) {
    return <Image source={imgSource} style={style} contentFit="cover"></Image>
}