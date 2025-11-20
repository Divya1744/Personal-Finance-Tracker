import React, { createContext, useState, useContext, useEffect } from 'react';
import { login as loginApi, register as registerApi, logout as logoutApi } from '../services/financeService';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [auth, setAuth] = useState(null);
    const [loading, setLoading] = useState(true);

    // Load auth data from local storage on mount
    useEffect(() => {
        const storedAuthData = localStorage.getItem('authData');
        if (storedAuthData) {
            setAuth(JSON.parse(storedAuthData));
        }
        setLoading(false);
    }, []);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await loginApi({ email, password });
            const authData = response.data; // { accessToken, refreshToken, userId }
            
            localStorage.setItem('authData', JSON.stringify(authData));
            setAuth(authData);
            return authData;
        } finally {
            setLoading(false);
        }
    };

    const register = async (data) => {
        setLoading(true);
        try {
            const response = await registerApi(data);
            return response.data; // { uuid, username, email, isAccountVerified }
        } finally {
            setLoading(false);
        }
    };

    const logout = async () => {
        if (!auth) return;
        setLoading(true);
        try {
            // Optional: Call backend logout to clear refresh token from DB
            await logoutApi(auth.email); 
        } catch (error) {
            console.error("Logout failed on backend, but clearing local state.", error);
        } finally {
            localStorage.removeItem('authData');
            setAuth(null);
            setLoading(false);
            window.location.href = '/login'; // Redirect to login
        }
    };

    const value = {
        auth,
        loading,
        userId: auth?.userId,
        login,
        register,
        logout,
        isAuthenticated: !!auth && !!auth.accessToken,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};