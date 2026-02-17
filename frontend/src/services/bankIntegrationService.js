/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

/**
 * Mock Bank Integration Service
 * Simulates bank account connection and transaction syncing
 * In production, this would integrate with services like Plaid, Yodlee, etc.
 */

// Mock bank accounts
const MOCK_BANK_ACCOUNTS = [
    {
        id: 'acc_001',
        bankName: 'State Bank of India',
        bankLogo: '🏦',
        accountType: 'SAVINGS',
        accountNumber: '****4521',
        balance: 125000.50,
        currency: 'INR',
        lastSynced: new Date().toISOString(),
        isConnected: true,
    },
    {
        id: 'acc_002',
        bankName: 'HDFC Bank',
        bankLogo: '🏧',
        accountType: 'CURRENT',
        accountNumber: '****7832',
        balance: 45000.00,
        currency: 'INR',
        lastSynced: new Date().toISOString(),
        isConnected: true,
    },
    {
        id: 'acc_003',
        bankName: 'ICICI Bank',
        bankLogo: '💳',
        accountType: 'CREDIT_CARD',
        accountNumber: '****9012',
        balance: -15000.00, // Credit used
        creditLimit: 100000,
        currency: 'INR',
        lastSynced: new Date().toISOString(),
        isConnected: true,
    },
];

// Mock transactions from bank
const generateMockTransactions = (count = 10) => {
    const categories = [
        { name: 'Groceries', type: 'EXPENSE' },
        { name: 'Salary', type: 'INCOME' },
        { name: 'Utilities', type: 'EXPENSE' },
        { name: 'Shopping', type: 'EXPENSE' },
        { name: 'Freelance', type: 'INCOME' },
        { name: 'Dining', type: 'EXPENSE' },
        { name: 'Transport', type: 'EXPENSE' },
        { name: 'Investment Returns', type: 'INCOME' },
    ];

    const merchants = [
        'Amazon India', 'BigBasket', 'Zomato', 'Uber', 'Flipkart',
        'Netflix', 'Electricity Board', 'Vodafone', 'Swiggy', 'BookMyShow',
    ];

    const transactions = [];
    const today = new Date();

    for (let i = 0; i < count; i++) {
        const category = categories[Math.floor(Math.random() * categories.length)];
        const merchant = merchants[Math.floor(Math.random() * merchants.length)];
        const daysAgo = Math.floor(Math.random() * 30);
        const date = new Date(today);
        date.setDate(date.getDate() - daysAgo);

        transactions.push({
            id: `txn_${Date.now()}_${i}`,
            bankTransactionId: `BANK_${Math.random().toString(36).substr(2, 9)}`,
            description: category.type === 'INCOME' ? category.name : `${merchant} - ${category.name}`,
            amount: category.type === 'INCOME'
                ? Math.floor(Math.random() * 50000) + 10000
                : Math.floor(Math.random() * 5000) + 100,
            type: category.type,
            category: category.name,
            date: date.toISOString().split('T')[0],
            accountId: MOCK_BANK_ACCOUNTS[Math.floor(Math.random() * 2)].id,
            status: 'COMPLETED',
            isImported: true,
        });
    }

    return transactions.sort((a, b) => new Date(b.date) - new Date(a.date));
};

/**
 * Mock Bank Integration Service
 */
const bankIntegrationService = {
    /**
     * Get list of supported banks
     * @returns {Array} List of supported banks
     */
    getSupportedBanks: () => {
        return [
            { id: 'sbi', name: 'State Bank of India', logo: '🏦' },
            { id: 'hdfc', name: 'HDFC Bank', logo: '🏧' },
            { id: 'icici', name: 'ICICI Bank', logo: '💳' },
            { id: 'axis', name: 'Axis Bank', logo: '🏛️' },
            { id: 'kotak', name: 'Kotak Mahindra Bank', logo: '🏦' },
            { id: 'pnb', name: 'Punjab National Bank', logo: '🏛️' },
        ];
    },

    /**
     * Simulate bank account connection
     * @param {string} bankId - Bank ID to connect
     * @returns {Promise} Connection result
     */
    connectBank: async (bankId) => {
        // Simulate API delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        // Simulate successful connection
        return {
            success: true,
            message: 'Bank connected successfully',
            accounts: MOCK_BANK_ACCOUNTS.filter((_, i) => i === 0), // Return one account
        };
    },

    /**
     * Get connected bank accounts
     * @returns {Promise<Array>} List of connected accounts
     */
    getConnectedAccounts: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));
        return MOCK_BANK_ACCOUNTS;
    },

    /**
     * Sync transactions from a bank account
     * @param {string} accountId - Account ID to sync
     * @param {number} days - Number of days to sync
     * @returns {Promise} Sync result with transactions
     */
    syncTransactions: async (accountId, days = 30) => {
        await new Promise(resolve => setTimeout(resolve, 2000));

        const transactions = generateMockTransactions(Math.floor(Math.random() * 10) + 5);

        return {
            success: true,
            message: `Synced ${transactions.length} transactions`,
            transactions,
            lastSynced: new Date().toISOString(),
        };
    },

    /**
     * Get account balance
     * @param {string} accountId - Account ID
     * @returns {Promise} Account balance info
     */
    getAccountBalance: async (accountId) => {
        await new Promise(resolve => setTimeout(resolve, 300));

        const account = MOCK_BANK_ACCOUNTS.find(a => a.id === accountId);
        if (!account) {
            throw new Error('Account not found');
        }

        return {
            accountId,
            balance: account.balance,
            currency: account.currency,
            lastUpdated: new Date().toISOString(),
        };
    },

    /**
     * Disconnect a bank account
     * @param {string} accountId - Account ID to disconnect
     * @returns {Promise} Disconnect result
     */
    disconnectAccount: async (accountId) => {
        await new Promise(resolve => setTimeout(resolve, 500));

        return {
            success: true,
            message: 'Account disconnected successfully',
        };
    },

    /**
     * Get pending transactions that need categorization
     * @returns {Promise<Array>} Uncategorized transactions
     */
    getPendingImports: async () => {
        await new Promise(resolve => setTimeout(resolve, 500));

        return generateMockTransactions(3).map(t => ({
            ...t,
            status: 'PENDING_REVIEW',
            suggestedCategory: t.category,
        }));
    },

    /**
     * Import a transaction into the main system
     * @param {Object} transaction - Transaction to import
     * @returns {Promise} Import result
     */
    importTransaction: async (transaction) => {
        await new Promise(resolve => setTimeout(resolve, 300));

        return {
            success: true,
            message: 'Transaction imported successfully',
            transactionId: transaction.id,
        };
    },
};

export default bankIntegrationService;
export { MOCK_BANK_ACCOUNTS, generateMockTransactions };
