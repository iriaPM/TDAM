//mock profile data before integrating with backend

import { Collection } from "@/models/Collection";
import { CollectionDetail } from "@/models/CollectionDetails";
import { User } from "@/models/Users";

type MockCollection = Collection & {
    ownerId: string;
    private: boolean;
};


const MOCK_USERS: Record<string, User> = {
    "me": {
        id: "me",
        userName: "my_username",
        description: "This is my profile description",
        avatarUrl: "",
        email: "me@example.com",
        token: "",
    },
    "user1": {
        id: "user1",
        userName: "other_user",
        description: "Public profile bio",
        avatarUrl: "",
        email: "user1@example.com",
        token: "",
    },
};

const MOCK_COLLECTIONS: MockCollection[] = [
    {
        id: "1",
        title: "My Private Collection",
        username: "my_username",
        imageUrl: "",
        isSaved: false,
        ownerId: "me",
        private: true,
    },
    {
        id: "2",
        title: "My Public Collection",
        username: "my_username",
        imageUrl: "",
        isSaved: false,
        ownerId: "me",
        private: false,
    },
    {
        id: "3",
        title: "Other User Collection",
        username: "other_user",
        imageUrl: "",
        isSaved: false,
        ownerId: "user1",
        private: false,
    },
];


export async function mockGetUser(userId: string): Promise<User> {
    await delay();
    return MOCK_USERS[userId];
}

export async function mockGetUserCollections(
    userId: string,
    includePrivate: boolean
): Promise<Collection[]> {
    await delay();
    return MOCK_COLLECTIONS.filter(
        c =>
            c.ownerId === userId &&
            (includePrivate || !c.private)
    );
}

export async function mockUpdateUser(
    userId: string,
    name: string,
    description: string
): Promise<User> {
    await delay();
    MOCK_USERS[userId] = {
        ...MOCK_USERS[userId],
        userName: name,
        description,
    };
    return MOCK_USERS[userId];
}

function delay(ms = 400) {
    return new Promise(res => setTimeout(res, ms));
}
