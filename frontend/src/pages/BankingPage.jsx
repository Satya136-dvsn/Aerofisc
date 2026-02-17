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
    Alert,
    Snackbar,
    CircularProgress,
    Paper,
} from '@mui/material';
import { Add, AccountBalance } from '@mui/icons-material';
import BankAccountCard from '../components/banking/BankAccountCard';
import ConnectBankModal from '../components/banking/ConnectBankModal';
import bankingService from '../services/bankingService';

const BankingPage = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [connectModalOpen, setConnectModalOpen] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        loadAccounts();
    }, []);

    const loadAccounts = async () => {
        try {
            setLoading(true);
            const response = await bankingService.getAccounts();
            setAccounts(response.data);
        } catch (error) {
            console.error('Failed to load accounts:', error);
            setSnackbar({ open: true, message: 'Failed to load accounts', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSync = async (accountId) => {
        try {
            const response = await bankingService.syncTransactions(accountId);
            setSnackbar({
                open: true,
                message: `Synced ${response.data.newTransactions} new transactions`,
                severity: 'success',
            });
            // Update last sync time
            setAccounts(accounts.map(acc =>
                acc.id === accountId
                    ? { ...acc, lastSync: response.data.lastSync }
                    : acc
            ));
        } catch (error) {
            console.error('Sync failed:', error);
            setSnackbar({ open: true, message: 'Sync failed', severity: 'error' });
        }
    };

    const handleDisconnect = async (accountId) => {
        if (window.confirm('Are you sure you want to disconnect this account?')) {
            try {
                await bankingService.disconnectBank(accountId);
                setAccounts(accounts.filter((acc) => acc.id !== accountId));
                setSnackbar({ open: true, message: 'Account disconnected', severity: 'success' });
            } catch (error) {
                console.error('Disconnect failed:', error);
                setSnackbar({ open: true, message: 'Failed to disconnect', severity: 'error' });
            }
        }
    };

    const handleConnectSuccess = (newAccount) => {
        setAccounts([...accounts, newAccount]);
        setSnackbar({ open: true, message: 'Bank account connected successfully', severity: 'success' });
    };

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    return (
        <Container maxWidth="lg" sx={{ py: 4 }}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={4}>
                <Box>
                    <Typography variant="h4" fontWeight="bold" gutterBottom>
                        Banking Integration
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Connect your bank accounts for automatic transaction import
                    </Typography>
                </Box>
                <Button
                    variant="contained"
                    startIcon={<Add />}
                    onClick={() => setConnectModalOpen(true)}
                >
                    Connect Bank
                </Button>
            </Box>

            {/* Total Balance Summary */}
            {accounts.length > 0 && (
                <Paper elevation={2} sx={{ p: 3, mb: 4, bgcolor: 'primary.main', color: 'white' }}>
                    <Typography variant="h6" gutterBottom>
                        Total Balance Across All Accounts
                    </Typography>
                    <Typography variant="h3" fontWeight="bold">
                        {new Intl.NumberFormat('en-IN', {
                            style: 'currency',
                            currency: 'INR',
                        }).format(totalBalance)}
                    </Typography>
                    <Typography variant="body2" sx={{ mt: 1, opacity: 0.9 }}>
                        {accounts.length} {accounts.length === 1 ? 'account' : 'accounts'} connected
                    </Typography>
                </Paper>
            )}

            {/* Connected Accounts */}
            {loading ? (
                <Box display="flex" justifyContent="center" py={8}>
                    <CircularProgress />
                </Box>
            ) : accounts.length === 0 ? (
                <Box textAlign="center" py={8}>
                    <AccountBalance sx={{ fontSize: 80, color: 'text.secondary', mb: 2 }} />
                    <Typography variant="h6" color="text.secondary" gutterBottom>
                        No bank accounts connected
                    </Typography>
                    <Typography variant="body2" color="text.secondary" mb={3}>
                        Connect your bank accounts to automatically import transactions
                    </Typography>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={() => setConnectModalOpen(true)}
                    >
                        Connect Your First Bank
                    </Button>
                </Box>
            ) : (
                <Grid container spacing={3}>
                    {accounts.map((account) => (
                        <Grid item xs={12} md={6} key={account.id}>
                            <BankAccountCard
                                account={account}
                                onSync={handleSync}
                                onDisconnect={handleDisconnect}
                            />
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Connect Bank Modal */}
            <ConnectBankModal
                open={connectModalOpen}
                onClose={() => setConnectModalOpen(false)}
                onSuccess={handleConnectSuccess}
            />

            {/* Snackbar */}
            <Snackbar
                open={snackbar.open}
                autoHideDuration={6000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
            >
                <Alert
                    onClose={() => setSnackbar({ ...snackbar, open: false })}
                    severity={snackbar.severity}
                    sx={{ width: '100%' }}
                >
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default BankingPage;
