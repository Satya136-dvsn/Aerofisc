/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import axios from 'axios';

// Create axios instance with base URL
const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const apiClient = axios.create({
    baseURL: BASE_URL,
    headers: {
        'Content-Type': 'application/json',
    },
    timeout: 60000, // 60 seconds — Render free tier cold starts take 30-60s
});

// Request interceptor - Add JWT token to all requests
apiClient.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem('token');
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

// Response interceptor - Handle errors and token refresh
apiClient.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const originalRequest = error.config;

        // Handle 401 Unauthorized - try to refresh token
        if (error.response?.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('refreshToken');
                if (refreshToken) {
                    const response = await axios.post(`${BASE_URL}/auth/refresh`, {
                        refreshToken,
                    });

                    const { accessToken, refreshToken: newRefreshToken } = response.data;
                    localStorage.setItem('token', accessToken);
                    localStorage.setItem('refreshToken', newRefreshToken);

                    // Retry the original request with new token
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;
                    return apiClient(originalRequest);
                }
            } catch (refreshError) {
                // Refresh failed - logout user
                localStorage.removeItem('token');
                localStorage.removeItem('refreshToken');
                localStorage.removeItem('user');
                window.location.href = '/login';
                return Promise.reject(refreshError);
            }
        }

        // Handle network errors
        if (!error.response) {
            console.error('Network error:', error.message);
            return Promise.reject({
                message: 'Network error. Please check your connection.',
                type: 'network',
            });
        }

        // Handle other errors — sanitize any leaked DB/JDBC text
        const rawMessage = error.response?.data?.message || error.message || 'An error occurred';
        const dbErrorPatterns = /prepared statement|JDBC|transaction is aborted|relation.*does not exist|current transaction|SQLSTATE/i;
        const errorMessage = dbErrorPatterns.test(rawMessage)
            ? 'A server error occurred. Please try again.'
            : rawMessage;
        return Promise.reject({
            message: errorMessage,
            status: error.response?.status,
            data: error.response?.data,
        });
    }
);

export default apiClient;
