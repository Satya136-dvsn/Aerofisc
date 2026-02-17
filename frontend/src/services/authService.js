/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import apiClient from './axiosConfig';

const authService = {
    login: async (email, password) => {
        const response = await apiClient.post('/auth/login', { email, password });
        const { accessToken, refreshToken, user, mfaRequired, preAuthToken } = response.data;

        if (mfaRequired) {
            return { mfaRequired, preAuthToken };
        }

        if (accessToken) {
            localStorage.setItem('token', accessToken);
            localStorage.setItem('user', JSON.stringify(user));

            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            }
        }

        return response.data;
    },

    verifyMfa: async (preAuthToken, code) => {
        const response = await apiClient.post('/auth/verify-mfa', { secret: preAuthToken, code: parseInt(code) });
        const { accessToken, refreshToken, user } = response.data;

        if (accessToken) {
            localStorage.setItem('token', accessToken);
            localStorage.setItem('user', JSON.stringify(user));

            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            }
        }

        return response.data;
    },

    setupMfa: async () => {
        const response = await apiClient.post('/mfa/setup');
        return response.data;
    },

    enableMfa: async (secret, code) => {
        const response = await apiClient.post('/mfa/enable', { secret, code: parseInt(code) });
        return response.data;
    },

    disableMfa: async () => {
        const response = await apiClient.post('/mfa/disable');
        return response.data;
    },

    register: async (userData) => {
        const response = await apiClient.post('/auth/register', userData);
        const { accessToken, refreshToken, user } = response.data;

        if (accessToken) {
            localStorage.setItem('token', accessToken);
            localStorage.setItem('user', JSON.stringify(user));

            if (refreshToken) {
                localStorage.setItem('refreshToken', refreshToken);
            }
        }

        return response.data;
    },

    logout: () => {
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        localStorage.removeItem('user');
    },

    getCurrentUser: () => {
        const userStr = localStorage.getItem('user');
        return userStr ? JSON.parse(userStr) : null;
    },

    getToken: () => {
        return localStorage.getItem('token');
    },
};

export default authService;
