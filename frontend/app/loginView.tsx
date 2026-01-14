//loginView.tsx 
//Login View/Screen - 
//"Dummy" screen of the Login page

import TdamButton from "@/components/Button";
import TdamTextInput from "@/components/TextInput";
import LoadingSpinner from "@/components/LoadingSpinner";
import React from "react";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import ImageViewer from "@/components/imageViewer";
import { useLoginViewModel } from "../viewmodel/LoginViewModel";

const logo = require("../assets/images/logo.png")
const { height } = Dimensions.get("window"); //get height relative to the screen size 

export default function LoginView() {
  const { identifier, setIdentifier, password, setPassword, login, error, loading } = useLoginViewModel();

  return (
    <View style={styles.container}>
      <LoadingSpinner visible={loading} />

      <ImageViewer
        imgSource={logo}
        style={styles.imageContainer}
      />

      <View style={styles.form}>

        {/*email button*/}
        <TdamTextInput
          style={styles.input}
          placeholder="Email or Username"
          value={identifier}
          onChangeText={setIdentifier}
        />

        {/*password button*/}
        <TdamTextInput
          style={styles.input}
          placeholder="Password"
          value={password}
          onChangeText={setPassword}
          secureText
        />

        {/*login button*/}
        <TdamButton
          style={styles.button}
          label="Log in"
          theme="primary"
          onPress={login}
          disabled={loading}
        />
        {error && <Text style={styles.errorText}>{error}</Text>}

      </View>

    </View>
  );
}

// -- styling -- 
const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    flex: 1,
    justifyContent: "flex-start",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  input: {
    width: "100%",
    marginBottom: 15,
  },
  button: {
    width: "100%",
    marginTop: 10,
    paddingHorizontal: 16
  },
  form: {
    width: "100%",
  },
  imageContainer: {
    width: "100%",
    height: height * 0.40,
    resizeMode: "contain",
    marginTop: 30,
  },
  errorText: {
    color: 'red',
    marginBottom: 10,
  },
});
