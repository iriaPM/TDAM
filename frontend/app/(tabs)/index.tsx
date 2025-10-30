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
    backgroundColor: "#FFF1CB",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  button : {
    fontSize: 20,
    textDecorationLine: "underline",
    color: "#C2E2FA"
  }
});