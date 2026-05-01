import React, { createContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [loading, setLoading] = useState(true);

    const login = async (credentials) => {
        try {
            const data = await authService.login(credentials);
            setUser(data.user);
            setIsAuthenticated(true);
            return data;
        } catch (error) {
            console.error('Login failed', error);
            throw error;
        }
    };

    const signup = async (userData) => {
        try {
            const data = await authService.signup(userData);
            setUser(data.user);
            setIsAuthenticated(true);
            return data;
        } catch (error) {
            console.error('Signup failed', error);
            throw error;
        }
    };

    const logout = async () => {
        await authService.logout();
        setUser(null);
        setIsAuthenticated(false);
    };

    const updateProfile = async (userData) => {
        try {
            const data = await authService.updateMe(userData);
            setUser(data.user);
            return data;
        } catch (error) {
            console.error('Profile update failed', error);
            throw error;
        }
    };

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const data = await authService.getMe();
                setUser(data.user);
                setIsAuthenticated(true);
            } catch (error) {
                // Only log error if it's not a 401 (which is expected when not logged in)
                if (error.response?.status !== 401) {
                    console.error('Session restoration failed', error);
                }
                localStorage.removeItem('accessToken');
                setIsAuthenticated(false);
            } finally {
                setLoading(false);
            }
        };
        checkAuth();
    }, []);

    return (
        <AuthContext.Provider value={{ user, isAuthenticated, loading, login, signup, logout, updateProfile }}>
            {children}
        </AuthContext.Provider>
    );
};
