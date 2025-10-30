import { Link, Stack } from "expo-router";
import { Text, View, StyleSheet } from "react-native";

export default function NotFound() {
    return (
        <Stack>
            <Stack.Screen name="index" options={{
                headerTitle: "Oops! Not found",
            }} />
            <View style={styles.container}>
                <Text>Go back to home page!</Text>
                <Link href={"/loginView"} style={styles.button}>
                    Login
                </Link>
            </View>
        </Stack>
    );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: "#eac6f5ff",
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },
    button: {
        fontSize: 20,
        textDecorationLine: "underline",
        color: "#fa0606ff"
    }
});