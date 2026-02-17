/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import api from './api';

const adminService = {
    // System Statistics
    getSystemStats: async () => {
        return api.get('/admin/stats');
    },

    // User Management
    getAllUsers: async (page = 0, size = 10) => {
        return api.get(`/admin/users?page=${page}&size=${size}`);
    },

    getUserById: async (userId) => {
        return api.get(`/admin/users/${userId}`);
    },

    toggleUserStatus: async (userId, enabled) => {
        return api.put(`/admin/users/${userId}/status`, { enabled });
    },

    changeUserRole: async (userId, role) => {
        return api.put(`/admin/users/${userId}/role`, { role });
    },

    deleteUser: async (userId) => {
        return api.delete(`/admin/users/${userId}`);
    },

    // Audit Logs
    getAuditLogs: async (page = 0, size = 10) => {
        return api.get(`/admin/audit-logs?page=${page}&size=${size}`);
    },

    getAdminAuditLogs: async (adminUserId, page = 0, size = 10) => {
        return api.get(`/admin/audit-logs/admin/${adminUserId}?page=${page}&size=${size}`);
    },

    // Category Management
    getAllCategories: async () => {
        return api.get('/admin/categories');
    },

    // Legacy compatibility methods (map to new methods)
    getStats: async () => {
        return adminService.getSystemStats();
    },

    getUsers: async () => {
        return adminService.getAllUsers(0, 100);
    },

    updateUserStatus: async (userId, status) => {
        const enabled = status === 'Active' || status === true;
        return adminService.toggleUserStatus(userId, enabled);
    },

    getUserTransactions: async (userId, page = 0, size = 20) => {
        return api.get(`/admin/users/${userId}/transactions?page=${page}&size=${size}`);
    },

    getUserProfile: async (userId) => {
        return api.get(`/admin/users/${userId}/profile`);
    },
};

export default adminService;
