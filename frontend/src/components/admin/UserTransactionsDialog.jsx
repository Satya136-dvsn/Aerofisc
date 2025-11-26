import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Button,
    Chip,
    Typography,
    Box,
    CircularProgress,
    IconButton
} from '@mui/material';
import { Close } from '@mui/icons-material';
import adminService from '../../services/adminService';

const UserTransactionsDialog = ({ open, onClose, userId, userName }) => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        if (open && userId) {
            fetchTransactions();
        }
    }, [open, userId, page]);

    const fetchTransactions = async () => {
        try {
            setLoading(true);
            const response = await adminService.getUserTransactions(userId, page, 20);
            setTransactions(response.data.content || []);
            setTotalPages(response.data.totalPages || 0);
        } catch (error) {
            console.error('Failed to fetch user transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const getTypeColor = (type) => {
        return type === 'INCOME' ? 'success' : 'error';
    };

    const formatAmount = (amount) => {
        return `$${parseFloat(amount).toFixed(2)}`;
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>
                    <Typography variant="h6">User Transactions</Typography>
                    <Typography variant="body2" color="text.secondary">
                        {userName}
                    </Typography>
                </Box>
                <IconButton onClick={onClose} size="small">
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                        <CircularProgress />
                    </Box>
                ) : transactions.length === 0 ? (
                    <Box display="flex" justifyContent="center" alignItems="center" minHeight="300px">
                        <Typography variant="body2" color="text.secondary">
                            No transactions found for this user.
                        </Typography>
                    </Box>
                ) : (
                    <TableContainer>
                        <Table size="small">
                            <TableHead>
                                <TableRow sx={{ bgcolor: 'background.default' }}>
                                    <TableCell>Date</TableCell>
                                    <TableCell>Description</TableCell>
                                    <TableCell>Category</TableCell>
                                    <TableCell>Type</TableCell>
                                    <TableCell align="right">Amount</TableCell>
                                </TableRow>
                            </TableHead>
                            <TableBody>
                                {transactions.map((transaction) => (
                                    <TableRow key={transaction.id} hover>
                                        <TableCell>
                                            {new Date(transaction.date).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell>
                                            <Typography variant="body2">
                                                {transaction.description || 'N/A'}
                                            </Typography>
                                        </TableCell>
                                        <TableCell>
                                            {transaction.category?.name || 'Uncategorized'}
                                        </TableCell>
                                        <TableCell>
                                            <Chip
                                                label={transaction.type}
                                                size="small"
                                                color={getTypeColor(transaction.type)}
                                                variant="outlined"
                                            />
                                        </TableCell>
                                        <TableCell align="right">
                                            <Typography
                                                variant="body2"
                                                fontWeight="bold"
                                                color={transaction.type === 'INCOME' ? 'success.main' : 'error.main'}
                                            >
                                                {formatAmount(transaction.amount)}
                                            </Typography>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DialogContent>
            <DialogActions>
                <Typography variant="caption" color="text.secondary" sx={{ mr: 'auto', ml: 2 }}>
                    Page {page + 1} of {totalPages || 1}
                </Typography>
                <Button onClick={() => setPage(Math.max(0, page - 1))} disabled={page === 0}>
                    Previous
                </Button>
                <Button onClick={() => setPage(page + 1)} disabled={page >= totalPages - 1 || totalPages === 0}>
                    Next
                </Button>
                <Button onClick={onClose} variant="contained">
                    Close
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default UserTransactionsDialog;
