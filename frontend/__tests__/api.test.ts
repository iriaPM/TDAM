// __tests__/api.test.ts

// mock AsyncStorage
jest.mock("@react-native-async-storage/async-storage", () => ({
    getItem: jest.fn(),
    setItem: jest.fn(),
}));

// mock fetch globally
global.fetch = jest.fn();

import AsyncStorage from "@react-native-async-storage/async-storage";

// helper to mock a fetch response
function mockFetch(data: any, ok = true, status = 200) {
    (global.fetch as jest.Mock).mockResolvedValueOnce({
        ok,
        status,
        json: async () => data,
        text: async () => JSON.stringify(data),
    });
}

// import after mocks
import { loginUser, registerUser, getArtworkDetail, toggleSaveArtwork } from "../services/api";

beforeEach(() => {
    jest.clearAllMocks();
});

describe("loginUser", () => {
    it("calls the correct endpoint with credentials", async () => {
        mockFetch({ token: "abc123", username: "testuser" });

        const result = await loginUser("testuser", "password123");

        expect(global.fetch).toHaveBeenCalledWith(
            expect.stringContaining("/login"),
            expect.objectContaining({
                method: "POST",
                body: JSON.stringify({ identifier: "testuser", password: "password123" }),
            })
        );
        expect(result.token).toBe("abc123");
    });
});

describe("registerUser", () => {
    it("returns user on successful registration", async () => {
        mockFetch({ token: "newtoken", username: "newuser" });

        const result = await registerUser("newuser", "new@email.com", "password123");
        expect(result.token).toBe("newtoken");
    });

    it("throws error if response is not ok", async () => {
        mockFetch({ message: "Username already exists" }, false, 409);

        await expect(
            registerUser("existinguser", "existing@email.com", "password123")
        ).rejects.toThrow();
    });
});

describe("getArtworkDetail", () => {
    it("returns null on 404", async () => {
        mockFetch({}, false, 404);
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue("token123");

        const result = await getArtworkDetail("met-123");
        expect(result).toBeNull();
    });

    it("returns artwork data on success", async () => {
        const mockArtwork = { title: "Sunflowers", artist: "Van Gogh", objectID: "met-123" };
        mockFetch(mockArtwork, true, 200);
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue("token123");

        const result = await getArtworkDetail("met-123");
        expect(result.title).toBe("Sunflowers");
    });

    it("throws on server error", async () => {
        mockFetch({ error: "Internal Server Error" }, false, 500);
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue("token123");

        await expect(getArtworkDetail("met-123")).rejects.toThrow("Failed to load artwork detail");
    });
});

describe("toggleSaveArtwork", () => {
    it("returns isSaved true when artwork is saved", async () => {
        mockFetch({ isSaved: true });
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue("token123");

        const result = await toggleSaveArtwork("met-123", "http://image.url");
        expect(result.isSaved).toBe(true);
    });

    it("throws if request fails", async () => {
        mockFetch({}, false, 500);
        (AsyncStorage.getItem as jest.Mock).mockResolvedValue("token123");

        await expect(toggleSaveArtwork("met-123", "http://image.url")).rejects.toThrow("Failed to save artwork");
    });
});