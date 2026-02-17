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
    Button,
    Grid,
    Card,
    CardContent,
    LinearProgress,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Alert,
    Tabs,
    Tab,
    CircularProgress,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
} from '@mui/material';
import {
    Add,
    Delete,
    Edit,
    TrendingDown,
    MonetizationOn,
    Calculate,
} from '@mui/icons-material';
import debtService from '../services/debtService';

const DebtManagementPage = () => {
    const [debts, setDebts] = useState([]);
    const [summary, setSummary] = useState(null);
    const [payoffPlan, setPayoffPlan] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedDebt, setSelectedDebt] = useState(null);
    const [tabValue, setTabValue] = useState(0);
    const [strategy, setStrategy] = useState('AVALANCHE');
    const [extraPayment, setExtraPayment] = useState(0);
    const [formData, setFormData] = useState({
        name: '',
        type: 'CREDIT_CARD',
        principal: '',
        currentBalance: '',
        interestRate: '',
        minimumPayment: '',
        notes: '',
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [debtsRes, summaryRes] = await Promise.all([
                debtService.getAll(),
                debtService.getSummary(),
            ]);
            setDebts(debtsRes.data);
            setSummary(summaryRes.data);
        } catch (error) {
            console.error('Failed to load debts:', error);
        } finally {
            setLoading(false);
        }
    };

    const loadPayoffPlan = async () => {
        try {
            const planRes = await debtService.getPayoffPlan(strategy, extraPayment);
            setPayoffPlan(planRes.data);
        } catch (error) {
            console.error('Failed to load payoff plan:', error);
        }
    };

    useEffect(() => {
        if (tabValue === 1 && debts.length > 0) {
            loadPayoffPlan();
        }
    }, [tabValue, strategy, extraPayment, debts]);

    const handleAddDebt = () => {
        setSelectedDebt(null);
        setFormData({
            name: '',
            type: 'CREDIT_CARD',
            principal: '',
            currentBalance: '',
            interestRate: '',
            minimumPayment: '',
            notes: '',
        });
        setDialogOpen(true);
    };

    const handleEditDebt = (debt) => {
        setSelectedDebt(debt);
        setFormData({
            name: debt.name,
            type: debt.type,
            principal: debt.principal,
            currentBalance: debt.currentBalance,
            interestRate: debt.interestRate,
            minimumPayment: debt.minimumPayment,
            notes: debt.notes || '',
        });
        setDialogOpen(true);
    };

    const handleDeleteDebt = async (id) => {
        if (!window.confirm('Are you sure you want to delete this debt?')) return;
        try {
            await debtService.delete(id);
            loadData();
        } catch (error) {
            console.error('Failed to delete debt:', error);
        }
    };

    const handleSubmit = async () => {
        try {
            if (selectedDebt) {
                await debtService.update(selectedDebt.id, formData);
            } else {
                await debtService.create(formData);
            }
            setDialogOpen(false);
            loadData();
        } catch (error) {
            console.error('Failed to save debt:', error);
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

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Debt Management
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Track your debts and plan your path to financial freedom
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={handleAddDebt}>
                    Add Debt
                </Button>
            </Box>

            {/* Summary Cards */}
            {summary && debts.length > 0 && (
                <Grid container spacing={3} mb={4}>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="caption" color="text.secondary">
                                    Total Debt
                                </Typography>
                                <Typography variant="h5" fontWeight="bold" color="error.main">
                                    {formatCurrency(summary.totalDebt)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="caption" color="text.secondary">
                                    Monthly Payment
                                </Typography>
                                <Typography variant="h5" fontWeight="bold" color="warning.main">
                                    {formatCurrency(summary.totalMinimumPayment)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="caption" color="text.secondary">
                                    Avg Interest Rate
                                </Typography>
                                <Typography variant="h5" fontWeight="bold">
                                    {summary.averageInterestRate}%
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={6} md={3}>
                        <Card>
                            <CardContent>
                                <Typography variant="caption" color="text.secondary">
                                    Payoff Time
                                </Typography>
                                <Typography variant="h5" fontWeight="bold">
                                    {summary.estimatedPayoffMonths} months
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>
            )}

            {/* Tabs */}
            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={tabValue} onChange={(e, v) => setTabValue(v)}>
                    <Tab label="Debts List" />
                    <Tab label="Payoff Plan" />
                </Tabs>
            </Box>

            {/* Tab Panels */}
            {tabValue === 0 && (
                <>
                    {debts.length === 0 ? (
                        <Box textAlign="center" py={8}>
                            <TrendingDown sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                            <Typography variant="h6" color="text.secondary" gutterBottom>
                                No debts tracked
                            </Typography>
                            <Typography variant="body2" color="text.secondary" mb={3}>
                                Add your debts to start tracking and planning your payoff strategy
                            </Typography>
                            <Button variant="contained" startIcon={<Add />} onClick={handleAddDebt}>
                                Add Your First Debt
                            </Button>
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {debts.map((debt) => {
                                const progress = (debt.principal - debt.currentBalance) / debt.principal * 100;
                                return (
                                    <Grid item xs={12} md={6} key={debt.id}>
                                        <Card>
                                            <CardContent>
                                                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                                    <Box>
                                                        <Typography variant="h6" fontWeight="bold">
                                                            {debt.name}
                                                        </Typography>
                                                        <Chip label={debt.type.replace('_', ' ')} size="small" sx={{ mt: 0.5 }} />
                                                    </Box>
                                                    <Box>
                                                        <IconButton size="small" onClick={() => handleEditDebt(debt)}>
                                                            <Edit fontSize="small" />
                                                        </IconButton>
                                                        <IconButton size="small" onClick={() => handleDeleteDebt(debt.id)} color="error">
                                                            <Delete fontSize="small" />
                                                        </IconButton>
                                                    </Box>
                                                </Box>

                                                <Grid container spacing={2} mb={2}>
                                                    <Grid item xs={6}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Current Balance
                                                        </Typography>
                                                        <Typography variant="h6" fontWeight="bold" color="error.main">
                                                            {formatCurrency(debt.currentBalance)}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Interest Rate
                                                        </Typography>
                                                        <Typography variant="h6" fontWeight="bold">
                                                            {debt.interestRate}%
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Min. Payment
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight="bold">
                                                            {formatCurrency(debt.minimumPayment)}
                                                        </Typography>
                                                    </Grid>
                                                    <Grid item xs={6}>
                                                        <Typography variant="caption" color="text.secondary">
                                                            Payoff Time
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight="bold">
                                                            {debt.monthsToPayoff} months
                                                        </Typography>
                                                    </Grid>
                                                </Grid>

                                                <Box>
                                                    <Box display="flex" justifyContent="space-between" mb={0.5}>
                                                        <Typography variant="caption">Progress</Typography>
                                                        <Typography variant="caption">{progress.toFixed(1)}%</Typography>
                                                    </Box>
                                                    <LinearProgress variant="determinate" value={progress} sx={{ height: 8, borderRadius: 4 }} />
                                                </Box>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    )}
                </>
            )}

            {tabValue === 1 && (
                <Box>
                    <Box mb={3}>
                        <Grid container spacing={2} alignItems="flex-end">
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Strategy"
                                    value={strategy}
                                    onChange={(e) => setStrategy(e.target.value)}
                                >
                                    <MenuItem value="AVALANCHE">Avalanche (Highest Interest First)</MenuItem>
                                    <MenuItem value="SNOWBALL">Snowball (Smallest Balance First)</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <TextField
                                    fullWidth
                                    type="number"
                                    label="Extra Monthly Payment"
                                    value={extraPayment}
                                    onChange={(e) => setExtraPayment(Number(e.target.value))}
                                    InputProps={{ startAdornment: '₹' }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={4}>
                                <Button
                                    fullWidth
                                    variant="outlined"
                                    startIcon={<Calculate />}
                                    onClick={loadPayoffPlan}
                                >
                                    Calculate Plan
                                </Button>
                            </Grid>
                        </Grid>
                    </Box>

                    {payoffPlan && (
                        <>
                            <Alert severity="success" sx={{ mb: 3 }}>
                                <Typography variant="subtitle2" fontWeight="bold">
                                    {strategy} Strategy: Pay off all debts in {payoffPlan.totalMonths} months
                                </Typography>
                                <Typography variant="body2">
                                    Total Interest: {formatCurrency(payoffPlan.totalInterestPaid)}
                                </Typography>
                            </Alert>

                            <TableContainer component={Paper}>
                                <Table>
                                    <TableHead>
                                        <TableRow>
                                            <TableCell>Debt Name</TableCell>
                                            <TableCell align="right">Payoff Month</TableCell>
                                        </TableRow>
                                    </TableHead>
                                    <TableBody>
                                        {payoffPlan.steps.map((step) => (
                                            <TableRow key={step.debtId}>
                                                <TableCell>{step.debtName}</TableCell>
                                                <TableCell align="right">Month {step.payoffMonth}</TableCell>
                                            </TableRow>
                                        ))}
                                    </TableBody>
                                </Table>
                            </TableContainer>
                        </>
                    )}
                </Box>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{selectedDebt ? 'Edit Debt' : 'Add New Debt'}</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} pt={1}>
                        <TextField
                            label="Debt Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <TextField
                            select
                            label="Type"
                            value={formData.type}
                            onChange={(e) => setFormData({ ...formData, type: e.target.value })}
                        >
                            <MenuItem value="CREDIT_CARD">Credit Card</MenuItem>
                            <MenuItem value="PERSONAL_LOAN">Personal Loan</MenuItem>
                            <MenuItem value="HOME_LOAN">Home Loan</MenuItem>
                            <MenuItem value="AUTO_LOAN">Auto Loan</MenuItem>
                            <MenuItem value="STUDENT_LOAN">Student Loan</MenuItem>
                            <MenuItem value="MORTGAGE">Mortgage</MenuItem>
                            <MenuItem value="OTHER">Other</MenuItem>
                        </TextField>
                        <TextField
                            label="Principal Amount"
                            type="number"
                            value={formData.principal}
                            onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                            required
                        />
                        <TextField
                            label="Current Balance"
                            type="number"
                            value={formData.currentBalance}
                            onChange={(e) => setFormData({ ...formData, currentBalance: e.target.value })}
                            required
                        />
                        <TextField
                            label="Interest Rate (%)"
                            type="number"
                            value={formData.interestRate}
                            onChange={(e) => setFormData({ ...formData, interestRate: e.target.value })}
                            required
                        />
                        <TextField
                            label="Minimum Payment"
                            type="number"
                            value={formData.minimumPayment}
                            onChange={(e) => setFormData({ ...formData, minimumPayment: e.target.value })}
                            required
                        />
                        <TextField
                            label="Notes"
                            multiline
                            rows={2}
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {selectedDebt ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default DebtManagementPage;
