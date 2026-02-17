/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import api from './api';

const forumService = {
    getPosts: async (params) => {
        // Mock data for now, replace with api.get('/forum/posts', { params })
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: [
                        {
                            id: 1,
                            author: 'Sarah J.',
                            avatar: 'S',
                            title: 'How I saved $10k in 6 months using the 50/30/20 rule',
                            content: 'I finally hit my savings goal! Here is a breakdown of how I structured my budget and cut down on unnecessary expenses...',
                            category: 'Savings Tips',
                            likes: 45,
                            comments: 12,
                            time: '2 hours ago',
                        },
                        {
                            id: 2,
                            author: 'Mike T.',
                            avatar: 'M',
                            title: 'Best investment platforms for beginners?',
                            content: 'I am looking to start investing in ETFs. Does anyone have recommendations for platforms with low fees and good educational resources?',
                            category: 'Investing',
                            likes: 28,
                            comments: 34,
                            time: '5 hours ago',
                        },
                        {
                            id: 3,
                            author: 'Emily R.',
                            avatar: 'E',
                            title: 'Debt snowball vs. Debt avalanche: My experience',
                            content: 'I tried both methods to pay off my student loans. Here is why the snowball method worked better for my psychology...',
                            category: 'Debt Management',
                            likes: 56,
                            comments: 8,
                            time: '1 day ago',
                        },
                    ]
                });
            }, 500);
        });
    },

    createPost: async (postData) => {
        // Mock call, replace with api.post('/forum/posts', postData)
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: {
                        id: Math.floor(Math.random() * 1000),
                        ...postData,
                        author: 'You',
                        avatar: 'Y',
                        likes: 0,
                        comments: 0,
                        time: 'Just now'
                    }
                });
            }, 500);
        });
    },

    likePost: async (postId) => {
        // Mock call, replace with api.post(`/forum/posts/${postId}/like`)
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ data: { success: true } });
            }, 200);
        });
    },

    addComment: async (postId, comment) => {
        // Mock call, replace with api.post(`/forum/posts/${postId}/comments`, { comment })
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ data: { success: true } });
            }, 300);
        });
    }
};

export default forumService;
