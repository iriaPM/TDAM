import { Text, View, StyleSheet } from "react-native";

export default function LoginScreen() {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Log in</Text>
        </View>
    )
}


const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffffff",
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  text: {
    color: "#000000",
  }
});