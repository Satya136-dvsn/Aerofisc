// Mock banking service for bank account integration
const bankingService = {
    // Get all connected bank accounts
    getAccounts: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: [], // No mock accounts
                });
            }, 500);
        });
    },

    // Connect a new bank account (mock OAuth flow)
    connectBank: async (bankData) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                reject(new Error('Real-time banking integration is currently unavailable. Please check back later.'));
            }, 1000);
        });
    },

    // Disconnect a bank account
    disconnectBank: async (accountId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: { success: true },
                    message: 'Bank account disconnected',
                });
            }, 500);
        });
    },

    // Sync transactions from bank
    syncTransactions: async (accountId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: {
                        accountId,
                        lastSync: new Date().toISOString(),
                        newTransactions: Math.floor(Math.random() * 10),
                    },
                    message: 'Transactions synced successfully',
                });
            }, 2000);
        });
    },

    // Get available banks list
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

    // Import transactions from connected account
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
