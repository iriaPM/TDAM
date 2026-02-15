// Image Viewer Component - 
// This is made so I have a reusable image viewer component eg.login screen, reg screen etc
// it contains the source and style  props so I can customise the component in a differnt screen 

import { Image } from "expo-image";
import { useState } from "react";
import { StyleProp, ImageStyle } from "react-native";

type Props = {
    imgSource: any;
    style?: StyleProp<ImageStyle>;
}

export default function ImageViewer({ imgSource, style }: Props) {
    const [aspect, setAspect] = useState(1);

    return (
        <Image
            source={imgSource || require("@/assets/images/placeholderArt.png")}
            style={[style, { aspectRatio: aspect }]}
            contentFit="cover"
            onLoad={({ source }) => {
                if (source?.width && source?.height) {
                    setAspect(source.width / source.height);
                }
            }}
        />
    );
}
