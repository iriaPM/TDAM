// TextInput Component - 
// This is made so I have a reusable text input eg.login screen, reg screen etc
// it contains the placeholder value   input text and style  props so I can customise the component in a differnt screen 


import React from 'react';
import { TextInput, StyleSheet, View, StyleProp, TextStyle, ViewStyle } from 'react-native';

interface TdamTextInputProps {
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    style?: StyleProp<TextStyle>;
    containerStyle?: StyleProp<ViewStyle>;
    secureText?: boolean;
    multiline?: boolean;
    maxLength?: number;
}

const TdamTextInput = ({
    placeholder = 'placeholder text',
    value = '',
    onChangeText = () => { },
    style,
    containerStyle,
    secureText,
    multiline = false,
    maxLength,
}: TdamTextInputProps) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <TextInput
                style={[styles.input, style]}
                placeholder={placeholder}
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureText}
                multiline={true}
                maxLength={500}
            />
        </View>
    );
};

// -- styling -- 
const styles = StyleSheet.create({
    container: {
        width: '100%',
        paddingHorizontal: 16,
    },
    input: {
        height: 50,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        paddingHorizontal: 16,
        fontSize: 16,
        backgroundColor: '#f5f5f5',
        color: '#333',
    },
});

export default TdamTextInput;
