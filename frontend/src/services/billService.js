/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

// Mock bill management service
const billService = {
    getBills: async () => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: [
                        {
                            id: 1,
                            name: 'Electricity Bill',
                            payee: 'Power Company',
                            amount: 2500,
                            dueDate: new Date(2024, 11, 25).toISOString(),
                            status: 'Pending',
                            recurring: 'Monthly',
                            category: 'Utilities',
                        },
                        {
                            id: 2,
                            name: 'Internet',
                            payee: 'ISP Provider',
                            amount: 1200,
                            dueDate: new Date(2024, 11, 15).toISOString(),
                            status: 'Paid',
                            recurring: 'Monthly',
                            category: 'Utilities',
                        },
                        {
                            id: 3,
                            name: 'Rent',
                            payee: 'Landlord',
                            amount: 25000,
                            dueDate: new Date(2025, 0, 1).toISOString(),
                            status: 'Pending',
                            recurring: 'Monthly',
                            category: 'Housing',
                        },
                    ],
                });
            }, 500);
        });
    },

    addBill: async (billData) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: { id: Date.now(), ...billData, status: 'Pending' },
                    message: 'Bill added successfully',
                });
            }, 500);
        });
    },

    markAsPaid: async (billId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({
                    data: { billId, status: 'Paid' },
                    message: 'Bill marked as paid',
                });
            }, 500);
        });
    },

    deleteBill: async (billId) => {
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ message: 'Bill deleted' });
            }, 500);
        });
    },
};

export default billService;
