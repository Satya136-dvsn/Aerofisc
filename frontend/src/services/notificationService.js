import api from './api';

const notificationService = {
    getAll: () => {
        return api.get('/notifications');
    },
    getUnreadCount: () => {
        return api.get('/notifications/unread-count');
    },
    markAsRead: (id) => {
        return api.put(`/notifications/${id}/read`);
    },
    markAllAsRead: () => {
        return api.put('/notifications/read-all');
    },
    delete: (id) => {
        return api.delete(`/notifications/${id}`);
    }
};

export default notificationService;
