//regstration view model
// validate input + call API

import { useState } from "react";
import { registerUser } from "../services/api";
import AsyncStorage from '@react-native-async-storage/async-storage';

export function useRegViewModel() {
    const [username, setUsername] = useState('')
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);

    const register = async () => {
        //make sure username is unique? is that done here on in the backend?  what other checks should i do? 
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
            const user = await registerUser(username, email, password);
            console.log("Successfully Registered :", user);
            await AsyncStorage.setItem('userToken', user.token);
        } catch (err) {
            setError("Failed to register");
        } finally {
            setLoading(false);
        }
    }
    return { email, setEmail, password, setPassword, username, setUsername, error, loading, register };
}