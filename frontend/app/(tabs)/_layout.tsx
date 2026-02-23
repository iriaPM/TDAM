//layout inside  
//I use this to  manage the main tabs/navigation in the app

import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons"
import MaterialCommunityIcons from '@expo/vector-icons/MaterialCommunityIcons';
import MaterialIcons from '@expo/vector-icons/MaterialIcons';

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
                    tabBarLabel: "Home",
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
                    tabBarLabel: "Art",
                    tabBarIcon: ({ color }) =>
                        <MaterialCommunityIcons
                            name={"image-frame"}
                            size={24}
                            color={color}
                        />
                }} />
            <Tabs.Screen
                name="CollectionsFeedView"
                options={{
                    headerShown: false,
                    tabBarLabel: "Collections",
                    tabBarIcon: ({ color }) =>
                        <MaterialIcons name="collections" size={24} color={color} />
                }} />
            <Tabs.Screen
                name="MyUserProfile"
                options={{
                    headerShown: false,
                    tabBarLabel: "Profile",
                    tabBarIcon: ({ color }) =>
                        <Ionicons name="person" size={24} color={color} />
                }} />
        </Tabs>
    );
}
