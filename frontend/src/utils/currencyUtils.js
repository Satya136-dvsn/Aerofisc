/**
 * Currency Utilities for Multi-Currency Support
 * Supports: INR (₹), USD ($), EUR (€), GBP (£), JPY (¥)
 */

// Supported currencies with their configurations
export const CURRENCIES = {
    INR: { symbol: '₹', code: 'INR', locale: 'en-IN', name: 'Indian Rupee' },
    USD: { symbol: '$', code: 'USD', locale: 'en-US', name: 'US Dollar' },
    EUR: { symbol: '€', code: 'EUR', locale: 'de-DE', name: 'Euro' },
    GBP: { symbol: '£', code: 'GBP', locale: 'en-GB', name: 'British Pound' },
    JPY: { symbol: '¥', code: 'JPY', locale: 'ja-JP', name: 'Japanese Yen' },
};

/**
 * Format a number as currency based on the user's preferred currency
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - Currency code (INR, USD, EUR, etc.)
 * @param {object} options - Additional formatting options
 * @returns {string} Formatted currency string
 */
export const formatCurrency = (amount, currencyCode = 'INR', options = {}) => {
    const currency = CURRENCIES[currencyCode] || CURRENCIES.INR;

    try {
        return new Intl.NumberFormat(currency.locale, {
            style: 'currency',
            currency: currency.code,
            minimumFractionDigits: currency.code === 'JPY' ? 0 : 2,
            maximumFractionDigits: currency.code === 'JPY' ? 0 : 2,
            ...options,
        }).format(amount);
    } catch (error) {
        // Fallback formatting
        return `${currency.symbol}${amount.toLocaleString()}`;
    }
};

/**
 * Format a number with compact notation (1K, 1M, etc.)
 * @param {number} amount - The amount to format
 * @param {string} currencyCode - Currency code
 * @returns {string} Compact formatted string
 */
export const formatCurrencyCompact = (amount, currencyCode = 'INR') => {
    const currency = CURRENCIES[currencyCode] || CURRENCIES.INR;

    try {
        return new Intl.NumberFormat(currency.locale, {
            style: 'currency',
            currency: currency.code,
            notation: 'compact',
            compactDisplay: 'short',
        }).format(amount);
    } catch (error) {
        return `${currency.symbol}${amount.toLocaleString()}`;
    }
};

/**
 * Parse a currency string back to a number
 * @param {string} currencyString - The formatted currency string
 * @param {string} currencyCode - Currency code
 * @returns {number} Parsed number
 */
export const parseCurrency = (currencyString, currencyCode = 'INR') => {
    if (typeof currencyString === 'number') return currencyString;

    // Remove currency symbols and non-numeric characters except decimal point
    const cleanedString = currencyString
        .replace(/[₹$€£¥,\s]/g, '')
        .replace(/[^\d.-]/g, '');

    return parseFloat(cleanedString) || 0;
};

/**
 * Get the currency symbol for a given currency code
 * @param {string} currencyCode - Currency code
 * @returns {string} Currency symbol
 */
export const getCurrencySymbol = (currencyCode = 'INR') => {
    return CURRENCIES[currencyCode]?.symbol || '₹';
};

/**
 * Get a list of all supported currencies for dropdowns
 * @returns {Array} Array of currency options
 */
export const getCurrencyOptions = () => {
    return Object.entries(CURRENCIES).map(([code, config]) => ({
        value: code,
        label: `${config.symbol} ${config.name} (${code})`,
        symbol: config.symbol,
    }));
};

export default {
    CURRENCIES,
    formatCurrency,
    formatCurrencyCompact,
    parseCurrency,
    getCurrencySymbol,
    getCurrencyOptions,
};
