import { http, HttpResponse } from 'msw';

export const handlers = [
    http.post('/api/auth/login', () => {
        return HttpResponse.json({
            token: 'fake-jwt-token',
            user: { id: 1, email: 'test@example.com', name: 'Test User' }
        });
    }),

    http.get('/api/dashboard/summary', () => {
        return HttpResponse.json({
            totalBalance: 15000.50,
            monthlyIncome: 5000.00,
            monthlyExpenses: 2500.00,
            savingsRate: 50.0,
            healthScore: 85
        });
    }),

    http.get('/api/dashboard/trends', () => {
        return HttpResponse.json([
            { month: 'Jan', income: 4000, expenses: 2000 },
            { month: 'Feb', income: 5000, expenses: 2500 }
        ]);
    }),

    http.get('/api/dashboard/categories', () => {
        return HttpResponse.json([
            { categoryName: 'Housing', amount: 1500 },
            { categoryName: 'Food', amount: 500 }
        ]);
    }),

    http.get('/api/dashboard/recent-transactions', () => {
        return HttpResponse.json([
            { id: 1, amount: -50.0, description: 'Groceries', date: '2026-03-01T10:00:00Z', category: 'Food' }
        ]);
    })
];
