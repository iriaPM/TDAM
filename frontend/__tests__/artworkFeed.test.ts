// __tests__/artworkFeed.test.ts
import { Artwork } from "../models/Artwork";

// logic extracted from useArtworksViewModel 

function toggleSave(artworks: Artwork[], id: string, newSavedState: boolean): Artwork[] {
    return artworks.map(a =>
        a.objectID === id ? { ...a, isSaved: newSavedState } : a
    );
}

function shouldLoadFeed(artworks: Artwork[]): boolean {
    return artworks.length === 0;
}

// mock artworks
const mockArtworks: Artwork[] = [
    { objectID: "met-1", title: "Sunflowers", artist: "Van Gogh", imageUrl: "http://img1.jpg", isSaved: false },
    { objectID: "met-2", title: "The Scream", artist: "Munch", imageUrl: "http://img2.jpg", isSaved: false },
    { objectID: "harvard-1", title: "Water Lilies", artist: "Monet", imageUrl: "http://img3.jpg", isSaved: true },
];

describe("Artwork Feed - toggleSave", () => {
    it("saves an unsaved artwork", () => {
        const result = toggleSave(mockArtworks, "met-1", true);
        expect(result.find(a => a.objectID === "met-1")?.isSaved).toBe(true);
    });

    it("unsaves a saved artwork", () => {
        const result = toggleSave(mockArtworks, "harvard-1", false);
        expect(result.find(a => a.objectID === "harvard-1")?.isSaved).toBe(false);
    });

    it("does not affect other artworks when toggling one", () => {
        const result = toggleSave(mockArtworks, "met-1", true);
        expect(result.find(a => a.objectID === "met-2")?.isSaved).toBe(false);
        expect(result.find(a => a.objectID === "harvard-1")?.isSaved).toBe(true);
    });

    it("returns same list length after toggle", () => {
        const result = toggleSave(mockArtworks, "met-1", true);
        expect(result.length).toBe(mockArtworks.length);
    });

    it("does nothing if artwork id does not exist", () => {
        const result = toggleSave(mockArtworks, "invalid-id", true);
        expect(result).toEqual(mockArtworks);
    });
});

describe("Artwork Feed - fallback logic", () => {
    it("uses recommendations when available", () => {
        const recommended: Artwork[] = [
            { objectID: "met-10", title: "Recommended Art", artist: "Artist", imageUrl: "http://img.jpg", isSaved: false }
        ];
        const random: Artwork[] = [
            { objectID: "met-20", title: "Random Art", artist: "Artist2", imageUrl: "http://img2.jpg", isSaved: false }
        ];

        const result = recommended.length > 0 ? recommended : random;
        expect(result[0].objectID).toBe("met-10");
    });

    it("falls back to random artworks when recommendations are empty", () => {
        const recommended: Artwork[] = [];
        const random: Artwork[] = [
            { objectID: "met-20", title: "Random Art", artist: "Artist2", imageUrl: "http://img2.jpg", isSaved: false }
        ];

        const result = recommended.length > 0 ? recommended : random;
        expect(result[0].objectID).toBe("met-20");
    });
});