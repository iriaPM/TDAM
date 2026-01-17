//CollectionDetailViewModel.tsx

import { useEffect, useState } from "react";
import { CollectionDetail } from "@/models/CollectionDetails";

export function useCollectionDetailViewModel() {
    const [collection, setCollection] = useState<CollectionDetail | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // mocked data
        setCollection({
            id: "1",
            title: "Collection 1",
            avatarUrl: "",
            username: "username",
            description:
                "description description description qkjgberbrjeboerjborborbgoqerbrbrogbrbeor ergkergrkgr...",
            artworks: [
                { id: "1", imageUrl: "" },
                { id: "2", imageUrl: "" },
                { id: "3", imageUrl: "" },
                { id: "4", imageUrl: "" },
                { id: "5", imageUrl: "" },
                { id: "6", imageUrl: "" },
            ],
        });
        setLoading(false);
    }, []);

    return { collection, loading };
}
