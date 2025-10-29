import { useHeaderHeight } from '@react-navigation/elements';
import React, { memo } from 'react';
import { TouchableOpacity, StyleSheet } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

type Props = {
    goBack: () => void;
}

const BackButton = ({ goBack }: Props) => {
    const headerHeight = useHeaderHeight();

    return (
        <TouchableOpacity
            onPress={goBack}
            style={[styles.container, { top: headerHeight + 10 }]} 
        >
            <Ionicons name="arrow-back" size={24} color="black" />
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        left: 10,
        padding: 8,
        zIndex: 1,
    },
});

export default memo(BackButton);