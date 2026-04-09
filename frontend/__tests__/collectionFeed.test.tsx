// __tests__/collectionFeed.test.ts
import React from 'react';
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

// Mock AsyncStorage first
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

import { render, fireEvent } from '@testing-library/react-native';
import { View, Pressable, TextInput } from 'react-native';
import CollectionsFeedView from '../app/(tabs)/CollectionsFeedView'; 
import { useCollectionsViewModel } from '@/viewmodel/CollectionsViewModel';
import { router } from 'expo-router';
import { Collection } from '@/models/Collection';

jest.mock('@/viewmodel/CollectionsViewModel');
jest.mock('expo-router', () => ({
  router: { push: jest.fn() },
  useFocusEffect: jest.fn(),
  useIsFocused: jest.fn(() => true),
  Href: jest.fn(),
}));

jest.mock('@/components/CollectionCard', () => (props: any) => {
  const { View, Pressable } = require('react-native');
  // Use title as a unique identifier since id is not passed to the component
  const uniqueId = props.title && props.title.toLowerCase().replace(/\s+/g, '-');
  return (
    <View testID={`collection-card-${uniqueId}`}>
      <Pressable testID={`save-collection-${uniqueId}`} onPress={props.onSave} />
      <View testID={`collection-title-${uniqueId}`}>{props.title}</View>
    </View>
  );
});

jest.mock('@/components/SearchBar', () => (props: any) => {
  const { View, TextInput } = require('react-native');
  return (
    <View testID="search-bar">
      <TextInput testID="search-input" onChangeText={props.onSearch} />
    </View>
  );
});

jest.mock('@/components/LoadingSpinner', () => (props: any) => {
  const { View } = require('react-native');
  return props.visible ? <View testID="loading-spinner" /> : null;
});

const mockUseCollectionsViewModel = useCollectionsViewModel as jest.Mock;
describe('CollectionsFeedView', () => {
  const mockCollections: Collection[] = [
    { id: 'c1', title: 'Impressionism', username: 'artlover', userId: 'u1', isSaved: false, imageUrl: 'url1' },
    { id: 'c2', title: 'Modern Art', username: 'curator', userId: 'u2', isSaved: true, imageUrl: 'url2' },
  ];

  beforeEach(() => {
    jest.clearAllMocks();
    mockUseCollectionsViewModel.mockReturnValue({
      collections: mockCollections,
      searching: false,
      feedError: null,
      searchCollections: jest.fn(),
      toggleSave: jest.fn(),
      loadCollections: jest.fn(),
    });
  });

  it('renders collections from ViewModel', () => {
    const { getByTestId } = render(<CollectionsFeedView />);
    expect(getByTestId('collection-title-impressionism')).toBeTruthy();
    expect(getByTestId('collection-title-modern-art')).toBeTruthy();
  });

  it('shows loading spinner when searching and no collections', () => {
    mockUseCollectionsViewModel.mockReturnValue({
      collections: [],
      searching: true,
      feedError: null,
      searchCollections: jest.fn(),
      toggleSave: jest.fn(),
      loadCollections: jest.fn(),
    });
    const { getByTestId } = render(<CollectionsFeedView />);
    expect(getByTestId('loading-spinner')).toBeTruthy();
  });

  it('displays error message when feedError is present', () => {
    mockUseCollectionsViewModel.mockReturnValue({
      collections: mockCollections,
      searching: false,
      feedError: 'Failed to load collections',
      searchCollections: jest.fn(),
      toggleSave: jest.fn(),
      loadCollections: jest.fn(),
    });
    const { getByText } = render(<CollectionsFeedView />);
    expect(getByText('Failed to load collections')).toBeTruthy();
  });

  it('calls toggleSave when save button pressed', () => {
    const mockToggleSave = jest.fn();
    mockUseCollectionsViewModel.mockReturnValue({
      collections: mockCollections,
      searching: false,
      feedError: null,
      searchCollections: jest.fn(),
      toggleSave: mockToggleSave,
      loadCollections: jest.fn(),
    });
    const { getByTestId } = render(<CollectionsFeedView />);
    const saveButton = getByTestId('save-collection-impressionism');
    fireEvent.press(saveButton);
    expect(mockToggleSave).toHaveBeenCalledWith('c1');
  });

  it('navigates to collection detail on press', () => {
    const { getByTestId } = render(<CollectionsFeedView />);
    const card = getByTestId('collection-card-impressionism');
    fireEvent.press(card);
    expect(router.push).toHaveBeenCalledWith('collections/c1');
  });

  it('calls searchCollections when search input changes', () => {
    const mockSearch = jest.fn();
    mockUseCollectionsViewModel.mockReturnValue({
      collections: mockCollections,
      searching: false,
      feedError: null,
      searchCollections: mockSearch,
      toggleSave: jest.fn(),
      loadCollections: jest.fn(),
    });
    const { getByTestId } = render(<CollectionsFeedView />);
    const searchInput = getByTestId('search-input');
    fireEvent.changeText(searchInput, 'impression');
    expect(mockSearch).toHaveBeenCalledWith('impression');
  });
});