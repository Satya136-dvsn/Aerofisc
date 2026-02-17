/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { useState } from 'react';
import {
    Card,
    CardContent,
    Box,
    Typography,
    Button,
    Chip,
    IconButton,
    CircularProgress,
} from '@mui/material';
import { Refresh, LinkOff, AccountBalance } from '@mui/icons-material';

const BankAccountCard = ({ account, onSync, onDisconnect }) => {
    const [syncing, setSyncing] = useState(false);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
        }).format(amount);
    };

    const formatLastSync = (timestamp) => {
        const date = new Date(timestamp);
        const now = new Date();
        const diff = Math.floor((now - date) / 1000 / 60); // minutes

        if (diff < 1) return 'Just now';
        if (diff < 60) return `${diff} minutes ago`;
        if (diff < 1440) return `${Math.floor(diff / 60)} hours ago`;
        return date.toLocaleDateString('en-IN');
    };

    const handleSync = async () => {
        setSyncing(true);
        await onSync(account.id);
        setSyncing(false);
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Connected':
                return 'success';
            case 'Syncing':
                return 'info';
            case 'Error':
                return 'error';
            default:
                return 'default';
        }
    };

    return (
        <Card elevation={2} sx={{ height: '100%' }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box display="flex" gap={2} alignItems="center">
                        <Box
                            sx={{
                                width: 48,
                                height: 48,
                                borderRadius: 2,
                                bgcolor: 'primary.main',
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                fontSize: '1.5rem',
                            }}
                        >
                            {account.bankLogo}
                        </Box>
                        <Box>
                            <Typography variant="h6" fontWeight="bold">
                                {account.bankName}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                {account.accountType} • {account.accountNumber}
                            </Typography>
                        </Box>
                    </Box>
                    <Chip
                        label={account.status}
                        color={getStatusColor(account.status)}
                        size="small"
                    />
                </Box>

                <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Current Balance
                    </Typography>
                    <Typography variant="h4" fontWeight="bold" color="primary.main">
                        {formatCurrency(account.balance)}
                    </Typography>
                </Box>

                <Box mb={2}>
                    <Typography variant="caption" color="text.secondary">
                        Last synced: {formatLastSync(account.lastSync)}
                    </Typography>
                </Box>

                <Box display="flex" gap={1}>
                    <Button
                        variant="outlined"
                        startIcon={syncing ? <CircularProgress size={16} /> : <Refresh />}
                        onClick={handleSync}
                        disabled={syncing}
                        fullWidth
                    >
                        {syncing ? 'Syncing...' : 'Sync Now'}
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        startIcon={<LinkOff />}
                        onClick={() => onDisconnect(account.id)}
                    >
                        Disconnect
                    </Button>
                </Box>
            </CardContent>
        </Card>
    );
};

export default BankAccountCard;
