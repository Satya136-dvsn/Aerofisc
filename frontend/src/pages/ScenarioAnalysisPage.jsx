/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { useState } from 'react';
import {
    Container,
    Box,
    Typography,
    Button,
    Grid,
    Card,
    CardContent,
    TextField,
    Alert,
    Chip,
    List,
    ListItem,
    ListItemText,
} from '@mui/material';
import { Calculate, TrendingUp } from '@mui/icons-material';
import scenarioService from '../services/scenarioService';

const ScenarioAnalysisPage = () => {
    const [scenario, setScenario] = useState(null);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        incomeChange: '',
        expenseChange: '',
        savingsChange: '',
    });

    const handleAnalyze = async () => {
        try {
            setLoading(true);
            const response = await scenarioService.analyze(
                parseFloat(formData.incomeChange) || 0,
                parseFloat(formData.expenseChange) || 0,
                parseFloat(formData.savingsChange) || 0
            );
            setScenario(response.data);
        } catch (error) {
            console.error('Failed to analyze scenario:', error);
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

    const cashFlow = (formData.incomeChange || 0) - (formData.expenseChange || 0);
    const isPositive = cashFlow >= 0;

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Typography variant="h4" fontWeight="bold" gutterBottom>
                Scenario Analysis
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={4}>
                Model what-if scenarios to plan your financial future
            </Typography>

            {/* Input Section */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Create Scenario
                    </Typography>
                    <Grid container spacing={3}>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Monthly Income Change"
                                type="number"
                                value={formData.incomeChange}
                                onChange={(e) => setFormData({ ...formData, incomeChange: e.target.value })}
                                helperText="Enter positive or negative amount"
                                InputProps={{ startAdornment: '₹' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Monthly Expense Change"
                                type="number"
                                value={formData.expenseChange}
                                onChange={(e) => setFormData({ ...formData, expenseChange: e.target.value })}
                                helperText="Enter positive or negative amount"
                                InputProps={{ startAdornment: '₹' }}
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <TextField
                                fullWidth
                                label="Savings Rate Change (%)"
                                type="number"
                                value={formData.savingsChange}
                                onChange={(e) => setFormData({ ...formData, savingsChange: e.target.value })}
                                helperText="Percentage change"
                                InputProps={{ endAdornment: '%' }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <Box display="flex" gap={2} alignItems="center">
                                <Button
                                    variant="contained"
                                    startIcon={<Calculate />}
                                    onClick={handleAnalyze}
                                    disabled={loading}
                                    size="large"
                                >
                                    Analyze Scenario
                                </Button>
                                <Chip
                                    label={isPositive ? `Surplus: ${formatCurrency(cashFlow)}` : `Deficit: ${formatCurrency(Math.abs(cashFlow))}`}
                                    color={isPositive ? 'success' : 'error'}
                                    sx={{ fontWeight: 'bold' }}
                                />
                            </Box>
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Results Section */}
            {scenario && (
                <>
                    <Alert severity={isPositive ? 'success' : 'warning'} sx={{ mb: 3 }}>
                        <Typography variant="subtitle2" fontWeight="bold">
                            {isPositive ? 'Positive Cash Flow Scenario' : 'Negative Cash Flow - Expenses Exceed Income'}
                        </Typography>
                        <Typography variant="body2">
                            {isPositive
                                ? 'This scenario shows a healthy financial position with surplus funds.'
                                : 'Warning: This scenario may lead to financial strain. Consider reducing expenses or increasing income.'}
                        </Typography>
                    </Alert>

                    {/* Projection Cards */}
                    <Grid container spacing={3} mb={4}>
                        <Grid item xs={12} sm={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="caption" color="text.secondary">
                                        Projected Balance (1 Year)
                                    </Typography>
                                    <Typography variant="h5" fontWeight="bold" color={scenario.projectedBalance1Year >= 0 ? 'success.main' : 'error.main'}>
                                        {formatCurrency(scenario.projectedBalance1Year)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" mt={1}>
                                        Net change over 12 months
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <Card>
                                <CardContent>
                                    <Typography variant="caption" color="text.secondary">
                                        Projected Balance (5 Years)
                                    </Typography>
                                    <Typography variant="h5" fontWeight="bold" color={scenario.projectedBalance5Years >= 0 ? 'success.main' : 'error.main'}>
                                        {formatCurrency(scenario.projectedBalance5Years)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" mt={1}>
                                        Net change over 60 months
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>

                    {/* Adjustments Summary */}
                    <Card sx={{ mb: 4 }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Scenario Adjustments
                            </Typography>
                            <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                    <Box p={2} bgcolor="background.default" borderRadius={1}>
                                        <Typography variant="caption" color="text.secondary">
                                            Income Adjustment
                                        </Typography>
                                        <Typography variant="h6" fontWeight="bold" color={scenario.adjustedIncome >= 0 ? 'success.main' : 'error.main'}>
                                            {scenario.adjustedIncome >= 0 ? '+' : ''}{formatCurrency(scenario.adjustedIncome)}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Box p={2} bgcolor="background.default" borderRadius={1}>
                                        <Typography variant="caption" color="text.secondary">
                                            Expense Adjustment
                                        </Typography>
                                        <Typography variant="h6" fontWeight="bold" color={scenario.adjustedExpenses >= 0 ? 'error.main' : 'success.main'}>
                                            {scenario.adjustedExpenses >= 0 ? '+' : ''}{formatCurrency(scenario.adjustedExpenses)}
                                        </Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                    <Box p={2} bgcolor="background.default" borderRadius={1}>
                                        <Typography variant="caption" color="text.secondary">
                                            Savings Rate Change
                                        </Typography>
                                        <Typography variant="h6" fontWeight="bold">
                                            {scenario.adjustedSavingsRate >= 0 ? '+' : ''}{scenario.adjustedSavingsRate}%
                                        </Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>

                    {/* Recommendations */}
                    <Card>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Analysis & Recommendations
                            </Typography>
                            <List>
                                {scenario.recommendations && scenario.recommendations.length > 0 ? (
                                    scenario.recommendations.map((rec, index) => (
                                        <ListItem key={index}>
                                            <ListItemText primary={rec} />
                                        </ListItem>
                                    ))
                                ) : (
                                    <ListItem>
                                        <ListItemText
                                            primary="No specific recommendations"
                                            secondary="Continue monitoring your financial situation"
                                        />
                                    </ListItem>
                                )}
                            </List>
                        </CardContent>
                    </Card>

                    {/* Example Scenarios */}
                    <Card sx={{ mt: 4, bgcolor: 'background.default' }}>
                        <CardContent>
                            <Typography variant="h6" fontWeight="bold" gutterBottom>
                                Example Scenarios to Try
                            </Typography>
                            <List dense>
                                <ListItem>
                                    <ListItemText
                                        primary="Job Promotion"
                                        secondary="Income +₹20,000, Expenses +₹5,000"
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Cost Reduction"
                                        secondary="Income unchanged, Expenses -₹10,000"
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Side Business"
                                        secondary="Income +₹15,000, Expenses +₹8,000"
                                    />
                                </ListItem>
                                <ListItem>
                                    <ListItemText
                                        primary="Retirement Planning"
                                        secondary="Income -₹50,000, Expenses -₹40,000"
                                    />
                                </ListItem>
                            </List>
                        </CardContent>
                    </Card>
                </>
            )}
        </Container>
    );
};

export default ScenarioAnalysisPage;
