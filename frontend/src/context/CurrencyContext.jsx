/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import userService from '../services/userService';
import { formatCurrency, formatCurrencyCompact, getCurrencySymbol, CURRENCIES } from '../utils/currencyUtils';

const CurrencyContext = createContext();

export const useCurrency = () => {
    const context = useContext(CurrencyContext);
    if (!context) {
        throw new Error('useCurrency must be used within a CurrencyProvider');
    }
    return context;
};

export const CurrencyProvider = ({ children }) => {
    const [currency, setCurrency] = useState('INR');
    const [loading, setLoading] = useState(true);

    // Load user's currency preference on mount - only if authenticated
    useEffect(() => {
        const loadCurrency = async () => {
            // Check if user is authenticated before making API call
            const token = localStorage.getItem('token');
            if (!token) {
                setLoading(false);
                return;
            }

            try {
                const response = await userService.getProfile();
                if (response.data?.currency) {
                    setCurrency(response.data.currency);
                }
            } catch (error) {
                console.error('Failed to load currency preference:', error);
                // Default to INR if failed
                setCurrency('INR');
            } finally {
                setLoading(false);
            }
        };

        loadCurrency();
    }, []);

    // Update currency preference
    const updateCurrency = useCallback(async (newCurrency) => {
        if (!CURRENCIES[newCurrency]) {
            console.error('Invalid currency code:', newCurrency);
            return false;
        }

        try {
            await userService.updateProfile({ currency: newCurrency });
            setCurrency(newCurrency);
            return true;
        } catch (error) {
            console.error('Failed to update currency:', error);
            return false;
        }
    }, []);

    // Format amount with current currency
    const format = useCallback((amount) => {
        return formatCurrency(amount, currency);
    }, [currency]);

    // Format amount in compact form
    const formatCompact = useCallback((amount) => {
        return formatCurrencyCompact(amount, currency);
    }, [currency]);

    // Get current currency symbol
    const symbol = getCurrencySymbol(currency);

    const value = {
        currency,
        symbol,
        loading,
        format,
        formatCompact,
        updateCurrency,
        currencies: CURRENCIES,
    };

    return (
        <CurrencyContext.Provider value={value}>
            {children}
        </CurrencyContext.Provider>
    );
};

export default CurrencyContext;
