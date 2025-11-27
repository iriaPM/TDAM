//SearchBar Component - 
//custom searchbar component 

import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, TextInput, Text, Dimensions } from "react-native";
import { View } from "react-native";

const { height, width } = Dimensions.get("window"); //get height/width relative to the screen size 

export default function TdamSearchBar({ }) {
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <View style={styles.container}>
            <TextInput
                placeholder="Search artworks..." 
                placeholderTextColor= "#868383ff"
                onChangeText={setSearchQuery}
                style={styles.input}
            />
            <Ionicons name="search" size={22} color="grey" />
        </View>

    );
}

// -- styling -- 
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#d2d2d2ff",
        borderRadius: 20,
        padding: 10,
        marginInlineStart: 10,
        marginInlineEnd: 10,

    },
    input: {
        fontSize: 11,
        fontWeight: "bold",
        flex: 1,
        marginInlineStart: 10,
        marginInlineEnd: 10,
        color: "black",
    }
});