import { Link } from "expo-router";
import { View, StyleSheet } from "react-native";
import { Image } from "expo-image";
import ImageViewer from "@/components/imageViewer";
import Button from "@/components/Button";

const PlaceholderImage = require("../../assets/images/placeholderArt.png")

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <ImageViewer imgSource={PlaceholderImage} />
      </View>
      <Link href="/loginView" style={styles.button}>
        Login
      </Link>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffffff",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#C2E2FA"
  },
  imageContainer: {
    flex: 1
  }
});