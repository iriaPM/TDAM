import { HeaderShownContext, HeaderTitle } from "@react-navigation/elements";
import { Stack } from "expo-router";

export default function RootLayout() {
  return (
    <Stack>
      <Stack.Screen name="index" options={{
        headerTitle: "TDAM!: The Digital Art Museum",
      }} />
      <Stack.Screen name="loginView" options={{
        headerTitle: "Welcome!",
      }} />
    </Stack>
  );
}
