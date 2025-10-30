import { Link } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function Index() {
  return (
    <View
      style={styles.container}
    >
      <Text>TDAM!</Text>
      <Link href={"/loginView"} style={styles.button}>
      Login 
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#eac6f5ff",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button : {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#d570f4ff"
  }
});