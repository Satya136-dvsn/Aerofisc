/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import api from './api';

const dashboardService = {
  getSummary: () => api.get('/dashboard/summary'),

  getMonthlyTrends: (months = 6) =>
    api.get('/dashboard/monthly-trends', { params: { months } }),

  getCategoryBreakdown: () => api.get('/dashboard/category-breakdown'),

  getRecentTransactions: (limit = 5) =>
    api.get('/dashboard/recent-transactions', { params: { limit } }),
};

export default dashboardService;
