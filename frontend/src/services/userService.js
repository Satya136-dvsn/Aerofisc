import api from './api';

const userService = {
    getProfile: async () => {
        return api.get('/profile');
    },

    updateProfile: async (data) => {
        return api.put('/profile', data);
    },

    changePassword: async (data) => {
        return api.put('/users/change-password', data);
    },

    updatePreferences: async (data) => {
        return api.put('/users/preferences', data);
    },

    updateNotifications: async (data) => {
        return api.put('/users/notifications', data);
    },

    uploadAvatar: async (formData) => {
        return api.post('/users/avatar', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
    },

    // GDPR Features
    exportData: async () => {
        return api.get('/gdpr/export', {
            responseType: 'blob'
        });
    },

    deleteAccount: async (password) => {
        return api.delete('/gdpr/account', {
            data: { password }
        });
    }
};

export default userService;
