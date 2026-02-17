/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    Typography,
    Box,
    CircularProgress,
    IconButton,
    Grid,
    Card,
    CardContent,
    Divider,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    Chip,
    List,
    ListItem,
    ListItemText,
    ListItemIcon
} from '@mui/material';
import {
    Close,
    AccountBalance,
    TrendingUp,
    TrendingDown,
    Savings,
    AttachMoney,
    Receipt,
    ShowChart,
    Person
} from '@mui/icons-material';
import adminService from '../../services/adminService';

const UserProfileDialog = ({ open, onClose, userId, userName }) => {
    const [profileData, setProfileData] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (open && userId) {
            fetchUserProfile();
        }
    }, [open, userId]);

    const fetchUserProfile = async () => {
        try {
            setLoading(true);
            const response = await adminService.getUserProfile(userId);
            setProfileData(response.data);
        } catch (error) {
            console.error('Failed to fetch user profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatCurrency = (amount) => {
        return `₹${parseFloat(amount || 0).toFixed(2)}`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString();
    };

    if (loading || !profileData) {
        return (
            <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
                <DialogTitle>Loading User Profile...</DialogTitle>
                <DialogContent>
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                        <CircularProgress />
                    </Box>
                </DialogContent>
            </Dialog>
        );
    }

    const { user, profile, financialSummary, recentTransactions } = profileData;

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', pb: 1 }}>
                <Box>
                    <Typography variant="h5" fontWeight="bold">{userName}</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {user?.email} • {user?.role} • Joined {formatDate(user?.createdAt)}
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {/* Financial Summary Cards */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} sm={4}>
                        <Card elevation={0} sx={{ bgcolor: 'success.50', border: '1px solid', borderColor: 'success.light' }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                    <TrendingUp color="success" fontSize="small" />
                                    <Typography variant="caption" color="success.dark">Total Income</Typography>
                                </Box>
                                <Typography variant="h6" fontWeight="bold" color="success.dark">
                                    {formatCurrency(financialSummary?.totalIncome)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card elevation={0} sx={{ bgcolor: 'error.50', border: '1px solid', borderColor: 'error.light' }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                    <TrendingDown color="error" fontSize="small" />
                                    <Typography variant="caption" color="error.dark">Total Expenses</Typography>
                                </Box>
                                <Typography variant="h6" fontWeight="bold" color="error.dark">
                                    {formatCurrency(financialSummary?.totalExpenses)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} sm={4}>
                        <Card elevation={0} sx={{ bgcolor: 'primary.50', border: '1px solid', borderColor: 'primary.light' }}>
                            <CardContent>
                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                    <AccountBalance color="primary" fontSize="small" />
                                    <Typography variant="caption" color="primary.dark">Net Balance</Typography>
                                </Box>
                                <Typography variant="h6" fontWeight="bold" color="primary.dark">
                                    {formatCurrency(financialSummary?.netBalance)}
                                </Typography>
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* User Profile Info */}
                {profile && (
                    <Card elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
                        <CardContent>
                            <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                <Person fontSize="small" sx={{ verticalAlign: 'middle', mr: 1 }} />
                                Profile Information
                            </Typography>
                            <Divider sx={{ my: 1 }} />
                            <Grid container spacing={2} sx={{ mt: 0.5 }}>
                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">Monthly Income</Typography>
                                    <Typography variant="body1" fontWeight="600">
                                        {formatCurrency(profile.monthlyIncome)}
                                    </Typography>
                                </Grid>
                                <Grid item xs={6}>
                                    <Typography variant="caption" color="text.secondary">Savings Target</Typography>
                                    <Typography variant="body1" fontWeight="600">
                                        {formatCurrency(profile.savingsTarget)}
                                    </Typography>
                                </Grid>
                            </Grid>
                        </CardContent>
                    </Card>
                )}

                {/* Financial Health & Tax */}
                <Grid container spacing={2} sx={{ mb: 3 }}>
                    <Grid item xs={12} md={6}>
                        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}>
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Financial Health
                                </Typography>
                                <Divider sx={{ my: 1 }} />
                                {profileData.financialHealth ? (
                                    <Box textAlign="center" py={2}>
                                        <Typography variant="h3" fontWeight="bold" color={
                                            profileData.financialHealth.healthScore >= 80 ? 'success.main' :
                                                profileData.financialHealth.healthScore >= 60 ? 'primary.main' :
                                                    profileData.financialHealth.healthScore >= 40 ? 'warning.main' : 'error.main'
                                        }>
                                            {profileData.financialHealth.healthScore}
                                        </Typography>
                                        <Typography variant="body2" color="text.secondary">
                                            Score ({profileData.financialHealth.healthRating})
                                        </Typography>
                                    </Box>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" textAlign="center">
                                        No health data available
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                    <Grid item xs={12} md={6}>
                        <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider', height: '100%' }}>
                            <CardContent>
                                <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                                    Tax Estimate
                                </Typography>
                                <Divider sx={{ my: 1 }} />
                                {profileData.taxEstimate ? (
                                    <List dense>
                                        <ListItem>
                                            <ListItemText primary="Taxable Income" />
                                            <Typography variant="body2" fontWeight="bold">
                                                {formatCurrency(profileData.taxEstimate.taxableIncome)}
                                            </Typography>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="Estimated Tax" />
                                            <Typography variant="body2" fontWeight="bold" color="error.main">
                                                {formatCurrency(profileData.taxEstimate.estimatedTax)}
                                            </Typography>
                                        </ListItem>
                                        <ListItem>
                                            <ListItemText primary="Effective Rate" />
                                            <Typography variant="body2" fontWeight="bold">
                                                {profileData.taxEstimate.effectiveRate}%
                                            </Typography>
                                        </ListItem>
                                    </List>
                                ) : (
                                    <Typography variant="body2" color="text.secondary" textAlign="center">
                                        No tax data available
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                </Grid>

                {/* Debts Summary */}
                <Card elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
                    <CardContent>
                        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
                            <Typography variant="subtitle1" fontWeight="bold">
                                Debt Overview
                            </Typography>
                            <Typography variant="subtitle2" color="error.main" fontWeight="bold">
                                Total: {formatCurrency(profileData.totalDebt)}
                            </Typography>
                        </Box>
                        <Divider sx={{ my: 1 }} />
                        {profileData.debts && profileData.debts.length > 0 ? (
                            <List dense>
                                {profileData.debts.map((debt) => (
                                    <ListItem key={debt.id}>
                                        <ListItemText
                                            primary={debt.name}
                                            secondary={`${debt.interestRate}% Interest`}
                                        />
                                        <Typography variant="body2" fontWeight="bold" color="error.main">
                                            {formatCurrency(debt.currentBalance)}
                                        </Typography>
                                    </ListItem>
                                ))}
                            </List>
                        ) : (
                            <Typography variant="body2" color="text.secondary" textAlign="center">
                                No active debts
                            </Typography>
                        )}
                    </CardContent>
                </Card>

                {/* Activity Summary */}
                <Card elevation={0} sx={{ mb: 3, border: '1px solid', borderColor: 'divider' }}>
                    <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Activity Summary
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        <List dense>
                            <ListItem>
                                <ListItemIcon><AttachMoney color="primary" /></ListItemIcon>
                                <ListItemText
                                    primary="Budgets"
                                    secondary={`${profileData.budgetCount || 0} active budgets`}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><Savings color="success" /></ListItemIcon>
                                <ListItemText
                                    primary="Savings Goals"
                                    secondary={`${profileData.savingsGoalCount || 0} savings goals`}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><Receipt color="info" /></ListItemIcon>
                                <ListItemText
                                    primary="Transactions"
                                    secondary={`${profileData.totalTransactions || 0} total transactions`}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><Receipt color="warning" /></ListItemIcon>
                                <ListItemText
                                    primary="Bills"
                                    secondary={`${profileData.billCount || 0} bills tracked`}
                                />
                            </ListItem>
                            <ListItem>
                                <ListItemIcon><ShowChart color="secondary" /></ListItemIcon>
                                <ListItemText
                                    primary="Investments"
                                    secondary={`${profileData.investmentCount || 0} investments`}
                                />
                            </ListItem>
                        </List>
                    </CardContent>
                </Card>

                {/* Recent Transactions */}
                <Card elevation={0} sx={{ border: '1px solid', borderColor: 'divider' }}>
                    <CardContent>
                        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                            Recent Transactions (Last 5)
                        </Typography>
                        <Divider sx={{ my: 1 }} />
                        {recentTransactions && recentTransactions.length > 0 ? (
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>Date</TableCell>
                                        <TableCell>Description</TableCell>
                                        <TableCell>Type</TableCell>
                                        <TableCell align="right">Amount</TableCell>
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {recentTransactions.map((txn) => (
                                        <TableRow key={txn.id} hover>
                                            <TableCell>{formatDate(txn.date)}</TableCell>
                                            <TableCell>{txn.description || 'N/A'}</TableCell>
                                            <TableCell>
                                                <Chip
                                                    label={txn.type}
                                                    size="small"
                                                    color={txn.type === 'INCOME' ? 'success' : 'error'}
                                                    variant="outlined"
                                                />
                                            </TableCell>
                                            <TableCell align="right">
                                                <Typography
                                                    variant="body2"
                                                    fontWeight="bold"
                                                    color={txn.type === 'INCOME' ? 'success.main' : 'error.main'}
                                                >
                                                    {formatCurrency(txn.amount)}
                                                </Typography>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        ) : (
                            <Typography variant="body2" color="text.secondary" textAlign="center" py={2}>
                                No recent transactions
                            </Typography>
                        )}
                    </CardContent>
                </Card>
            </DialogContent>

            <DialogActions>
                <Button onClick={onClose} variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserProfileDialog;
