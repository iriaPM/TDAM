//CollectionFeedViewModel.tsx
//This viewmodel manages the state and logic for the collections feed

// CollectionFeedViewModel.tsx
import { useEffect, useState } from "react";
import { Collection } from "@/models/Collection";

export function useCollectionViewModel() {
    const [collections, setCollections] = useState<Collection[]>([]);

    useEffect(() => {
        setCollections([
            {
                objectID: "1",
                title: "My First Collection",
                username: "artlover123",
                time: "3 days ago",
                description: "A collection of my favorite artworks",
                imageUrl: "",
                isSaved: false,
                avatarUrl: "",
            },
        ]);
    }, []);

    return { collections };
}
