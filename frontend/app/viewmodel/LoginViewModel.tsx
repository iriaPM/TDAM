//login view model
// validate input + call API

import { useState } from "react";
import { User } from "../models/Users";
import { loginUser } from "../services/api";

export function useLoginViewModel() {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const login = async () => {
        if (!email.includes('@')) {
            setError('Invalid email');
            return;
        }
        if (password.length < 6) {
            setError('Password is too short');
            return;
        }
        setLoading(true);
        try {
            const user = await loginUser(email, password);
            console.log("Logged in:", user);
        } catch (err) {
            setError("Failed to login");
        } finally {
            setLoading(false);
        }
    }
    return { email, setEmail, password, setPassword, error, loading, login };
}