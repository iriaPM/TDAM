//api.tsx
//connection to springboot 

import { User } from "../models/Users";

export async function loginUser(email: string, password: string): Promise<User> {
    const response = await fetch('http://192.168.0.105:8080/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },

    });
    return response.json();
}