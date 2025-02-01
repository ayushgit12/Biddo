// utils/auth.ts
import AsyncStorage from '@react-native-async-storage/async-storage';

// Define our user type for TypeScript support
type User = {
    _id: string;
    email: string;
    userName: string;
};

// Function to store user data after successful login
export const storeUserData = async (userData: { user: User; token: string }) => {
    try {
        const { token, user } = userData;
        await AsyncStorage.setItem('user', JSON.stringify(user));
        await AsyncStorage.setItem('token', token);
        return true;
    } catch (error) {
        console.error('Error storing user data:', error);
        return false;
    }
};

// Function to get stored user data
export const getUserData = async () => {
    try {
        const userString = await AsyncStorage.getItem('user');
        const token = await AsyncStorage.getItem('token');
        if (!userString || !token) return null;
        
        return {
            user: JSON.parse(userString),
            token
        };
    } catch (error) {
        console.error('Error getting user data:', error);
        return null;
    }
};

// Function to clear user data on logout
export const clearUserData = async () => {
    try {
        await AsyncStorage.multiRemove(['user', 'token']);
        return true;
    } catch (error) {
        console.error('Error clearing user data:', error);
        return false;
    }
};