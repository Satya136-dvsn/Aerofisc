import apiClient from './axiosConfig';

const exportService = {
    /**
     * Export transactions in specified format
     */
    exportTransactions: async (startDate, endDate, format = 'csv') => {
        const params = new URLSearchParams();
        if (startDate) params.append('startDate', startDate);
        if (endDate) params.append('endDate', endDate);
        params.append('format', format);

        const response = await apiClient.get(`/export/transactions?${params}`, {
            responseType: 'blob',
        });

        const extension = format === 'excel' ? 'xlsx' : format;
        downloadFile(response.data, `transactions.${extension}`);
    },

    /**
     * Export all data (transactions, budgets, goals) in specified format
     */
    exportAllData: async (format = 'csv') => {
        const response = await apiClient.get(`/export/all-data?format=${format}`, {
            responseType: 'blob',
        });

        const extension = format === 'excel' ? 'xlsx' : format;
        downloadFile(response.data, `aerofisc-data.${extension}`);
    },

    /**
     * Export dashboard summary in specified format
     */
    exportDashboard: async (format = 'excel') => {
        console.log(`Exporting dashboard with format: ${format}`);
        const url = `/export/dashboard?format=${format}`;
        const response = await apiClient.get(url, {
            responseType: 'blob',
        });

        const extension = format === 'excel' ? 'xlsx' : format;
        downloadFile(response.data, `dashboard.${extension}`);
    },

    /**
     * Export budgets in specified format
     */
    exportBudgets: async (format = 'excel') => {
        const response = await apiClient.get(`/export/budgets?format=${format}`, {
            responseType: 'blob',
        });

        const extension = format === 'excel' ? 'xlsx' : format;
        downloadFile(response.data, `budgets.${extension}`);
    },

    /**
     * Export analytics data in specified format
     */
    exportAnalytics: async (timeRange = '3M', format = 'excel') => {
        console.log(`Exporting analytics with timeRange: ${timeRange}, format: ${format}`);
        const url = `/export/analytics?timeRange=${timeRange}&format=${format}`;
        const response = await apiClient.get(url, {
            responseType: 'blob',
        });

        const extension = format === 'excel' ? 'xlsx' : format;
        downloadFile(response.data, `analytics_${timeRange}.${extension}`);
    },

    // Convenience methods for Analytics
    exportAnalyticsExcel: async (timeRange) => {
        return exportService.exportAnalytics(timeRange, 'excel');
    },

    exportAnalyticsPDF: async (timeRange) => {
        return exportService.exportAnalytics(timeRange, 'pdf');
    },

    /**
     * Export savings goals in specified format
     */
    exportGoals: async (format = 'excel') => {
        const response = await apiClient.get(`/export/goals?format=${format}`, {
            responseType: 'blob',
        });

        const extension = format === 'excel' ? 'xlsx' : format;
        downloadFile(response.data, `savings-goals.${extension}`);
    },
};

/**
 * Helper function to trigger file download
 */
const downloadFile = (blob, filename) => {
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', filename);
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    window.URL.revokeObjectURL(url);
};

export default exportService;
