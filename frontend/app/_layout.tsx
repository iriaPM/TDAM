import { HeaderShownContext, HeaderTitle } from "@react-navigation/elements";
import { Stack } from "expo-router";
import { StatusBar } from "expo-status-bar";
import { LogBox } from "react-native";

LogBox.ignoreAllLogs(true);

export default function RootLayout() {
  return (
    <>
      <StatusBar style="light"></StatusBar>
      <Stack>
        <Stack.Screen name="(tabs)" options={{
          headerShown: false,
        }} />
        <Stack.Screen name="loginView" />
      </Stack>
    </>
  );
}
