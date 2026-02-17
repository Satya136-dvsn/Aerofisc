/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import api from './api';

const retirementService = {
    getAll: () => api.get('/retirement'),
    getById: (id) => api.get(`/retirement/${id}`),
    create: (data) => api.post('/retirement', data),
    update: (id, data) => api.put(`/retirement/${id}`, data),
    delete: (id) => api.delete(`/retirement/${id}`),
    getProjection: (years = 30, returnRate = 0.07) =>
        api.get('/retirement/projection', { params: { years, returnRate } }),
};

export default retirementService;
