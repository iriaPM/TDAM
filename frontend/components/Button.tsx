// Button Component - 
// This is made so I have a reusable button eg.login screen, reg screen etc
// it contains the label theme and style modifiers or props so I can customise the component in a differnt screen 

import { StyleSheet, View, Pressable, Text, StyleProp, ViewStyle } from "react-native";

type Props = {
    label: string;
    theme?: "primary" | "secondary";
    style?: StyleProp<ViewStyle>;
}

export default function TdamButton({ label, theme }: Props) {
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

// -- styling -- 
const styles = StyleSheet.create({
    buttonContainer: {
        justifyContent: "center",
        width: '100%',
        paddingHorizontal: 16,
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        height: 50,
        borderWidth: 1,
        borderRadius: 4,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: '#f5f5f5',
        borderColor: "#ffffffff"
    },
    defaultButton: {
        backgroundColor: "#FFF1CB",
    },
    primaryButton: {
        backgroundColor: "#FF8F8F",
    },
    secondaryButton: {
        backgroundColor: "#C2E2FA",
    },
    buttonLabel: {
        color: "#000",
        fontSize: 16,
        fontWeight: "600",
    },
    buttonIcon: {
        paddingRight: 8,
    },
});