/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import api from './api';

const debtService = {
    getAll: () => api.get('/debts'),

    getById: (id) => api.get(`/debts/${id}`),

    create: (data) => api.post('/debts', data),

    update: (id, data) => api.put(`/debts/${id}`, data),

    delete: (id) => api.delete(`/debts/${id}`),

    getSummary: () => api.get('/debts/summary'),

    getPayoffPlan: (strategy = 'AVALANCHE', extraPayment = 0) =>
        api.get('/debts/payoff-plan', {
            params: { strategy, extraPayment }
        }),
};

export default debtService;
