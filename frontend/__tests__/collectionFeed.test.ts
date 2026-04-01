// __tests__/collectionFeed.test.ts
import { Collection } from "../models/Collection";

// logic extracted from useCollectionsViewModel 

function toggleSave(collections: Collection[], id: string): Collection[] {
    return collections.map(c =>
        c.id === id ? { ...c, isSaved: !c.isSaved } : c
    );
}

function searchCollections(collections: Collection[], query: string): Collection[] {
    if (!query.trim()) return collections;
    return collections.filter(c =>
        c.title.toLowerCase().includes(query.toLowerCase())
    );
}

function shouldLoadCollections(collections: Collection[]): boolean {
    return collections.length === 0;
}

// mock collections
const mockCollections: Collection[] = [
    { id: "col-1", title: "Impressionism", username: "user1", imageUrl: "http://img1.jpg", isSaved: false, userId: "u1" },
    { id: "col-2", title: "Modern Art", username: "user2", imageUrl: "http://img2.jpg", isSaved: false, userId: "u2" },
    { id: "col-3", title: "Renaissance Masters", username: "user3", imageUrl: "http://img3.jpg", isSaved: true, userId: "u3" },
];


describe("Collections Feed - toggleSave", () => {
    it("saves an unsaved collection", () => {
        const result = toggleSave(mockCollections, "col-1");
        expect(result.find(c => c.id === "col-1")?.isSaved).toBe(true);
    });

    it("unsaves a saved collection", () => {
        const result = toggleSave(mockCollections, "col-3");
        expect(result.find(c => c.id === "col-3")?.isSaved).toBe(false);
    });

    it("does not affect other collections when toggling one", () => {
        const result = toggleSave(mockCollections, "col-1");
        expect(result.find(c => c.id === "col-2")?.isSaved).toBe(false);
        expect(result.find(c => c.id === "col-3")?.isSaved).toBe(true);
    });

    it("returns same list length after toggle", () => {
        const result = toggleSave(mockCollections, "col-1");
        expect(result.length).toBe(mockCollections.length);
    });
});

describe("Collections Feed - searchCollections", () => {
    it("filters collections by title", () => {
        const result = searchCollections(mockCollections, "modern");
        expect(result.length).toBe(1);
        expect(result[0].title).toBe("Modern Art");
    });

    it("search is case insensitive", () => {
        const result = searchCollections(mockCollections, "IMPRESSIONISM");
        expect(result.length).toBe(1);
        expect(result[0].title).toBe("Impressionism");
    });

    it("returns all collections when query is empty", () => {
        const result = searchCollections(mockCollections, "");
        expect(result.length).toBe(mockCollections.length);
    });

    it("returns all collections when query is only spaces", () => {
        const result = searchCollections(mockCollections, "   ");
        expect(result.length).toBe(mockCollections.length);
    });

    it("returns empty array when no collections match", () => {
        const result = searchCollections(mockCollections, "xyz123");
        expect(result.length).toBe(0);
    });

    it("returns multiple results for partial match", () => {
        const result = searchCollections(mockCollections, "r");
        // "Impressionism", "Modern Art", "Renaissance Masters" all contain r
        expect(result.length).toBe(3);
    });
});

describe("Collections Feed - recommendation fallback", () => {
    it("uses recommended order when recommendations available", () => {
        const recommended = [{ collectionId: "col-3" }, { collectionId: "col-1" }];
        const fullDataMap = new Map(mockCollections.map(c => [c.id, c]));

        const result = recommended
            .map(r => fullDataMap.get(r.collectionId))
            .filter(Boolean) as Collection[];

        expect(result[0].id).toBe("col-3");
        expect(result[1].id).toBe("col-1");
    });

    it("falls back to default order when no recommendations", () => {
        const recommended: any[] = [];
        const result = recommended.length > 0 ? recommended : mockCollections;
        expect(result).toEqual(mockCollections);
    });
});