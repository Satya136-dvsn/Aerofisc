/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    Grid,
    Card,
    CardContent,
    LinearProgress,
    Alert,
    CircularProgress,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
} from '@mui/material';
import {
    TrendingUp,
    Warning,
    CheckCircle,
    Info,
} from '@mui/icons-material';
import financialHealthService from '../services/financialHealthService';

const FinancialHealthPage = () => {
    const [healthData, setHealthData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadHealthData();
    }, []);

    const loadHealthData = async () => {
        try {
            setLoading(true);
            const response = await financialHealthService.getHealthScore();
            setHealthData(response.data);
        } catch (error) {
            console.error('Failed to load health data:', error);
        } finally {
            setLoading(false);
        }
    };

    const getScoreColor = (score) => {
        if (score >= 80) return 'success.main';
        if (score >= 60) return 'primary.main';
        if (score >= 40) return 'warning.main';
        return 'error.main';
    };

    const getPriorityIcon = (priority) => {
        if (priority === 'HIGH') return <Warning color="error" />;
        if (priority === 'MEDIUM') return <Info color="warning" />;
        return <CheckCircle color="success" />;
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!healthData) return null;

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Financial Health Analysis
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={4}>
                Comprehensive analysis of your financial wellness
            </Typography>

            {/* Health Score Gauge */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Grid container spacing={4} alignItems="center">
                        <Grid item xs={12} md={6}>
                            <Box textAlign="center">
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    Overall Health Score
                                </Typography>
                                <Box position="relative" display="inline-flex">
                                    <CircularProgress
                                        variant="determinate"
                                        value={healthData.healthScore}
                                        size={200}
                                        thickness={8}
                                        sx={{ color: getScoreColor(healthData.healthScore) }}
                                    />
                                    <Box
                                        position="absolute"
                                        top={0}
                                        left={0}
                                        bottom={0}
                                        right={0}
                                        display="flex"
                                        alignItems="center"
                                        justifyContent="center"
                                        flexDirection="column"
                                    >
                                        <Typography variant="h2" fontWeight="bold">
                                            {healthData.healthScore}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            out of 100
                                        </Typography>
                                    </Box>
                                </Box>
                                <Box mt={2}>
                                    <Chip
                                        label={healthData.healthRating}
                                        color={
                                            healthData.healthRating === 'EXCELLENT' ? 'success' :
                                                healthData.healthRating === 'GOOD' ? 'primary' :
                                                    healthData.healthRating === 'FAIR' ? 'warning' : 'error'
                                        }
                                        sx={{ fontWeight: 'bold' }}
                                    />
                                </Box>
                            </Box>
                        </Grid>

                        <Grid item xs={12} md={6}>
                            <Grid container spacing={2}>
                                <Grid item xs={12}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Debt-to-Income Ratio
                                        </Typography>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={Math.min(healthData.debtToIncomeRatio, 100)}
                                                sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                                            />
                                            <Typography variant="body2" fontWeight="bold">
                                                {healthData.debtToIncomeRatio.toFixed(1)}%
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Savings Rate
                                        </Typography>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={Math.min(healthData.savingsRate, 100)}
                                                sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                                                color="success"
                                            />
                                            <Typography variant="body2" fontWeight="bold">
                                                {healthData.savingsRate.toFixed(1)}%
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                                <Grid item xs={12}>
                                    <Box>
                                        <Typography variant="caption" color="text.secondary">
                                            Emergency Fund
                                        </Typography>
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <LinearProgress
                                                variant="determinate"
                                                value={(healthData.emergencyFundMonths / 6) * 100}
                                                sx={{ flexGrow: 1, height: 8, borderRadius: 4 }}
                                                color="primary"
                                            />
                                            <Typography variant="body2" fontWeight="bold">
                                                {healthData.emergencyFundMonths.toFixed(1)} mo
                                            </Typography>
                                        </Box>
                                    </Box>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Financial Snapshot */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="caption" color="text.secondary">
                                Monthly Income
                            </Typography>
                            <Typography variant="h6" fontWeight="bold" color="success.main">
                                ₹{healthData.monthlyIncome.toLocaleString()}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="caption" color="text.secondary">
                                Monthly Expenses
                            </Typography>
                            <Typography variant="h6" fontWeight="bold" color="error.main">
                                ₹{healthData.monthlyExpenses.toLocaleString()}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="caption" color="text.secondary">
                                Total Debt
                            </Typography>
                            <Typography variant="h6" fontWeight="bold">
                                ₹{healthData.totalDebt.toLocaleString()}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="caption" color="text.secondary">
                                Total Savings
                            </Typography>
                            <Typography variant="h6" fontWeight="bold" color="primary.main">
                                ₹{healthData.totalSavings.toLocaleString()}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Recommendations */}
            <Card>
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Personalized Recommendations
                    </Typography>
                    {healthData.recommendations.length === 0 ? (
                        <Alert severity="success">
                            Great! You're doing well financially. Keep up the good work!
                        </Alert>
                    ) : (
                        <List>
                            {healthData.recommendations.map((rec, index) => (
                                <ListItem key={index} divider={index < healthData.recommendations.length - 1}>
                                    <ListItemIcon>
                                        {getPriorityIcon(rec.priority)}
                                    </ListItemIcon>
                                    <ListItemText
                                        primary={rec.title}
                                        secondary={
                                            <>
                                                <Typography variant="body2" component="span">
                                                    {rec.description}
                                                </Typography>
                                                <br />
                                                <Typography variant="body2" component="span" fontWeight="bold" color="primary">
                                                    Action: {rec.actionItem}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    )}
                </CardContent>
            </Card>
        </Container>
    );
};

export default FinancialHealthPage;
