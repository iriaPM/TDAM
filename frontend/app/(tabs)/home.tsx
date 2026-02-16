//home.tsx
import { View, StyleSheet, Dimensions, Text } from "react-native";
import ImageViewer from "@/components/imageViewer";
import TdamButton from "@/components/Button";
import { logout } from "../../utils/logout";
import { useEffect, useRef, useState } from "react";
import RBSheet from 'react-native-raw-bottom-sheet';
import PreferenceSurveyBottomsheet from "@/components/PreferenceSurveyBottomsheet";
import { getUserProfile, submitUserPreferences } from "@/services/api";

const logo = require("../../assets/images/logo.png")
const { height, width } = Dimensions.get("window"); //get height relative to the screen size 

export default function home() {
  const PrefSheetRef = useRef<any>(null);

  useEffect(() => {
    const checkSurveyStatus = async () => {
      try {
        const user = await getUserProfile();

        if (!user.hasCompletedSurvey) {
          PrefSheetRef.current?.open();
        }
      } catch (error) {
        console.log("Failed to check survey status");
      }
    };

    checkSurveyStatus();
  }, []);

  const handleSubmit = async (preferences: any) => {
    try {
      await submitUserPreferences(preferences);
      PrefSheetRef.current?.close();

    } catch (error) {
      console.log("Failed to submit preferences");
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Welcome to TDAM!</Text>
      <TdamButton
        style={styles.button}
        label="Log out"
        theme="primary"
        onPress={logout}
      />
      <ImageViewer
        imgSource={logo}
        style={styles.image}
      />
      <RBSheet
        ref={PrefSheetRef}
        height={866}
        draggable={false}
        dragOnContent={false}
        customStyles={{
          wrapper: styles.BSwrapper,
          container: styles.BScontainerAdd,
          //draggableIcon: styles.BSdraggableIcon
        }}
      >
        <PreferenceSurveyBottomsheet
          onSubmit={handleSubmit}
        />
      </RBSheet>
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
  button: {
    width: "100%",
    marginTop: 10,
    paddingHorizontal: 16
  },
  BSwrapper: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  BScontainerAdd: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    backgroundColor: '#FF8F8F',
  },
});