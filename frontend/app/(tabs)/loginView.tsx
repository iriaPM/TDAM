//Login View/Screen - 
//"Dummy" screen of the Login page

import TdamButton from "@/components/Button";
import TdamTextInput from "@/components/TextInput";
import React, { useState } from "react";
import { View, StyleSheet, Dimensions } from "react-native";
import ImageViewer from "@/components/imageViewer";

const logo = require("../../assets/images/logo.png")
const { height } = Dimensions.get("window"); //get height relative to the screen size 

export default function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <View style={styles.container}>

      <ImageViewer
        imgSource={logo}
        style={styles.imageContainer}
      />

      <View style={styles.form}>
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
        <TdamButton style={styles.button} label="Log in" theme="primary" />
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
    },
    form: {
        width: "100%",
        marginTop: height * 0.25,
    },
    imageContainer: {
        position: "absolute",
        top: -30,
        width: "100%",
        height: height * 0.34,
        resizeMode: "contain",
    }
});
