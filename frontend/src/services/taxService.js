/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import api from './api';

const taxService = {
    getEstimate: () => api.get('/tax/estimate'),
};

export default taxService;
