import React, { useState, useEffect } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Button,
    Grid,
    Chip,
    CircularProgress,
    Alert,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemSecondaryAction,
    IconButton,
    Divider,
} from '@mui/material';
import {
    AccountBalance as BankIcon,
    Sync as SyncIcon,
    Check as CheckIcon,
    Link as LinkIcon,
    LinkOff as UnlinkIcon,
    Refresh as RefreshIcon,
} from '@mui/icons-material';
import bankIntegrationService from '../services/bankIntegrationService';

const BankConnection = ({ onTransactionsImported }) => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(null);
    const [connectDialogOpen, setConnectDialogOpen] = useState(false);
    const [supportedBanks, setSupportedBanks] = useState([]);
    const [connecting, setConnecting] = useState(null);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        loadAccounts();
        setSupportedBanks(bankIntegrationService.getSupportedBanks());
    }, []);

    const loadAccounts = async () => {
        try {
            setLoading(true);
            const accts = await bankIntegrationService.getConnectedAccounts();
            setAccounts(accts);
        } catch (err) {
            setError('Failed to load connected accounts');
        } finally {
            setLoading(false);
        }
    };

    const handleConnectBank = async (bankId) => {
        try {
            setConnecting(bankId);
            setError('');
            const result = await bankIntegrationService.connectBank(bankId);
            if (result.success) {
                setSuccessMessage('Bank connected successfully!');
                setConnectDialogOpen(false);
                await loadAccounts();
            }
        } catch (err) {
            setError('Failed to connect bank');
        } finally {
            setConnecting(null);
        }
    };

    const handleSyncAccount = async (accountId) => {
        try {
            setSyncing(accountId);
            setError('');
            const result = await bankIntegrationService.syncTransactions(accountId);
            if (result.success) {
                setSuccessMessage(`${result.transactions.length} transactions synced!`);
                if (onTransactionsImported) {
                    onTransactionsImported(result.transactions);
                }
            }
        } catch (err) {
            setError('Failed to sync transactions');
        } finally {
            setSyncing(null);
        }
    };

    const handleDisconnect = async (accountId) => {
        if (!window.confirm('Disconnect this bank account?')) return;

        try {
            await bankIntegrationService.disconnectAccount(accountId);
            setSuccessMessage('Account disconnected');
            await loadAccounts();
        } catch (err) {
            setError('Failed to disconnect account');
        }
    };

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleString('en-IN', {
            dateStyle: 'short',
            timeStyle: 'short',
        });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                    <BankIcon color="primary" />
                    Bank Connections
                </Typography>
                <Button
                    variant="contained"
                    startIcon={<LinkIcon />}
                    onClick={() => setConnectDialogOpen(true)}
                >
                    Connect Bank
                </Button>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError('')}>
                    {error}
                </Alert>
            )}

            {successMessage && (
                <Alert severity="success" sx={{ mb: 2 }} onClose={() => setSuccessMessage('')}>
                    {successMessage}
                </Alert>
            )}

            {accounts.length === 0 ? (
                <Card variant="outlined">
                    <CardContent sx={{ textAlign: 'center', py: 4 }}>
                        <BankIcon sx={{ fontSize: 60, color: 'text.disabled', mb: 2 }} />
                        <Typography variant="h6" gutterBottom>
                            No Connected Banks
                        </Typography>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            Connect your bank account to automatically sync transactions
                        </Typography>
                        <Button variant="outlined" onClick={() => setConnectDialogOpen(true)}>
                            Connect Your First Bank
                        </Button>
                    </CardContent>
                </Card>
            ) : (
                <Grid container spacing={2}>
                    {accounts.map((account) => (
                        <Grid item xs={12} md={6} key={account.id}>
                            <Card variant="outlined">
                                <CardContent>
                                    <Box display="flex" justifyContent="space-between" alignItems="flex-start">
                                        <Box display="flex" alignItems="center" gap={1}>
                                            <Typography variant="h4">{account.bankLogo}</Typography>
                                            <Box>
                                                <Typography variant="subtitle1" fontWeight="bold">
                                                    {account.bankName}
                                                </Typography>
                                                <Typography variant="caption" color="text.secondary">
                                                    {account.accountType} • {account.accountNumber}
                                                </Typography>
                                            </Box>
                                        </Box>
                                        <Chip
                                            label={account.isConnected ? 'Connected' : 'Disconnected'}
                                            color={account.isConnected ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </Box>

                                    <Divider sx={{ my: 2 }} />

                                    <Box display="flex" justifyContent="space-between" alignItems="center">
                                        <Box>
                                            <Typography variant="caption" color="text.secondary">
                                                Balance
                                            </Typography>
                                            <Typography
                                                variant="h6"
                                                color={account.balance >= 0 ? 'success.main' : 'error.main'}
                                            >
                                                {formatCurrency(account.balance)}
                                            </Typography>
                                        </Box>
                                        <Box textAlign="right">
                                            <Typography variant="caption" color="text.secondary" display="block">
                                                Last synced
                                            </Typography>
                                            <Typography variant="caption">
                                                {formatDate(account.lastSynced)}
                                            </Typography>
                                        </Box>
                                    </Box>

                                    <Box display="flex" gap={1} mt={2}>
                                        <Button
                                            fullWidth
                                            variant="outlined"
                                            startIcon={syncing === account.id ? <CircularProgress size={16} /> : <SyncIcon />}
                                            onClick={() => handleSyncAccount(account.id)}
                                            disabled={syncing === account.id}
                                        >
                                            {syncing === account.id ? 'Syncing...' : 'Sync Now'}
                                        </Button>
                                        <IconButton
                                            color="error"
                                            onClick={() => handleDisconnect(account.id)}
                                            title="Disconnect"
                                        >
                                            <UnlinkIcon />
                                        </IconButton>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
            )}

            {/* Connect Bank Dialog */}
            <Dialog open={connectDialogOpen} onClose={() => setConnectDialogOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>Connect a Bank</DialogTitle>
                <DialogContent>
                    <Typography variant="body2" color="text.secondary" mb={2}>
                        Select your bank to securely connect your account. (Demo Mode)
                    </Typography>
                    <List>
                        {supportedBanks.map((bank) => (
                            <ListItem
                                key={bank.id}
                                button
                                onClick={() => handleConnectBank(bank.id)}
                                disabled={connecting !== null}
                                sx={{ borderRadius: 1, mb: 1, bgcolor: 'action.hover' }}
                            >
                                <ListItemIcon>
                                    <Typography variant="h5">{bank.logo}</Typography>
                                </ListItemIcon>
                                <ListItemText primary={bank.name} />
                                <ListItemSecondaryAction>
                                    {connecting === bank.id ? (
                                        <CircularProgress size={20} />
                                    ) : (
                                        <CheckIcon color="action" />
                                    )}
                                </ListItemSecondaryAction>
                            </ListItem>
                        ))}
                    </List>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConnectDialogOpen(false)}>Cancel</Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default BankConnection;
