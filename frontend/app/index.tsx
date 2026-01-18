import { router } from "expo-router";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import ImageViewer from "@/components/imageViewer";
import TdamButton from "@/components/Button";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useEffect } from "react";

const logo = require("../assets/images/logo.png")
const { height, width } = Dimensions.get("window"); //get height relative to the screen size 


export default function Index() {
  const buttonRowWidth = width * 0.75;
  const buttonWidth = (buttonRowWidth - 16) / 2;

  //this is to check if the user is logged in
  //and make them go automatically to the home page 
  // useEffect(() => {
  //   const checkToken = async () => {
  //     const token = await AsyncStorage.getItem('userToken');
  //     if (token) {
  //       router.replace('/home');
  //     }
  //   };
  //   checkToken();
  // }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to TDAM!</Text>

      <ImageViewer
        imgSource={logo}
        style={styles.image}
      />

      {/*login button*/}
      <View style={[styles.buttonRow, { width: buttonRowWidth }]}>
        <TdamButton
          style={[{ width: buttonWidth }]}
          label="Login"
          theme="primary"
          //onPress={() => router.push("/loginView")}
          onPress={() => router.push("/home")}
        />

        {/*register button*/}
        <TdamButton
          style={[{ width: buttonWidth }]}
          label="Register"
          theme="secondary"
          onPress={() => router.push("/registrationView")}
        />
      </View>
    </View>
  );
}

// -- styling -- 
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#ffffffff",
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
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
});