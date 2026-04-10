// __tests__/api.test.ts
import { describe, it, expect, beforeEach, jest } from '@jest/globals';

jest.mock("@react-native-async-storage/async-storage", () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginUser, registerUser, getArtworkDetail, toggleSaveArtwork } from "../services/api";

global.fetch = jest.fn() as jest.Mock;

function mockFetch(data: any, ok = true, status = 200) {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok,
        status,
        json: async () => data,
        text: async () => JSON.stringify(data),
    } as Response);
}

beforeEach(() => {
    jest.clearAllMocks();
});

describe('loginUser', () => {
    it('calls correct endpoint with credentials', async () => {
        mockFetch({ token: 'abc123', username: 'testuser' });
        const result = await loginUser('testuser', 'password123');
        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining('/login'),
            expect.objectContaining({
                method: 'POST',
                body: JSON.stringify({ identifier: 'testuser', password: 'password123' }),
            })
        );
        expect(result.token).toBe('abc123');
    });

    it('throws on failed login (401)', async () => {
        mockFetch({ message: 'Invalid credentials' }, false, 401);
        await expect(loginUser('wrong', 'wrong')).rejects.toThrow();
    });
});

describe('registerUser', () => {
    it('returns user on success', async () => {
        mockFetch({ token: 'newtoken', username: 'newuser' });
        const result = await registerUser('newuser', 'email@example.com', 'pass');
        expect(result.token).toBe('newtoken');
    });

    it('throws on conflict (409)', async () => {
        mockFetch({ message: 'Username taken' }, false, 409);
        await expect(registerUser('existing', 'email', 'pass')).rejects.toThrow();
    });

    it('throws on server error (500)', async () => {
        mockFetch({ error: 'Internal error' }, false, 500);
        await expect(registerUser('any', 'any', 'any')).rejects.toThrow();
    });
});

describe('getArtworkDetail', () => {
    beforeEach(() => {
        jest.spyOn(AsyncStorage, 'getItem').mockResolvedValue('token123');
    });

    it('returns null on 404', async () => {
        mockFetch({}, false, 404);
        const result = await getArtworkDetail('met-123');
        expect(result).toBeNull();
    });

    it('returns artwork data on 200', async () => {
        const artwork = { objectID: 'met-123', title: 'Sunflowers' };
        mockFetch(artwork, true, 200);
        const result = await getArtworkDetail('met-123');
        expect(result.title).toBe('Sunflowers');
    });

    it('throws on 500', async () => {
        mockFetch({}, false, 500);
        await expect(getArtworkDetail('met-123')).rejects.toThrow('Failed to load artwork detail');
    });

    it('throws when no token stored', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
        mockFetch({}, false, 500);
        await expect(getArtworkDetail('met-123')).rejects.toThrow('Failed to load artwork detail');
    });
});

describe('toggleSaveArtwork', () => {
    beforeEach(() => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue('token123');
    });

    it('returns isSaved true on save', async () => {
        mockFetch({ isSaved: true });
        const result = await toggleSaveArtwork('met-123', 'http://image.url');
        expect(result.isSaved).toBe(true);
    });

    it('throws on 500', async () => {
        mockFetch({}, false, 500);
        await expect(toggleSaveArtwork('met-123', 'url')).rejects.toThrow('Failed to save artwork');
    });

    it('throws when no token', async () => {
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue(null);
        mockFetch({}, false, 500);
        await expect(toggleSaveArtwork('met-123', 'url')).rejects.toThrow('Failed to save artwork');
    });
});