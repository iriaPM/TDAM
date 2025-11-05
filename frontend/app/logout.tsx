//logout -
//remove token 
import AsyncStorage from '@react-native-async-storage/async-storage';
import { router } from 'expo-router';

export async function logout() {
  try {
    await AsyncStorage.removeItem('userToken'); // remove stored token
    router.replace('/'); // go back to the index or login screen
  } catch (error) {
    console.error('Error during logout:', error);
  }
}
