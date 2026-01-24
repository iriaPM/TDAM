//api.tsx
//connection to springboot 

import { User } from "../models/Users";
import { Artwork } from "@/models/Artwork";
import AsyncStorage from "@react-native-async-storage/async-storage";
//172.18.219.154
//const BASE_URL = "http://172.18.219.154:8080/api";
const BASE_URL = "http://10.0.2.2:8080/api";


export async function loginUser(identifier: string, password: string): Promise<User> {
    const response = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        body: JSON.stringify({ identifier, password }),
        headers: { 'Content-Type': 'application/json' },

    });
    return response.json();
}

export async function registerUser(username: string, email: string, password: string): Promise<User> {
    const response = await fetch(`${BASE_URL}/register`, {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
        headers: { 'Content-Type': 'application/json' },

    });

    if (!response.ok) {
        const message = await response.text(); //backend message
        throw new Error(message || "Registration failed");
    }
    return response.json();
}

export async function getProfile(): Promise<User> {
    const token = await AsyncStorage.getItem('userToken');

    const response = await fetch(`${BASE_URL}/user/profile`, {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });
    return response.json();
}

export async function searchArtworksAPI(query: string): Promise<Artwork[]> {
    const response = await fetch(`${BASE_URL}/artworks/search?query=${query}`);
    if (!response.ok) return [];
    return response.json();
}

export async function getRandomArtworksAPI(): Promise<Artwork[]> {
    const response = await fetch(`${BASE_URL}/artworks/random`);
    if (!response.ok) return [];
    return response.json();
}

//--------- COLLECTIONS -----------

export async function getPublicCollections() {
    const response = await fetch(`${BASE_URL}/collections/public`);
    if (!response.ok) throw new Error("Failed to load public collections");
    return response.json();
}

export async function getMyCollections() {
    const token = await AsyncStorage.getItem("userToken");
    console.log("MY COLLECTIONS TOKEN:", token);

    const response = await fetch(`${BASE_URL}/collections/me`, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) throw new Error("Failed to load user collections");
    return response.json();
}

export async function createCollection(
    title: string,
    description: string,
    isPrivate: boolean
) {
    const token = await AsyncStorage.getItem("userToken");

    if (!token) {
        throw new Error("User not authenticated");
    }

    const response = await fetch(`${BASE_URL}/collections`, {
        method: "POST",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            title,
            description,
            isPrivate,
        }),
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to create collection");
    }

    return response.json();
}

export async function toggleArtworkInCollection(
    collectionId: string,
    artworkId: string,
    imageUrl: string
) {
    const token = await AsyncStorage.getItem("userToken");

    const response = await fetch(
        `${BASE_URL}/collections/${collectionId}/artworks`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ artworkId, imageUrl }),
        }
    );

    if (!response.ok) throw new Error("Failed to toggle artwork");
}

export async function getCollectionDetail(collectionId: string) {
    const token = await AsyncStorage.getItem("userToken");

    if (!token) {
        throw new Error("User not authenticated");
    }

    const response = await fetch(
        `${BASE_URL}/collections/${collectionId}`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to load collection detail");
    }

    return response.json();
}


export async function toggleCollectionPrivacy(collectionId: string) {
    const token = await AsyncStorage.getItem("userToken");

    const response = await fetch(
        `${BASE_URL}/collections/${collectionId}/privacy`,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    if (!response.ok) {
        throw new Error("Failed to toggle privacy");
    }

    return response.json();
}

export async function updateCollection(
    collectionId: string,
    title: string,
    description: string
) {
    const token = await AsyncStorage.getItem("userToken");

    const response = await fetch(
        `${BASE_URL}/collections/${collectionId}`,
        {
            method: "PATCH",
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify({ title, description }),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update collection");
    }

    return response.json();
}
//--------- USER PROFILE -----------
export async function getUserProfile(userId?: string) {
    const token = await AsyncStorage.getItem("userToken");

    if (!token) {
        throw new Error("User not authenticated");
    }

    const url = userId
        ? `${BASE_URL}/users/profile?id=${userId}`
        : `${BASE_URL}/users/profile`;

    const response = await fetch(url, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
    });

    if (!response.ok) {
        throw new Error("Failed to load user profile");
    }

    return response.json();
}

export async function updateUserProfile(
    username: string,
    description: string
) {
    const token = await AsyncStorage.getItem("userToken");

    if (!token) {
        throw new Error("User not authenticated");
    }

    const response = await fetch(`${BASE_URL}/users/profile`, {
        method: "PUT",
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            userName: username,
            description: description,
        }),
    });

    if (!response.ok) {
        const message = await response.text();
        throw new Error(message || "Failed to update profile");
    }

    return response.json();
}