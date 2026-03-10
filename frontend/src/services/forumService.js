/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import api from './api';

const forumService = {
    getPosts: async (params) => {
        return await api.get('/forum/posts', { params });
    },

    createPost: async (postData) => {
        return await api.post('/forum/posts', postData);
    },

    likePost: async (postId) => {
        return await api.post(`/forum/posts/${postId}/like`);
    },

    unlikePost: async (postId) => {
        return await api.delete(`/forum/posts/${postId}/like`);
    },

    addComment: async (postId, commentDto) => {
        return await api.post(`/forum/posts/${postId}/comments`, commentDto);
    },

    getComments: async (postId, params) => {
        return await api.get(`/forum/posts/${postId}/comments`, { params });
    }
};

export default forumService;
