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
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    MenuItem,
    Alert,
    CircularProgress,
    IconButton,
    Slider,
} from '@mui/material';
import { Add, Edit, Delete, TrendingUp } from '@mui/icons-material';
import retirementService from '../services/retirementService';

const RetirementPage = () => {
    const [accounts, setAccounts] = useState([]);
    const [projection, setProjection] = useState(null);
    const [loading, setLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedAccount, setSelectedAccount] = useState(null);
    const [years, setYears] = useState(30);
    const [returnRate, setReturnRate] = useState(7);
    const [formData, setFormData] = useState({
        name: '',
        accountType: 'FOUR_ZERO_ONE_K',
        balance: '',
        contributionAmount: '',
        employerMatch: '',
    });

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            const [accountsRes, projectionRes] = await Promise.all([
                retirementService.getAll(),
                retirementService.getProjection(years, returnRate / 100),
            ]);
            setAccounts(accountsRes.data);
            setProjection(projectionRes.data);
        } catch (error) {
            console.error('Failed to load retirement data:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleAddAccount = () => {
        setSelectedAccount(null);
        setFormData({
            name: '',
            accountType: 'FOUR_ZERO_ONE_K',
            balance: '',
            contributionAmount: '',
            employerMatch: '',
        });
        setDialogOpen(true);
    };

    const handleEditAccount = (account) => {
        setSelectedAccount(account);
        setFormData({
            name: account.name,
            accountType: account.accountType,
            balance: account.balance,
            contributionAmount: account.contributionAmount || '',
            employerMatch: account.employerMatch || '',
        });
        setDialogOpen(true);
    };

    const handleDeleteAccount = async (id) => {
        if (!window.confirm('Are you sure you want to delete this account?')) return;
        try {
            await retirementService.delete(id);
            loadData();
        } catch (error) {
            console.error('Failed to delete account:', error);
        }
    };

    const handleSubmit = async () => {
        try {
            if (selectedAccount) {
                await retirementService.update(selectedAccount.id, formData);
            } else {
                await retirementService.create(formData);
            }
            setDialogOpen(false);
            loadData();
        } catch (error) {
            console.error('Failed to save account:', error);
        }
    };

    const handleProjectionUpdate = async () => {
        try {
            const res = await retirementService.getProjection(years, returnRate / 100);
            setProjection(res.data);
        } catch (error) {
            console.error('Failed to update projection:', error);
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount || 0);
    };

    const totalBalance = accounts.reduce((sum, acc) => sum + (acc.balance || 0), 0);
    const totalContribution = accounts.reduce((sum, acc) => sum + (acc.contributionAmount || 0), 0);

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ py: 4 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Retirement Planning
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Track your retirement accounts and plan for your future
                    </Typography>
                </Box>
                <Button variant="contained" startIcon={<Add />} onClick={handleAddAccount}>
                    Add Account
                </Button>
            </Box>

            {/* Summary Cards */}
            <Grid container spacing={3} mb={4}>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="caption" color="text.secondary">
                                Total Balance
                            </Typography>
                            <Typography variant="h5" fontWeight="bold" color="primary.main">
                                {formatCurrency(totalBalance)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="caption" color="text.secondary">
                                Monthly Contribution
                            </Typography>
                            <Typography variant="h5" fontWeight="bold" color="success.main">
                                {formatCurrency(totalContribution)}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card>
                        <CardContent>
                            <Typography variant="caption" color="text.secondary">
                                Number of Accounts
                            </Typography>
                            <Typography variant="h5" fontWeight="bold">
                                {accounts.length}
                            </Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Projection Calculator */}
            <Card sx={{ mb: 4 }}>
                <CardContent>
                    <Typography variant="h6" fontWeight="bold" gutterBottom>
                        Retirement Projection
                    </Typography>
                    <Grid container spacing={3} alignItems="center">
                        <Grid item xs={12} md={4}>
                            <Typography gutterBottom>Years to Retirement: {years}</Typography>
                            <Slider
                                value={years}
                                onChange={(e, v) => setYears(v)}
                                onChangeCommitted={handleProjectionUpdate}
                                min={1}
                                max={50}
                                valueLabelDisplay="auto"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            <Typography gutterBottom>Expected Return: {returnRate}%</Typography>
                            <Slider
                                value={returnRate}
                                onChange={(e, v) => setReturnRate(v)}
                                onChangeCommitted={handleProjectionUpdate}
                                min={0}
                                max={15}
                                step={0.5}
                                valueLabelDisplay="auto"
                            />
                        </Grid>
                        <Grid item xs={12} md={4}>
                            {projection && (
                                <Box textAlign="center">
                                    <Typography variant="caption" color="text.secondary">
                                        Projected Balance
                                    </Typography>
                                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                                        {formatCurrency(projection.projectedBalance)}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        in {projection.years} years
                                    </Typography>
                                </Box>
                            )}
                        </Grid>
                    </Grid>
                </CardContent>
            </Card>

            {/* Accounts List */}
            {accounts.length === 0 ? (
                <Box textAlign="center" py={8}>
                    <TrendingUp sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No retirement accounts added
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        Start planning for your retirement by adding your accounts
                    </Typography>
                    <Button variant="contained" startIcon={<Add />} onClick={handleAddAccount}>
                        Add Your First Account
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {accounts.map((account) => (
                        <Grid item xs={12} md={6} key={account.id}>
                            <Card>
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                                        <Box>
                                            <Typography variant="h6" fontWeight="bold">
                                                {account.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {account.accountType.replace(/_/g, ' ')}
                                            </Typography>
                                        </Box>
                                        <Box>
                                            <IconButton size="small" onClick={() => handleEditAccount(account)}>
                                                <Edit fontSize="small" />
                                            </IconButton>
                                            <IconButton size="small" onClick={() => handleDeleteAccount(account.id)} color="error">
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    </Box>

                                    <Grid container spacing={2}>
                                        <Grid item xs={12}>
                                            <Typography variant="caption" color="text.secondary">
                                                Current Balance
                                            </Typography>
                                            <Typography variant="h5" fontWeight="bold" color="primary.main">
                                                {formatCurrency(account.balance)}
                                            </Typography>
                                        </Grid>
                                        {account.contributionAmount && (
                                            <Grid item xs={6}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Monthly Contribution
                                                </Typography>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {formatCurrency(account.contributionAmount)}
                                                </Typography>
                                            </Grid>
                                        )}
                                        {account.employerMatch && (
                                            <Grid item xs={6}>
                                                <Typography variant="caption" color="text.secondary">
                                                    Employer Match
                                                </Typography>
                                                <Typography variant="body2" fontWeight="bold">
                                                    {account.employerMatch}%
                                                </Typography>
                                            </Grid>
                                        )}
                                    </Grid>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Add/Edit Dialog */}
            <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>{selectedAccount ? 'Edit Account' : 'Add Retirement Account'}</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" gap={2} pt={1}>
                        <TextField
                            label="Account Name"
                            value={formData.name}
                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                            required
                        />
                        <TextField
                            select
                            label="Account Type"
                            value={formData.accountType}
                            onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                        >
                            <MenuItem value="FOUR_ZERO_ONE_K">401(k)</MenuItem>
                            <MenuItem value="IRA">IRA</MenuItem>
                            <MenuItem value="ROTH_IRA">Roth IRA</MenuItem>
                            <MenuItem value="PENSION">Pension</MenuItem>
                            <MenuItem value="OTHER">Other</MenuItem>
                        </TextField>
                        <TextField
                            label="Current Balance"
                            type="number"
                            value={formData.balance}
                            onChange={(e) => setFormData({ ...formData, balance: e.target.value })}
                            required
                        />
                        <TextField
                            label="Monthly Contribution"
                            type="number"
                            value={formData.contributionAmount}
                            onChange={(e) => setFormData({ ...formData, contributionAmount: e.target.value })}
                        />
                        <TextField
                            label="Employer Match (%)"
                            type="number"
                            value={formData.employerMatch}
                            onChange={(e) => setFormData({ ...formData, employerMatch: e.target.value })}
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
                    <Button onClick={handleSubmit} variant="contained">
                        {selectedAccount ? 'Update' : 'Add'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default RetirementPage;
