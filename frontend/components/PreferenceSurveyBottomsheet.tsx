//preferencesurveybottomsheet.tsx
//This component represents the bottom sheet for gathering user preferences to feed the ml recomendation model

import React, { useState } from 'react';
import {
    View,
    Text,
    Pressable,
    StyleSheet,
    ScrollView,
} from 'react-native';
import TdamButton from './Button';

interface PreferenceSurveyBottomsheetProps {
    onSubmit: () => void;
}

export default function PreferenceSurveyBottomsheet({ onSubmit }: PreferenceSurveyBottomsheetProps) {
    const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
    const [selectedMovements, setSelectedMovements] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState<string[]>([]);

    const artStyles = [
        'Realism', 'Abstract', 'Impressionism', 'Expressionism',
        'Surrealism', 'Minimalism', 'Pop Art', 'Cubism'
    ];

    const artMovements = [
        'Renaissance', 'Baroque', 'Modernism', 'Contemporary',
        'Art Deco', 'Bauhaus', 'Dadaism', 'Futurism'
    ];

    const categories = [
        'Portraits', 'Landscapes', 'Still Life', 'Abstract',
        'Sculpture', 'Photography', 'Architecture', 'Street Art'
    ];

    const favoriteArtists = [
        'Leonardo da Vinci', 'Van Gogh', 'Picasso', 'Monet', 'Goya'
    ];

    const timePeriods = [
        'Ancient', 'Medieval', 'Renaissance', 'Baroque', '18th Century', '19th Century', 'Modern', 'Contemporary'
    ]

    const toggleSelection = (item: string, selected: string[], setSelected: (items: string[]) => void) => {
        if (selected.includes(item)) {
            setSelected(selected.filter(i => i !== item));
        } else {
            setSelected([...selected, item]);
        }
    };

    const renderButton = (item: string, selected: string[], setSelected: (items: string[]) => void) => {
        const isSelected = selected.includes(item);
        return (
            <Pressable
                key={item}
                style={[styles.button, isSelected && styles.buttonSelected]}
                onPress={() => toggleSelection(item, selected, setSelected)}
            >
                <Text style={[styles.buttonText, isSelected && styles.buttonTextSelected]}>
                    {item}
                </Text>
            </Pressable>
        );
    };

    return (
        <ScrollView style={styles.container} contentContainerStyle={styles.contentContainer}>
            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Art Styles</Text>
                <View style={styles.buttonGrid}>
                    {artStyles.map(style => renderButton(style, selectedStyles, setSelectedStyles))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Art Movements</Text>
                <View style={styles.buttonGrid}>
                    {artMovements.map(movement => renderButton(movement, selectedMovements, setSelectedMovements))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Categories</Text>
                <View style={styles.buttonGrid}>
                    {categories.map(category => renderButton(category, selectedCategories, setSelectedCategories))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Favorite Artists</Text>
                <View style={styles.buttonGrid}>
                    {favoriteArtists.map(artist => renderButton(artist, selectedArtists, setSelectedArtists))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Time Period</Text>
                <View style={styles.buttonGrid}>
                    {timePeriods.map(timePeriods => renderButton(timePeriods, selectedPeriod, setSelectedPeriod))}
                </View>
            </View>

            <TdamButton
                style={styles.Subutton}
                label="Submit"
                theme="primary"
                onPress={onSubmit}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        flex: 1,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        color: '#000000',
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 16,
        letterSpacing: 0.3,
    },
    buttonGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: 12,
    },
    button: {
        backgroundColor: 'transparent',
        borderWidth: 1.5,
        borderColor: '#000000',
        borderRadius: 24,
        paddingVertical: 12,
        paddingHorizontal: 20,
        marginBottom: 0,
    },
    buttonSelected: {
        backgroundColor: '#f3d8ff',
        borderColor: '#ff00f7',
    },
    buttonText: {
        color: '#000000',
        fontSize: 14,
        fontWeight: '500',
    },
    buttonTextSelected: {
        color: '#ff00f7',
    },
    Subutton: {
        width: "100%",
        marginTop: 10,
        paddingHorizontal: 16
    }

});