/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import apiClient from './axiosConfig';

// Banking service for bank account integration
const bankingService = {
    // Get all connected bank accounts
    getAccounts: async () => {
        return apiClient.get('/banking/accounts');
    },

    // Connect a new bank account
    connectBank: async (bankData) => {
        return apiClient.post('/banking/link', bankData);
    },

    // Disconnect a bank account
    disconnectBank: async (accountId) => {
        return apiClient.delete(`/banking/${accountId}`);
    },

    // Sync transactions from bank
    syncTransactions: async (accountId) => {
        return apiClient.post(`/banking/${accountId}/sync`);
    },

    // Get available banks list (Mock for now as it's static data)
    getAvailableBanks: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: [
                        { id: 1, name: 'HDFC Bank', logo: '🏦' },
                        { id: 2, name: 'ICICI Bank', logo: '🏦' },
                        { id: 3, name: 'SBI', logo: '🏦' },
                        { id: 4, name: 'Axis Bank', logo: '🏦' },
                        { id: 5, name: 'Kotak Mahindra Bank', logo: '🏦' },
                    ],
                });
            }, 300);
        });
    },

    // Import transactions (Not needed with real sync, but keeping for compatibility)
    importTransactions: async (accountId, transactions) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: {
                        imported: transactions.length,
                        accountId,
                    },
                    message: `${transactions.length} transactions imported successfully`,
                });
            }, 1000);
        });
    },
};

export default bankingService;
