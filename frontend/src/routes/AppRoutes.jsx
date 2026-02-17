/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import React, { Suspense, lazy } from 'react';
import { Routes, Route } from 'react-router-dom';
import { CircularProgress, Box } from '@mui/material';
import ProtectedRoute from '../components/ProtectedRoute';
import DashboardLayout from '../components/layout/DashboardLayout';

// Lazy load pages
const HomePage = lazy(() => import('../pages/HomePage'));
const SignIn = lazy(() => import('../pages/SignIn'));
const SignUp = lazy(() => import('../pages/SignUp'));
const Dashboard = lazy(() => import('../pages/Dashboard'));
const Transactions = lazy(() => import('../pages/Transactions'));
const Categories = lazy(() => import('../pages/Categories'));
const Budgets = lazy(() => import('../pages/Budgets'));
const SavingsGoals = lazy(() => import('../pages/SavingsGoals'));
const DesignSystemDemo = lazy(() => import('../pages/DesignSystemDemo'));
const Analytics = lazy(() => import('../pages/Analytics'));
const Reports = lazy(() => import('../pages/Reports'));
const Settings = lazy(() => import('../pages/Settings'));
const Community = lazy(() => import('../pages/Community'));
const DiscussionDetail = lazy(() => import('../pages/DiscussionDetail'));
const AdminDashboard = lazy(() => import('../pages/AdminDashboard'));
const BankingPage = lazy(() => import('../pages/BankingPage'));
const BillsPage = lazy(() => import('../pages/BillsPage'));
const InvestmentsPage = lazy(() => import('../pages/InvestmentsPage'));
const AIChat = lazy(() => import('../pages/AIChat'));
const Notifications = lazy(() => import('../pages/Notifications'));
const DebtManagementPage = lazy(() => import('../pages/DebtManagementPage'));
const FinancialHealthPage = lazy(() => import('../pages/FinancialHealthPage'));
const RetirementPage = lazy(() => import('../pages/RetirementPage'));
const TaxPlanningPage = lazy(() => import('../pages/TaxPlanningPage'));
const ScenarioAnalysisPage = lazy(() => import('../pages/ScenarioAnalysisPage'));
const RecurringTransactionsPage = lazy(() => import('../pages/RecurringTransactionsPage'));

const LoadingFallback = () => (
    <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
        <CircularProgress />
    </Box>
);

function AppRoutes() {
    return (
        <Suspense fallback={<LoadingFallback />}>
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/login" element={<SignIn />} />
                <Route path="/register" element={<SignUp />} />
                <Route path="/design-demo" element={<DesignSystemDemo />} />
                <Route
                    element={
                        <ProtectedRoute>
                            <DashboardLayout />
                        </ProtectedRoute>
                    }
                >
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/transactions" element={<Transactions />} />
                    <Route path="/categories" element={<Categories />} />
                    <Route path="/budgets" element={<Budgets />} />
                    <Route path="/goals" element={<SavingsGoals />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/reports" element={<Reports />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/community" element={<Community />} />
                    <Route path="/community/:id" element={<DiscussionDetail />} />
                    <Route path="/admin" element={<AdminDashboard />} />
                    <Route path="/banking" element={<BankingPage />} />
                    <Route path="/bills" element={<BillsPage />} />
                    <Route path="/investments" element={<InvestmentsPage />} />
                    <Route path="/ai-chat" element={<AIChat />} />
                    <Route path="/notifications" element={<Notifications />} />
                    <Route path="/debt-management" element={<DebtManagementPage />} />
                    <Route path="/financial-health" element={<FinancialHealthPage />} />
                    <Route path="/retirement" element={<RetirementPage />} />
                    <Route path="/tax-planning" element={<TaxPlanningPage />} />
                    <Route path="/scenario-analysis" element={<ScenarioAnalysisPage />} />
                    <Route path="/recurring" element={<RecurringTransactionsPage />} />
                </Route>
            </Routes>
        </Suspense>
    )
}

export default AppRoutes
