import TdamButton from "@/components/Button";
import TdamTextInput from "@/components/TextInput";
import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";

export default function LoginScreen() {
  const [text, setText] = useState("");

  return (
    <View style={styles.container}>
      <Text style={styles.text}>Log in</Text>
      <Text style={styles.text}>Email:</Text>
      <TdamTextInput
        placeholder="Enter email here"
        value={text}
        onChangeText={setText}
      />
      <TdamButton label="Primary" theme="primary" />

      <Text style={styles.preview}>You typed: {text}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  text: {
    color: "#000",
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  preview: {
    color: "#333",
    fontSize: 16,
    marginTop: 10,
  },
});
