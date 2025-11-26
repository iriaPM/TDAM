//home.tsx
import { router } from "expo-router";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import TdamArtworkCard from "@/components/ArtworkCard";

const mockImage = require("../../assets/images/StarryNight.png")

const { height, width } = Dimensions.get("window"); //get height relative to the screen size 

export default function home() {

  return (
    <View style={styles.container}>
      <TdamArtworkCard
        title="Starry Night"
        artist="Vincent van Gogh"
        imageUrl={mockImage}
        year="1889"
        movement="Post-Impressionism"
        onPress={() => router.push("/home")}
        style={styles.card}
      />
    </View>
  );
}

// -- styling -- 
const styles = StyleSheet.create({
  container: {
    
  },
  image: {
    
  },
   button: {
   
  },
  card: {
   
  }
});