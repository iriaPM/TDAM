//Registration View -
//screen of the Registration page

import TdamButton from "@/components/Button";
import ImageViewer from "@/components/imageViewer";
import TdamTextInput from "@/components/TextInput";
import LoadingSpinner from "@/components/LoadingSpinner";
import { useRegViewModel } from "../viewmodel/RegistrationViewModel";
import { View, StyleSheet, Dimensions, Text } from "react-native";
import { router } from 'expo-router';

const logo = require("../assets/images/logo.png")
const { height } = Dimensions.get("window"); //get height relative to the screen size 

export default function RegistrationScreen() {
    const { email, setEmail, password, setPassword, username, setUsername, register, error, loading } = useRegViewModel();

    return (
        <View style={styles.container}>
            <LoadingSpinner visible={loading} />

            <ImageViewer
                imgSource={logo}
                style={styles.imageContainer}
            />

            <View style={styles.form}>

                {/*username button*/}
                <TdamTextInput
                    style={styles.input}
                    placeholder="Username"
                    value={username}
                    onChangeText={setUsername}
                    secureText={false}
                />

                {/*email button*/}
                <TdamTextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                    secureText={false}
                />

                {/*password button*/}
                <TdamTextInput
                    style={styles.input}
                    placeholder="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureText={true}
                />

                {/*registration button*/}
                <TdamButton
                    style={styles.button}
                    label="Register"
                    theme="secondary"
                    onPress={register}
                    disabled={loading}
                />
                <TdamButton
                    style={styles.button}
                    label="Log in"
                    theme="primary"
                    onPress={() => router.push('/loginView')}
                    disabled={loading}
                />
                {error && <Text style={styles.errorText}>{error}</Text>}

            </View>

        </View>
    );
}

// -- styling -- 
const styles = StyleSheet.create({
    container: {
        backgroundColor: "#ffffff",
        flex: 1,
        justifyContent: "flex-start",
        alignItems: "center",
        paddingHorizontal: 20,
    },
    input: {
        width: "100%",
        marginBottom: 15,
    },
    button: {
        width: "100%",
        marginTop: 10,
        paddingHorizontal: 16,
    },
    form: {
        width: "100%",
    },
    imageContainer: {
        width: "100%",
        height: height * 0.40,
        resizeMode: "contain",
        marginTop: 30,
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});
