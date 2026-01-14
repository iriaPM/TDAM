//login view model
// validate input + call API

import { useState } from "react";
import { loginUser } from "../services/api";
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from "expo-router";

export function useLoginViewModel() {
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const [identifier, setIdentifier] = useState('');//email or username

    const login = async () => {

        if (!identifier.trim()) {
            setError('Email or username is required');
            return;
        }

        if (password.length < 6) {
            setError('Password is too short');
            return;
        }
        setLoading(true);
        try {
            const user = await loginUser(identifier, password);
            console.log("Logged in:", user);
            alert("Successfully Logged in!");

            await AsyncStorage.setItem('userToken', user.token);
            router.replace('/home');
        } catch (err) {
            setError("Failed to login");
            alert("Failed to login :(");
        } finally {
            setLoading(false);
        }
    }
    return { identifier, setIdentifier, password, setPassword, error, loading, login };
}