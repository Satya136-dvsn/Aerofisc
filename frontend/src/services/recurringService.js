/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import apiClient from './axiosConfig';

const recurringService = {
    /**
     * Get all recurring transactions
     */
    getAll: async (activeOnly = false) => {
        const response = await apiClient.get(`/recurring-transactions?activeOnly=${activeOnly}`);
        return response.data;
    },

    /**
     * Get a specific recurring transaction
     */
    getById: async (id) => {
        const response = await apiClient.get(`/recurring-transactions/${id}`);
        return response.data;
    },

    /**
     * Create a new recurring transaction
     */
    create: async (data) => {
        const response = await apiClient.post('/recurring-transactions', data);
        return response.data;
    },

    /**
     * Update an existing recurring transaction
     */
    update: async (id, data) => {
        const response = await apiClient.put(`/recurring-transactions/${id}`, data);
        return response.data;
    },

    /**
     * Toggle active status
     */
    toggleActive: async (id) => {
        const response = await apiClient.patch(`/recurring-transactions/${id}/toggle`);
        return response.data;
    },

    /**
     * Delete a recurring transaction
     */
    delete: async (id) => {
        await apiClient.delete(`/recurring-transactions/${id}`);
    },

    /**
     * Manually trigger processing (for testing)
     */
    processNow: async () => {
        const response = await apiClient.post('/recurring-transactions/process');
        return response.data;
    },

    /**
     * Get frequency options for dropdowns
     */
    getFrequencyOptions: () => [
        { value: 'DAILY', label: 'Daily' },
        { value: 'WEEKLY', label: 'Weekly' },
        { value: 'BI_WEEKLY', label: 'Every 2 Weeks' },
        { value: 'MONTHLY', label: 'Monthly' },
        { value: 'QUARTERLY', label: 'Quarterly' },
        { value: 'YEARLY', label: 'Yearly' },
    ],

    /**
     * Get type options for dropdowns
     */
    getTypeOptions: () => [
        { value: 'INCOME', label: 'Income' },
        { value: 'EXPENSE', label: 'Expense' },
    ],
};

export default recurringService;
