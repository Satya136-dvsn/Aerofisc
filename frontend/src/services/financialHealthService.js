/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import api from './api';

const financialHealthService = {
    getHealthScore: () => api.get('/financial-health/score'),
};

export default financialHealthService;
