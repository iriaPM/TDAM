import { StyleSheet, View, Pressable, Text } from "react-native";

type Props = {
    label: string;
    theme?: "primary" | "secondary";
}

export default function Button({ label, theme }: Props) {
    if (!theme) {
        return (
            <View style={styles.buttonContainer}>
                <Pressable
                    style={styles.button}
                    onPress={() => alert("You pressed a button")}
                >
                    <Text style={styles.buttonLabel}>{label}</Text>
                </Pressable>
            </View>
        );
    }
    if (theme === "primary") {
        return (
            <View style={styles.buttonContainer}>
                <Pressable
                    style={[styles.button, styles.primaryButton]}
                    onPress={() => alert("You pressed the PRIMARY button")}
                >
                    <Text style={styles.buttonLabel}>{label}</Text>
                </Pressable>
            </View>
        );
    }
    if (theme === "secondary") {
        return (
            <View style={styles.buttonContainer}>
                <Pressable
                    style={[styles.button, styles.secondaryButton]}
                    onPress={() => alert("You pressed the SECONDARY button")}
                >
                    <Text style={styles.buttonLabel}>{label}</Text>
                </Pressable>
            </View>
        );
    }
    return null;
}

const styles = StyleSheet.create({
    buttonContainer: {
        width: 320,
        height: 68,
        marginHorizontal: 20,
        alignItems: "center",
        justifyContent: "center",
        padding: 3,
    },
    button: {
        borderRadius: 10,
        width: "100%",
        height: "100%",
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        borderWidth: 2,
    },
    defaultButton: {
        backgroundColor: "#f0f0f0",
        borderColor: "#000",
    },
    primaryButton: {
        backgroundColor: "#f8c8c8",
        borderColor: "#a33",
        borderWidth: 6,
    },
    secondaryButton: {
        backgroundColor: "#a7d8ff",
        borderColor: "#005",
        borderWidth: 6,
    },
    buttonLabel: {
        color: "#000",
        fontSize: 16,
        fontWeight: "600",
    },
    circleContainer: {
        alignItems: "center",
        justifyContent: "center",
    },
    buttonIcon: {
        paddingRight: 8,
    },
});