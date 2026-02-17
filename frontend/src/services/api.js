/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add JWT token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor to handle token expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || '';

    console.error('API Error:', status, error.response?.data);
    console.log('Request URL:', url);
    console.log('Token in localStorage:', localStorage.getItem('token')?.substring(0, 50));

    const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/register');
    const isAuthError = status === 401 || status === 403;

    // For general auth errors (expired/invalid session), clear auth and redirect to login.
    // For login/register errors, let the calling page handle the error and show a message.
    if (isAuthError && !isAuthEndpoint) {
      console.warn(`${status} auth error - redirecting to login`);
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }

    return Promise.reject(error);
  }
);

export default api;
