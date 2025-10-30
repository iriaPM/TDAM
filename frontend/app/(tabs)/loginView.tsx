import TdamButton from "@/components/Button";
import TdamTextInput from "@/components/TextInput";
import React, { useState } from "react";
import { Text, View, StyleSheet } from "react-native";

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>
      <TdamTextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
      />
      <TdamTextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
      />
      <TdamButton style={styles.button} label="Login" theme="primary" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
    paddingHorizontal: 20,
  },
  input: {
    width: "100%",
    marginBottom: 15,
  },
  button: {
    width: "100%",
    marginTop: 10,
  },
});
