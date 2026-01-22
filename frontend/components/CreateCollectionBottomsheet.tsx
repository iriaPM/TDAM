//CreateCollectionBottomsheet.tsx
//This component represents the bottom sheet for creating a new collection

import React from 'react';
import {
    View,
    Text,
    StyleSheet,
} from 'react-native';
import TdamTextInput from "./TextInput";
import TdamButton from "./Button";

interface CreateCollectionBottomsheetProps {
    name: string;
    description: string;
    loading?: boolean;
    error?: string | null;
    submitLabel?: string;
    title?: string;
    onChangeName: (name: string) => void;
    onChangeDescription: (description: string) => void;
    onSubmit: () => void;
}


export default function CreateCollectionBottomsheet({
    name,
    description,
    loading,
    error,
    onChangeName,
    onChangeDescription,
    onSubmit,
    submitLabel,
    title
}: CreateCollectionBottomsheetProps) {

    return (
        <View style={styles.container}>
            {/* Header */}
            <Text style={styles.headerTitle}>{title ?? ""}</Text>

            <View style={styles.form}>

                {/*name button*/}
                <TdamTextInput
                    style={styles.input}
                    placeholder="Name of the collection"
                    value={name}
                    onChangeText={onChangeName}
                    maxLength={50}
                />

                {/*description button*/}
                <TdamTextInput
                    style={styles.input}
                    placeholder="Description"
                    value={description}
                    onChangeText={onChangeDescription}
                    multiline={true}
                    maxLength={500}
                />

                {/*submit button*/}
                <TdamButton
                    style={styles.button}
                    label={submitLabel ?? ""}
                    theme="tertiary"
                    onPress={onSubmit}
                    disabled={loading}
                />
                {error && <Text style={styles.errorText}>{error}</Text>}

            </View>
        </View>
    );
}


const styles = StyleSheet.create({
    container: {
        backgroundColor: '#C2E2FA',
        paddingBottom: 34,
        height: '100%',
    },
    headerTitle: {
        fontSize: 18,
        fontWeight: '600',
        textAlign: 'center',
        marginTop: 16,
        marginBottom: 16,
        paddingBottom: 16
    },
    input: {
        width: "100%",
        marginBottom: 15,
    },
    button: {
        width: "100%",
        marginTop: 10,
        paddingHorizontal: 16,
        paddingTop:20,
    },
    form: {
        width: "100%",
    },
    errorText: {
        color: 'red',
        marginBottom: 10,
    },
});