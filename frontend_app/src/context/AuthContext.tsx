import React, { createContext, useContext, useState } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';

type User = {
    _id: string;
    email: string;
    userName: string;
};

type AuthContextType = {
    user: User | null;
    token: string | null;
    login: (userData: { user: User; token: string }) => Promise<void>;
    logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);

    const login = async (userData: { _id: string; email: string; userName: string; token: string }) => {
        try {
            const { token, ...userInfo } = userData;

            // Store user data and token
            await AsyncStorage.setItem('user', JSON.stringify(userInfo));
            await AsyncStorage.setItem('token', token);

            setUser(userInfo);
            setToken(token);
        } catch (error) {
            console.error('Error storing auth data:', error);
        }
    };

    const logout = async () => {
        try {
            await AsyncStorage.removeItem('user');
            await AsyncStorage.removeItem('token');
            setUser(null);
            setToken(null);
        } catch (error) {
            console.error('Error removing auth data:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ user, token, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}; 