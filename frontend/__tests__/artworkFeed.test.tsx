// __tests__/artworkFeed.test.tsx
import React from 'react';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';
import { render, fireEvent, waitFor, act } from '@testing-library/react-native';
import ArtworkFeedView from '../app/(tabs)/ArtworkFeedView';
import { useArtworksViewModel } from '@/viewmodel/ArtworkFeedViewModel';
import { toggleSaveArtwork, getMyCollections, createCollection, getUserCategories } from '@/services/api';
import { router } from 'expo-router';
import { Artwork } from '@/models/Artwork';

// Mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
    removeItem: jest.fn(),
    default: {
        getItem: jest.fn(),
        setItem: jest.fn(),
        removeItem: jest.fn(),
    },
}));

// Mock external modules
jest.mock('@/viewmodel/ArtworkFeedViewModel');
jest.mock('@/services/api');
jest.mock('expo-router', () => ({
    router: { push: jest.fn() },
    Href: jest.fn(),
}));

jest.mock('@/components/CreateCollectionBottomsheet', () => (props: any) => {
    const { View, TextInput, Pressable, Text } = require('react-native');
    return (
        <View testID="create-collection-sheet">
            <TextInput
                testID="create-collection-name"
                placeholder="Name of the collection"
                value={props.name}
                onChangeText={props.onChangeName}
            />
            <TextInput
                testID="create-collection-description"
                placeholder="Description"
                value={props.description}
                onChangeText={props.onChangeDescription}
            />
            <Pressable testID="submit-create-collection" onPress={props.onSubmit}>
                <Text>{props.submitLabel || 'Create'}</Text>
            </Pressable>
        </View>
    );
});

jest.mock('@/components/ArtworkCard', () => (props: any) => {
    const { View, Pressable } = require('react-native');
    const uniqueId = props.title?.toLowerCase().replace(/\s+/g, '-') || 'unknown';
    return (
        <View testID={`artwork-card-${uniqueId}`}>
            <Pressable testID={`save-button-${uniqueId}`} onPress={props.onSave} />
            <Pressable testID={`add-to-collection-${uniqueId}`} onPress={props.onAddToCollection} />
            <Pressable testID={`artist-button-${uniqueId}`} onPress={props.onArtistPress} />
            <View testID={`artwork-title-${uniqueId}`}>{props.title}</View>
        </View>
    );
});

jest.mock('@/components/SearchBar', () => (props: any) => {
    const { View, TextInput } = require('react-native');
    return (
        <View testID="search-bar">
            <TextInput testID="search-input" onChangeText={props.onSearch} placeholder="Search..." />
        </View>
    );
});

jest.mock('@/components/LoadingSpinner', () => (props: any) => {
    const { View } = require('react-native');
    return props.visible ? <View testID="loading-spinner" /> : null;
});

jest.mock('@/components/Pills', () => () => {
    const { View } = require('react-native');
    return <View testID="category-pills" />;
});

jest.mock('react-native-raw-bottom-sheet', () => {
    const { View } = require('react-native');
    return {
        __esModule: true,
        default: ({ children, ref }: any) => <View testID="rb-sheet">{children}</View>,
    };
});

const mockUseArtworksViewModel = useArtworksViewModel as jest.Mock;
const mockToggleSaveArtwork = toggleSaveArtwork as jest.Mock;
const mockGetMyCollections = getMyCollections as jest.Mock;
const mockCreateCollection = createCollection as jest.Mock;
const mockGetUserCategories = getUserCategories as jest.Mock;

