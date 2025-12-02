import { create } from 'zustand';
import axios from 'axios';

const api = axios.create({
    baseURL: 'http://localhost:8080',
});

const useAuthStore = create((set) => ({
    user: JSON.parse(localStorage.getItem('user')) || null,
    token: localStorage.getItem('token') || null,
    isAuthenticated: !!localStorage.getItem('token'),
    error: null,

    login: async (username, password) => {
        try {
            const response = await api.post('/auth/login', { username, password });
            const { token, role, username: userUsername, userId } = response.data;
            const userData = { username: userUsername, role: role.replace('ROLE_', ''), idUsuario: userId };

            localStorage.setItem('token', token);
            localStorage.setItem('user', JSON.stringify(userData));

            set({ user: userData, token, isAuthenticated: true, error: null });
            return true;
        } catch (error) {
            set({ error: error.response?.data?.message || 'Login failed' });
            return false;
        }
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        set({ user: null, token: null, isAuthenticated: false, error: null });
    },
}));

export default useAuthStore;
