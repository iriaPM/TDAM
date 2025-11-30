//layout inside  
//I use this to  manage the main tabs/navigation in the app

import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';

export default function TabsLayout() {
    return (
        <Tabs
            //styling
            screenOptions={{
                headerShown: false,
                tabBarActiveTintColor: "#FF8F8F",
                tabBarStyle: {
                    backgroundColor: "#ffffffff"
                },
            }}
        >
            {/*bottom tabs*/}
            <Tabs.Screen
                name="home"
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused, color }) =>
                        <Ionicons
                            name={focused ? "home-sharp" : "home-outline"}
                            color={color}
                            size={24}
                        />
                }} />
            <Tabs.Screen
                name="ArtworkFeedView"
                options={{
                    headerShown: false,
                    tabBarIcon: ({ focused, color }) =>
                        <MaterialCommunityIcons
                            name={focused ? "image-filter-frames" : "image-frame"}
                            size={24}
                            color={color}
                        />
                }} />
        </Tabs>
    );
}
