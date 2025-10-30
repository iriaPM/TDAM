import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";
import { Image } from "expo-image";

const PlaceholderImage = require("../../assets/images/placeholderArt.png")

export default function Index() {
  return (
    <View style={styles.container}>
      <View style={styles.imageContainer}>
        <Image source={PlaceholderImage} style={styles.image} />
      </View>
      <Link href="/loginView" style={styles.button}>
        Login
      </Link>
    </View>
  );
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#FFF1CB",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button: {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#C2E2FA"
  },
  image: {

  },
  imageContainer: {
    flex: 1
  }
});