//pills.tsx
//component for the pills used in the artwork feed view
import React from 'react';
import { ScrollView, Pressable, Text, StyleSheet } from 'react-native';

interface CategoryPillsProps {
    categories: string[];
    selectedCategory: string | null;
    onSelectCategory: (category: string | null) => void;
}

export default function CategoryPills({ categories, selectedCategory, onSelectCategory }: CategoryPillsProps) {
    return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
            <Pressable
                style={[styles.pill, selectedCategory === null && styles.selectedPill]}
                onPress={() => onSelectCategory(null)}
            >
                <Text style={[styles.pillText, selectedCategory === null && styles.selectedText]}>For You</Text>
            </Pressable>
            {categories.map((cat) => (
                <Pressable
                    key={cat}
                    style={[styles.pill, selectedCategory === cat && styles.selectedPill]}
                    onPress={() => onSelectCategory(cat)}
                >
                    <Text style={[styles.pillText, selectedCategory === cat && styles.selectedText]}>{cat}</Text>
                </Pressable>
            ))}
        </ScrollView>
    );
}

const styles = StyleSheet.create({
    container: {
        paddingVertical: 10,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    selectedPill: {
        backgroundColor: '#FF8F8F',
    },
    pill: {
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: '#f0f0f0',
        marginRight: 8,
        justifyContent: 'center',
        minHeight: 40,
    },
    pillText: {
        fontSize: 14,
        color: '#000000',
        textAlignVertical: 'center',
        includeFontPadding: false,
    },
    selectedText: {
        color: '#000000',
    },
});