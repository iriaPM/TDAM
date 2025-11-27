//SearchBar Component - 
//custom searchbar component 

import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { StyleSheet, TextInput, Text, Dimensions } from "react-native";
import { View } from "react-native";

const { height, width } = Dimensions.get("window"); //get height/width relative to the screen size 

type Props = {
    onSearch: (query: string) => void;
}

export default function TdamSearchBar({ onSearch }:Props) {
    const [searchQuery, setSearchQuery] = useState("");

    const handleChange = (text: string) => {
        setSearchQuery(text);
        onSearch(text); //call the onSearch prop with the current query
    }

    return (
        <View style={styles.container}>
            <Ionicons name="search" size={22} color="grey" />
            <TextInput
                placeholder="Search..."
                value={searchQuery}
                placeholderTextColor="#828282"
                onChangeText={handleChange}
                onSubmitEditing={() => onSearch(searchQuery)}//search on enter 
                style={styles.input}
                returnKeyType="search"
            />
        </View>
    );
}

// -- styling -- 
const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        alignItems: "center",
        backgroundColor: "#F5F5F5",
        borderRadius: 20,
        padding: 10,
        marginInlineStart: 10,
        marginInlineEnd: 10,
        marginBottom: 5,
    },
    input: {
        fontSize: 13,
        flex: 1,
        marginInlineStart: 10,
        marginInlineEnd: 10,
        color: "black",
    }
});