describe('ArtworkFeedView', () => {
    const mockArtworks: Artwork[] = [
        { objectID: '1', title: 'Mona Lisa', artist: 'da Vinci', imageUrl: 'url1', isSaved: false, objectDate: '1503', movement: 'Renaissance' },
        { objectID: '2', title: 'Starry Night', artist: 'van Gogh', imageUrl: 'url2', isSaved: true, objectDate: '1889', movement: 'Post-Impressionism' },
    ];

    beforeEach(() => {
        jest.clearAllMocks();
        mockUseArtworksViewModel.mockReturnValue({
            artworks: mockArtworks,
            toggleSave: jest.fn(),
            searchArtworks: jest.fn(),
            searching: false,
            error: null,
            loadFeed: jest.fn(),
        });
        mockGetUserCategories.mockResolvedValue(['Renaissance', 'Modern']);
        mockToggleSaveArtwork.mockResolvedValue({ isSaved: true });
        mockGetMyCollections.mockResolvedValue([]);
        mockCreateCollection.mockResolvedValue({ id: 'new-collection-id' });
    });

    // Helper to wait for categories to load
    const waitForCategories = async () => {
        await waitFor(() => expect(mockGetUserCategories).toHaveBeenCalled());
    };

    it('renders artworks from ViewModel', async () => {
        const { getByTestId } = render(<ArtworkFeedView />);
        await waitForCategories();
        expect(getByTestId('artwork-title-mona-lisa')).toBeTruthy();
        expect(getByTestId('artwork-title-starry-night')).toBeTruthy();
    });

    it('shows loading spinner when searching and no artworks', async () => {
        mockUseArtworksViewModel.mockReturnValue({
            artworks: [],
            searching: true,
            error: null,
            loadFeed: jest.fn(),
            searchArtworks: jest.fn(),
            toggleSave: jest.fn(),
        });
        const { getByTestId } = render(<ArtworkFeedView />);
        await waitForCategories();
        expect(getByTestId('loading-spinner')).toBeTruthy();
    });

    it('displays error message when error is present', async () => {
        mockUseArtworksViewModel.mockReturnValue({
            artworks: mockArtworks,
            toggleSave: jest.fn(),
            searchArtworks: jest.fn(),
            searching: false,
            error: 'Failed to load artworks',
            loadFeed: jest.fn(),
        });
        const { getByText } = render(<ArtworkFeedView />);
        await waitForCategories();
        expect(getByText('Failed to load artworks')).toBeTruthy();
    });

    it('calls toggleSaveArtwork and updates local state via ViewModel', async () => {
        const mockToggleSave = jest.fn();
        mockUseArtworksViewModel.mockReturnValue({
            artworks: mockArtworks,
            searchArtworks: jest.fn(),
            searching: false,
            error: null,
            loadFeed: jest.fn(),
            toggleSave: mockToggleSave,
        });
        const { getByTestId } = render(<ArtworkFeedView />);
        await waitForCategories();
        const saveButton = getByTestId('save-button-mona-lisa');
        await act(async () => {
            fireEvent.press(saveButton);
        });
        expect(mockToggleSaveArtwork).toHaveBeenCalledWith('1', 'url1');
        await waitFor(() => {
            expect(mockToggleSave).toHaveBeenCalledWith('1', true);
        });
    });

    it('does not navigate when artist is missing', async () => {
        const artworkNoArtist = [{ objectID: '3', title: 'No Artist', artist: null, imageUrl: '', isSaved: false }];
        mockUseArtworksViewModel.mockReturnValue({
            artworks: artworkNoArtist,
            toggleSave: jest.fn(),
            searchArtworks: jest.fn(),
            searching: false,
            error: null,
            loadFeed: jest.fn(),
        });
        const { getByTestId } = render(<ArtworkFeedView />);
        await waitForCategories();
        const artistButton = getByTestId('artist-button-no-artist');
        fireEvent.press(artistButton);
        expect(router.push).not.toHaveBeenCalled();
    });

    it('calls searchArtworks when search bar is used', async () => {
        const mockSearch = jest.fn();
        mockUseArtworksViewModel.mockReturnValue({
            artworks: mockArtworks,
            toggleSave: jest.fn(),
            searchArtworks: mockSearch,
            searching: false,
            error: null,
            loadFeed: jest.fn(),
        });
        const { getByTestId } = render(<ArtworkFeedView />);
        await waitForCategories();
        const searchInput = getByTestId('search-input');
        fireEvent.changeText(searchInput, 'Mona');
        expect(mockSearch).toHaveBeenCalledWith('Mona');
    });

    it('loads feed on mount (selectedCategory null)', async () => {
        const mockLoadFeed = jest.fn();
        mockUseArtworksViewModel.mockReturnValue({
            artworks: mockArtworks,
            toggleSave: jest.fn(),
            searchArtworks: jest.fn(),
            loadFeed: mockLoadFeed,
            searching: false,
            error: null,
        });
        render(<ArtworkFeedView />);
        await waitForCategories();
        expect(mockLoadFeed).toHaveBeenCalled();
    });

    it('does not create collection when name is empty', async () => {
        mockGetMyCollections.mockResolvedValue([]);
        const { getByTestId, getByText, getByPlaceholderText } = render(<ArtworkFeedView />);
        await waitForCategories();

        const addButton = getByTestId('add-to-collection-mona-lisa');
        await act(async () => {
            fireEvent.press(addButton);
        });
        await waitFor(() => expect(mockGetMyCollections).toHaveBeenCalled());

        const createNewBtn = getByText(/create new/i);
        fireEvent.press(createNewBtn);

        const nameInput = getByPlaceholderText(/Name of the collection/i);
        fireEvent.changeText(nameInput, '   ');

        const submitBtn = getByTestId('submit-create-collection');
        fireEvent.press(submitBtn);

        expect(mockCreateCollection).not.toHaveBeenCalled();
    });

    it('handles rapid save toggles without breaking', async () => {
        const mockToggleSave = jest.fn();
        mockUseArtworksViewModel.mockReturnValue({
            artworks: mockArtworks,
            searchArtworks: jest.fn(),
            searching: false,
            error: null,
            loadFeed: jest.fn(),
            toggleSave: mockToggleSave,
        });
        mockToggleSaveArtwork.mockResolvedValue({ isSaved: true });
        const { getByTestId } = render(<ArtworkFeedView />);
        await waitForCategories();
        const saveButton = getByTestId('save-button-mona-lisa');
        fireEvent.press(saveButton);
        fireEvent.press(saveButton);
        expect(mockToggleSaveArtwork).toHaveBeenCalledTimes(2);
        await waitFor(() => {
            expect(mockToggleSave).toHaveBeenCalledTimes(2);
        });
    });
});