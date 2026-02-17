/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import api from './api';

const scenarioService = {
    analyze: (incomeChange, expenseChange, savingsChange = 0) =>
        api.post('/scenarios/analyze', null, {
            params: { incomeChange, expenseChange, savingsChange }
        }),
};

export default scenarioService;
