//layout file - 
//I use this to  manage the main tabs/navigation in the app

import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TabsLayout() {
    return (
        <Tabs
            //styling
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
                name="home"
                options={{
                    headerTitle: "",
                    tabBarIcon: ({ focused, color }) => <Ionicons
                        name={focused ? "home-sharp" : "home-outline"}
                        color={color}
                        size={24} />
                }} />
            <Tabs.Screen
                name="ArtworkFeedView"
                options={{
                    headerTitle: "",
                    tabBarIcon: ({ focused, color }) => <MaterialCommunityIcons name={focused ? "image-filter-frames" : "image-frame"} size={24} color={color} />
                }} />
        </Tabs>
    );
}
