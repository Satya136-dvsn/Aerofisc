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
    CircularProgress,
    LinearProgress,
    Chip,
    List,
    ListItem,
    ListItemText,
    Divider,
} from '@mui/material';
import { AccountBalance, TrendingUp } from '@mui/icons-material';
import taxService from '../services/taxService';

const TaxPlanningPage = () => {
    const [taxData, setTaxData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadTaxEstimate();
    }, []);

    const loadTaxEstimate = async () => {
        try {
            setLoading(true);
            const response = await taxService.getEstimate();
            setTaxData(response.data);
        } catch (error) {
            console.error('Failed to load tax estimate:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    if (!taxData) return null;

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Tax Planning
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={4}>
                Estimate your tax liability and plan your finances
            </Typography>

            {/* Summary Cards */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="caption" color="text.secondary">
                                Annual Income
                            </Typography>
                            <Typography variant="h5" fontWeight="bold" color="success.main">
                                {formatCurrency(taxData.totalIncome)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="caption" color="text.secondary">
                                Total Deductions
                            </Typography>
                            <Typography variant="h5" fontWeight="bold" color="primary.main">
                                {formatCurrency(taxData.totalDeductions)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="caption" color="text.secondary">
                                Taxable Income
                            </Typography>
                            <Typography variant="h5" fontWeight="bold">
                                {formatCurrency(taxData.taxableIncome)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={6} md={3}>
                    <Card>
                        <CardContent>
                            <Typography variant="caption" color="text.secondary">
                                Estimated Tax
                            </Typography>
                            <Typography variant="h5" fontWeight="bold" color="error.main">
                                {formatCurrency(taxData.estimatedTax)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tax Bracket & Rate */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Tax Bracket
                            </Typography>
                            <Box textAlign="center" py={3}>
                                <Chip
                                    label={taxData.taxBracket}
                                    color="primary"
                                    sx={{ fontSize: '1.5rem', fontWeight: 'bold', px: 3, py: 2 }}
                                />
                            </Box>
                            <Typography variant="body2" color="text.secondary" textAlign="center">
                                Your current tax bracket based on taxable income
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Effective Tax Rate
                            </Typography>
                            <Box textAlign="center" py={2}>
                                <Typography variant="h3" fontWeight="bold" color="primary.main">
                                    {taxData.effectiveRate.toFixed(2)}%
                                </Typography>
                                <LinearProgress
                                    variant="determinate"
                                    value={Math.min(taxData.effectiveRate, 100)}
                                    sx={{ mt: 2, height: 8, borderRadius: 4 }}
                                />
                            </Box>
                            <Typography variant="body2" color="text.secondary" textAlign="center" mt={2}>
                                Percentage of total income paid in taxes
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Tax Breakdown */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Tax Breakdown
                    </Typography>
                    <Box my={2}>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2">Annual Income</Typography>
                            <Typography variant="body2" fontWeight="bold">
                                {formatCurrency(taxData.totalIncome)}
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" color="success.main">
                                - Deductions
                            </Typography>
                            <Typography variant="body2" fontWeight="bold" color="success.main">
                                -{formatCurrency(taxData.totalDeductions)}
                            </Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" fontWeight="bold">
                                Taxable Income
                            </Typography>
                            <Typography variant="body2" fontWeight="bold">
                                {formatCurrency(taxData.taxableIncome)}
                            </Typography>
                        </Box>
                        <Box display="flex" justifyContent="space-between" mb={1}>
                            <Typography variant="body2" color="error.main">
                                Tax ({taxData.effectiveRate.toFixed(2)}%)
                            </Typography>
                            <Typography variant="body2" fontWeight="bold" color="error.main">
                                {formatCurrency(taxData.estimatedTax)}
                            </Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        <Box display="flex" justifyContent="space-between">
                            <Typography variant="body1" fontWeight="bold">
                                Net Income (After Tax)
                            </Typography>
                            <Typography variant="body1" fontWeight="bold" color="primary.main">
                                {formatCurrency(taxData.totalIncome - taxData.estimatedTax)}
                            </Typography>
                        </Box>
                    </Box>
                </CardContent>
            </Card>

            {/* Deduction Breakdown */}
            {taxData.deductionBreakdown && Object.keys(taxData.deductionBreakdown).length > 0 && (
                <Card>
                    <CardContent>
                        <Typography variant="h6" fontWeight="bold" gutterBottom>
                            Deduction Breakdown
                        </Typography>
                        <List>
                            {Object.entries(taxData.deductionBreakdown).map(([key, value], index) => (
                                <ListItem key={index} divider={index < Object.keys(taxData.deductionBreakdown).length - 1}>
                                    <ListItemText primary={key} />
                                    <Typography variant="body2" fontWeight="bold" color="success.main">
                                        {formatCurrency(value)}
                                    </Typography>
                                </ListItem>
                            ))}
                        </List>
                    </CardContent>
                </Card>
            )}

            {/* Indian Tax Brackets Reference */}
            <Card sx={{ mt: 4, bgcolor: 'background.default' }}>
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Indian Tax Brackets (2024)
                    </Typography>
                    <List dense>
                        <ListItem>
                            <ListItemText
                                primary="₹0 - ₹2.5 Lakhs"
                                secondary="0% (No Tax)"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="₹2.5 - ₹5 Lakhs"
                                secondary="5%"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="₹5 - ₹10 Lakhs"
                                secondary="10%"
                            />
                        </ListItem>
                        <ListItem>
                            <ListItemText
                                primary="Above ₹10 Lakhs"
                                secondary="15%"
                            />
                        </ListItem>
                    </List>
                </CardContent>
            </Card>
        </Container>
    );
};

export default TaxPlanningPage;
