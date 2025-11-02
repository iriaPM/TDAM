//api.tsx
//connection to springboot 

import { User } from "../models/Users";

export async function loginUser(email: string, password: string): Promise<User> {
    const response = await fetch('http://172.27.192.1:8080/api/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
        headers: { 'Content-Type': 'application/json' },

    });
    return response.json();
}