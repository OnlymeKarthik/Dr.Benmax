import { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within AuthProvider');
    }
    return context;
};

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessToken] = useState(localStorage.getItem('access_token'));
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refresh_token'));

    const API_URL = 'http://localhost:8000';

    // Configure axios defaults
    useEffect(() => {
        if (accessToken) {
            axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`;
        } else {
            delete axios.defaults.headers.common['Authorization'];
        }
    }, [accessToken]);

    // Load user on mount
    useEffect(() => {
        if (accessToken) {
            loadUser();
        } else {
            setLoading(false);
        }
    }, []);

    const loadUser = async () => {
        try {
            const response = await axios.get(`${API_URL}/api/auth/me`);
            setUser(response.data);
        } catch (error) {
            console.error('Failed to load user:', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post(`${API_URL}/api/auth/login`, {
                username,
                password
            });

            const { access_token, refresh_token } = response.data;

            localStorage.setItem('access_token', access_token);
            localStorage.setItem('refresh_token', refresh_token);

            setAccessToken(access_token);
            setRefreshToken(refresh_token);

            // Set header immediately to avoid race condition with useEffect
            axios.defaults.headers.common['Authorization'] = `Bearer ${access_token}`;

            await loadUser();

            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Login failed'
            };
        }
    };

    const register = async (userData) => {
        try {
            await axios.post(`${API_URL}/api/auth/register`, userData);
            return { success: true };
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.detail || 'Registration failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        setAccessToken(null);
        setRefreshToken(null);
        setUser(null);
    };

    const value = {
        user,
        loading,
        login,
        register,
        logout,
        isAuthenticated: !!user
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
