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
    onSubmit: (preferences: {
        styles: string[];
        movements: string[];
        categories: string[];
        artists: string[];
        periods: string[];
    }) => void;
}

export default function PreferenceSurveyBottomsheet({ onSubmit }: PreferenceSurveyBottomsheetProps) {
    const [selectedStyles, setSelectedStyles] = useState<string[]>([]);
    const [selectedMovements, setSelectedMovements] = useState<string[]>([]);
    const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
    const [selectedArtists, setSelectedArtists] = useState<string[]>([]);
    const [selectedPeriod, setSelectedPeriod] = useState<string[]>([]);

    const cultures = [
        'Chinese', 'Japanese', 'Italian', 'Dutch',
        'French', 'Indian', 'American', 'Byzantine',
        'German', 'Flemish', 'Iranian', 'Spanish',
        'Netherlandish', 'Central Asian',
    ];

    const eras = [
        'Renaissance', 'Baroque',
        'Tang dynasty', 'Edo period', 'Qing dynasty',
        'Medieval', 'Neoclassicism', 'Impressionism',
    ];

    const favoriteArtists = [
        'Michelangelo', 'Van Gogh', 'Hiroshige', 'Han Gan',
        'Monet', 'Rembrandt', 'Manaku', 'Andrea del Sarto',
        'Goya', 'Jacques Louis David', 'Rosa Bonheur',
        'Edouard Manet', 'Georges Seurat',
    ];

    const timePeriods = [
        'Ancient', '7th century', '12th century',
        '15th century', '16th century', '17th century',
        '18th century', '19th century', 'Contemporary',
    ];

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
                accessibilityRole="button"
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
            <Text style={styles.mainTitle}>Let us know what you like...</Text>
            <Text style={styles.subtitle}>Pick as many as you wish.</Text>


            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Where in the world?</Text>
                <View style={styles.buttonGrid}>
                    {cultures.map(item => renderButton(item, selectedStyles, setSelectedStyles))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Any specific style?</Text>
                <View style={styles.buttonGrid}>
                    {eras.map(era => renderButton(era, selectedMovements, setSelectedMovements))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Familiar faces?</Text>
                <View style={styles.buttonGrid}>
                    {favoriteArtists.map(item => renderButton(item, selectedArtists, setSelectedArtists))}
                </View>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>How far back?</Text>
                <View style={styles.buttonGrid}>
                    {timePeriods.map(item => renderButton(item, selectedPeriod, setSelectedPeriod))}
                </View>
            </View>

            <TdamButton
                style={styles.Subutton}
                label="Submit"
                theme="primary"
                onPress={() =>
                    onSubmit({
                        styles: selectedStyles,
                        movements: selectedMovements,
                        categories: selectedCategories,
                        artists: selectedArtists,
                        periods: selectedPeriod,
                    })}
            />
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ffffff',
        marginBottom: 50,
        paddingTop: 10,
    },
    contentContainer: {
        padding: 20,
        paddingBottom: 40,
    },
    mainTitle: {
        fontSize: 22,
        fontWeight: "bold",
        textAlign: "center",
        marginBottom: 6,
        color: "#000",
    },
    subtitle: {
        fontSize: 14,
        textAlign: 'center',
        color: '#666666',
        marginBottom: 28,
    },
    section: {
        marginBottom: 32,
    },
    sectionTitle: {
        color: '#000000',
        fontSize: 16,
        fontWeight: "bold",
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
        fontWeight: "bold",
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