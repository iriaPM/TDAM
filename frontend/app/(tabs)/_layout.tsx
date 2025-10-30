import { HeaderShownContext, HeaderTitle } from "@react-navigation/elements";
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons"

export default function TabsLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#FF8F8F",
                headerStyle: {
                    backgroundColor: "#ffffffff",
                },
                headerShadowVisible: false,
                headerTintColor: "#000000ff",
                tabBarStyle: {
                    backgroundColor: "#ffffffff"
                }
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    headerTitle: "TDAM! The Digital Art Museum",
                    tabBarIcon: ({ focused, color }) => <Ionicons
                        name={focused ? "home-sharp" : "home-outline"}
                        color={color}
                        size={24} />
                }} />
            <Tabs.Screen
                name="loginView"
                options={{
                    headerTitle: "Log in",
                }} />
            <Tabs.Screen
                name="registrationView"
                options={{
                    headerTitle: "Register",
                }} />

        </Tabs>
    );
}
