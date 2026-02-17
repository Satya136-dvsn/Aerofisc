/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { render, screen, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { BrowserRouter } from 'react-router-dom';
import Dashboard from './Dashboard';
import dashboardService from '../services/dashboardService';

// Mock dashboardService
vi.mock('../services/dashboardService', () => ({
    default: {
        getSummary: vi.fn(),
        getMonthlyTrends: vi.fn(),
        getCategoryBreakdown: vi.fn(),
        getRecentTransactions: vi.fn(),
    },
}));

// Mock exportService
vi.mock('../services/exportService', () => ({
    default: {
        exportDashboard: vi.fn(),
    },
}));

// Mock Recharts
vi.mock('recharts', () => {
    const OriginalModule = vi.importActual('recharts');
    return {
        ...OriginalModule,
        ResponsiveContainer: ({ children }) => <div className="recharts-responsive-container">{children}</div>,
        LineChart: () => <div data-testid="line-chart">Line Chart</div>,
        PieChart: () => <div data-testid="pie-chart">Pie Chart</div>,
        Line: () => null,
        Pie: () => null,
        Cell: () => null,
        XAxis: () => null,
        YAxis: () => null,
        CartesianGrid: () => null,
        Tooltip: () => null,
        Legend: () => null,
    };
});

describe('Dashboard Page', () => {
    beforeEach(() => {
        vi.clearAllMocks();

        // Default mock implementation
        dashboardService.getSummary.mockResolvedValue({
            data: {
                totalIncome: 5000,
                totalExpenses: 2000,
                balance: 3000,
                savingsRate: 60,
                transactionCount: 10,
                budgetCount: 5,
                goalCount: 3
            }
        });
        dashboardService.getMonthlyTrends.mockResolvedValue({ data: [] });
        dashboardService.getCategoryBreakdown.mockResolvedValue({ data: [] });
        dashboardService.getRecentTransactions.mockResolvedValue({ data: [] });
    });

    it('renders loading state initially', () => {
        // Return a promise that never resolves to keep it in loading state
        dashboardService.getSummary.mockReturnValue(new Promise(() => { }));

        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        // Check for skeletons or loading indicators
        // Since Skeleton doesn't have text, we check if main content is NOT present
        expect(screen.queryByText('Total Income')).not.toBeInTheDocument();
    });

    it('renders dashboard data after loading', async () => {
        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Total Income')).toBeInTheDocument();
            expect(screen.getByText('₹5,000')).toBeInTheDocument(); // Assuming formatCurrency adds symbol
            expect(screen.getByText('Total Expenses')).toBeInTheDocument();
            expect(screen.getByText('₹2,000')).toBeInTheDocument();
        });
    });

    it('handles API errors gracefully', async () => {
        dashboardService.getSummary.mockRejectedValue(new Error('API Error'));

        render(
            <BrowserRouter>
                <Dashboard />
            </BrowserRouter>
        );

        await waitFor(() => {
            expect(screen.getByText('Failed to load dashboard data')).toBeInTheDocument();
        });
    });
});
