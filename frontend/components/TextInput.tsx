import React from 'react';
import { TextInput, StyleSheet, View, StyleProp, TextStyle, ViewStyle } from 'react-native';

interface TdamTextInputProps {
    placeholder?: string;
    value?: string;
    onChangeText?: (text: string) => void;
    style?: StyleProp<TextStyle>; 
    containerStyle?: StyleProp<ViewStyle>; 
}

const TdamTextInput = ({
    placeholder = 'placeholder text',
    value = '',
    onChangeText = () => { },
    style,
    containerStyle,
}: TdamTextInputProps) => {
    return (
        <View style={[styles.container, containerStyle]}>
            <TextInput
                style={[styles.input, style]} 
                placeholder={placeholder}
                placeholderTextColor="#999"
                value={value}
                onChangeText={onChangeText}
            />
        </View>
    );
};

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
