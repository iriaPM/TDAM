//home.tsx
import { router } from "expo-router";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import ImageViewer from "@/components/imageViewer";

const logo = require("../../assets/images/logo.png")
const { height, width } = Dimensions.get("window"); //get height relative to the screen size 

export default function home() {

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to TDAM!</Text>

      <ImageViewer
        imgSource={logo}
        style={styles.image}
      />
    </View>
  );
}

// -- styling -- 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffff",
    alignItems: "center",
    justifyContent: "flex-start",
    paddingTop: height * 0.1,
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#B7A3E3",
    textAlign: "center",
  },
  image: {
    width: 420,
    height: 420,
    resizeMode: "contain",
    marginBottom: 30,
  },
});