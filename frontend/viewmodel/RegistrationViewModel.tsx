//regstration view model
// validate input + call API

import { useState } from "react";
import { registerUser } from "../services/api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";

export function useRegViewModel() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const register = async () => {
        if (loading) return;
        setError(null);
        setLoading(true);

        if (!email.includes('@')) {
            setError('Invalid email');
            setLoading(false);
            return;
        }

        if (password.length < 6) {
            setError('Password must be at least 6 characters long');
            setLoading(false);
            return;
        }

        try {
            const user = await registerUser(username, email, password);
            console.log("Successfully Registered :", user);
            alert("Successfully Registered");
            await AsyncStorage.setItem('userToken', user.token);
            router.replace('/loginView');
        } catch (err: any) {
            const message = err?.message || "Something went wrong";
            setError(message);
        }
        finally {
            setLoading(false);
        }
    }
    return { email, setEmail, password, setPassword, username, setUsername, error, loading, register };
}