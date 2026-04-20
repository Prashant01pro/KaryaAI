import axiosInstance from '../api/axiosInstance';

/**
 * Auth Service
 * Handles real authentication calls to the backend.
 */
export const authService = {
    login: async (credentials) => {
        const response = await axiosInstance.post('/auth/login', credentials);
        const { accessToken, user } = response.data;
        
        // Persist token
        localStorage.setItem('accessToken', accessToken);
        
        return { user, accessToken };
    },

    signup: async (userData) => {
        const response = await axiosInstance.post('/auth/signup', userData);
        const { accessToken, user } = response.data;
        
        // Persist token
        localStorage.setItem('accessToken', accessToken);
        
        return { user, accessToken };
    },

    logout: async () => {
        try {
            await axiosInstance.post('/auth/logout');
        } finally {
            localStorage.removeItem('accessToken');
        }
    },

    getMe: async () => {
        const response = await axiosInstance.get('/auth/me');
        return response.data; // { status, user }
    },

    updateMe: async (userData) => {
        const response = await axiosInstance.patch('/auth/me', userData);
        return response.data; // { status, message, user }
    }
};
