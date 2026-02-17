/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { useState, useEffect, useRef } from 'react';

import { useNavigate } from 'react-router-dom';
import { Container, Grid, Typography, Box, Fade, Paper, ToggleButton, ToggleButtonGroup } from '@mui/material';
import { ShowChart, PieChart, AccountBalanceWallet, CompareArrows } from '@mui/icons-material';
import ProfessionalCard from '../components/ui/ProfessionalCard';
import TrendAnalysisChart from '../components/analytics/TrendAnalysisChart';
import CategoryBreakdownChart from '../components/analytics/CategoryBreakdownChart';
import CashFlowChart from '../components/analytics/CashFlowChart';
import ExportMenu from '../components/common/ExportMenu';
import dashboardService from '../services/dashboardService';
import exportService from '../services/exportService';
import aiService from '../services/aiService';
import PredictionsCard from '../components/analytics/PredictionsCard';
import { AutoAwesome } from '@mui/icons-material';

const Analytics = () => {
    const navigate = useNavigate();
    const analyticsRef = useRef(null);
    const [timeRange, setTimeRange] = useState('6m');
    const [loading, setLoading] = useState(true);
    const [trends, setTrends] = useState([]);
    const [categories, setCategories] = useState([]);
    const [predictions, setPredictions] = useState([]);
    const [isExporting, setIsExporting] = useState(false);

    useEffect(() => {
        loadAnalyticsData();
    }, [timeRange]);

    const loadAnalyticsData = async () => {
        try {
            setLoading(true);
            // Fetch data based on timeRange with proper months calculation
            let months = 6; // default
            if (timeRange === '3m') months = 3;
            else if (timeRange === '6m') months = 6;
            else if (timeRange === '1y') months = 12;

            const [trendsRes, categoryRes, predictionsRes] = await Promise.all([
                dashboardService.getMonthlyTrends(months),
                dashboardService.getCategoryBreakdown(),
                aiService.getPredictions()
            ]);
            setTrends(trendsRes.data);
            setCategories(categoryRes.data);
            setPredictions(predictionsRes.data);
        } catch (error) {
            console.error('Failed to load analytics:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleTimeRangeChange = (event, newRange) => {
        if (newRange !== null) {
            setTimeRange(newRange);
        }
    };

    const handleCategoryClick = (data) => {
        if (data && data.categoryId) {
            navigate(`/transactions?category=${data.categoryId}`);
        }
    }
    const handleExport = async (format) => {
        try {
            setIsExporting(true);
            if (format === 'excel') {
                await exportService.exportAnalyticsExcel(timeRange);
            } else if (format === 'pdf') {
                await exportService.exportAnalyticsPDF(timeRange);
            }
        } catch (err) {
            console.error('[Analytics Export] Export failed:', err);
        } finally {
            setIsExporting(false);
        }
    };

    return (
        <Container maxWidth="xl" sx={{ pb: 4 }} ref={analyticsRef}>
            <Fade in timeout={300}>
                <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
                    <Box>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 0.5 }}>
                            Analytics
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Deep dive into your financial data
                        </Typography>
                    </Box>
                    <Box display="flex" gap={1} alignItems="center">
                        <ExportMenu
                            formats={['excel', 'pdf']}
                            onExport={handleExport}
                        />
                        <ToggleButtonGroup
                            value={timeRange}
                            exclusive
                            onChange={handleTimeRangeChange}
                            aria-label="time range"
                            size="small"
                        >
                            <ToggleButton value="3m">3 Months</ToggleButton>
                            <ToggleButton value="6m">6 Months</ToggleButton>
                            <ToggleButton value="1y">1 Year</ToggleButton>
                        </ToggleButtonGroup>
                    </Box>
                </Box>
            </Fade>

            <Grid container spacing={3}>
                {/* Trend Analysis */}
                <Grid item xs={12}>
                    <Fade in timeout={400}>
                        <Box>
                            <ProfessionalCard
                                title="Income vs Expenses Trend"
                                subheader="Track your earning and spending patterns over time"
                                headerAction={<ShowChart color="primary" />}
                            >
                                <Box id="analytics-trend-chart">
                                    <TrendAnalysisChart
                                        data={trends}
                                        loading={loading && !isExporting}
                                        disableAnimation={isExporting}
                                    />
                                </Box>
                            </ProfessionalCard>
                        </Box>
                    </Fade>
                </Grid>

                {/* Category Breakdown */}
                <Grid item xs={12} md={6}>
                    <Fade in timeout={500}>
                        <Box>
                            <ProfessionalCard
                                title="Spending Breakdown"
                                subheader="Where your money goes"
                                headerAction={<PieChart color="secondary" />}
                            >
                                <Box id="analytics-category-chart">
                                    <CategoryBreakdownChart
                                        data={categories}
                                        loading={loading && !isExporting}
                                        onCategoryClick={handleCategoryClick}
                                        disableAnimation={isExporting}
                                        isExporting={isExporting}
                                    />
                                </Box>
                            </ProfessionalCard>
                        </Box>
                    </Fade>
                </Grid>

                {/* Cash Flow */}
                <Grid item xs={12} md={6}>
                    <Fade in timeout={600}>
                        <Box>
                            <ProfessionalCard
                                title="Cash Flow Analysis"
                                subheader="Net savings and flow"
                                headerAction={<AccountBalanceWallet color="success" />}
                            >
                                <CashFlowChart data={trends} loading={loading} />
                            </ProfessionalCard>
                        </Box>
                    </Fade>
                </Grid>

                {/* AI Predictions */}
                <Grid item xs={12}>
                    <Fade in timeout={700}>
                        <Box>
                            <ProfessionalCard
                                title="AI Expense Predictions"
                                subheader="Forecast for next month based on your spending habits"
                                headerAction={<AutoAwesome color="warning" />}
                            >
                                <Box id="analytics-prediction-chart">
                                    <PredictionsCard
                                        predictions={predictions}
                                        loading={loading && !isExporting}
                                        isExporting={isExporting}
                                    />
                                </Box>
                            </ProfessionalCard>
                        </Box>
                    </Fade>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Analytics;
