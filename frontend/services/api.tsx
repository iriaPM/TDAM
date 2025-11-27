//api.tsx
//connection to springboot 

import { User } from "../models/Users";
import { Artwork } from "@/models/Artwork";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = "http://172.27.192.1:8080/api";

export async function loginUser(email: string, password: string): Promise<User> {
    const response = await fetch('${BASE_URL}/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },

    });
    return response.json();
}

export async function registerUser(username: string, email: string, password: string): Promise<User> {
    const response = await fetch('${BASE_URL}/register', {
        method: 'POST',
        body: JSON.stringify({ username, email, password }),
        headers: { 'Content-Type': 'application/json' },

    });
    return response.json();
}

export async function getProfile(): Promise<User> {
    const token = await AsyncStorage.getItem('userToken');

    const response = await fetch('${BASE_URL}/user/profile', {
        method: 'GET',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
        },
    });
    return response.json();
}

export async function getArtworksAPI(query: string): Promise<Artwork[]> {
    const response = await fetch('${BASE_URL}/artworks?query=${query}', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    });
    return response.json();
}