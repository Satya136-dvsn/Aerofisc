/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import api from './api';

const billService = {
    getBills: async () => {
        return await api.get('/bills');
    },

    addBill: async (billData) => {
        return await api.post('/bills', billData);
    },

    markAsPaid: async (billId) => {
        return await api.post(`/bills/${billId}/pay`);
    },

    deleteBill: async (billId) => {
        return await api.delete(`/bills/${billId}`);
    },
};

export default billService;
