import React, { useState, useEffect } from 'react';
import {
    Box, Typography, Button, Card, CardContent, Grid, Chip, IconButton,
    Dialog, DialogTitle, DialogContent, DialogActions, TextField, MenuItem,
    FormControl, InputLabel, Select, Switch, FormControlLabel, Alert,
    Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper,
    CircularProgress, Tooltip
} from '@mui/material';
import {
    Add as AddIcon,
    Edit as EditIcon,
    Delete as DeleteIcon,
    PlayArrow as PlayIcon,
    Pause as PauseIcon,
    Repeat as RepeatIcon,
    TrendingUp as IncomeIcon,
    TrendingDown as ExpenseIcon
} from '@mui/icons-material';
import { format } from 'date-fns';
import recurringService from '../services/recurringService';
import categoryService from '../services/categoryService';

const RecurringTransactionsPage = () => {
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [categories, setCategories] = useState([]);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingTransaction, setEditingTransaction] = useState(null);
    const [formData, setFormData] = useState({
        type: 'EXPENSE',
        amount: '',
        categoryId: '',
        description: '',
        frequency: 'MONTHLY',
        startDate: format(new Date(), 'yyyy-MM-dd'),
        endDate: '',
        maxOccurrences: ''
    });
    const [showInactive, setShowInactive] = useState(false);

    useEffect(() => {
        fetchData();
    }, [showInactive]);

    const fetchData = async () => {
        try {
            setLoading(true);
            const [transactionsData, categoriesData] = await Promise.all([
                recurringService.getAll(!showInactive),
                categoryService.getAll()
            ]);
            setTransactions(transactionsData);
            setCategories(categoriesData);
            setError(null);
        } catch (err) {
            setError('Failed to load recurring transactions');
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const handleOpenDialog = (transaction = null) => {
        if (transaction) {
            setEditingTransaction(transaction);
            setFormData({
                type: transaction.type,
                amount: transaction.amount,
                categoryId: transaction.categoryId,
                description: transaction.description || '',
                frequency: transaction.frequency,
                startDate: transaction.startDate,
                endDate: transaction.endDate || '',
                maxOccurrences: transaction.maxOccurrences || ''
            });
        } else {
            setEditingTransaction(null);
            setFormData({
                type: 'EXPENSE',
                amount: '',
                categoryId: '',
                description: '',
                frequency: 'MONTHLY',
                startDate: format(new Date(), 'yyyy-MM-dd'),
                endDate: '',
                maxOccurrences: ''
            });
        }
        setDialogOpen(true);
    };

    const handleCloseDialog = () => {
        setDialogOpen(false);
        setEditingTransaction(null);
    };

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async () => {
        try {
            const data = {
                ...formData,
                amount: parseFloat(formData.amount),
                categoryId: parseInt(formData.categoryId),
                endDate: formData.endDate || null,
                maxOccurrences: formData.maxOccurrences ? parseInt(formData.maxOccurrences) : null
            };

            if (editingTransaction) {
                await recurringService.update(editingTransaction.id, data);
            } else {
                await recurringService.create(data);
            }

            handleCloseDialog();
            fetchData();
        } catch (err) {
            setError('Failed to save recurring transaction');
            console.error(err);
        }
    };

    const handleToggleActive = async (id) => {
        try {
            await recurringService.toggleActive(id);
            fetchData();
        } catch (err) {
            setError('Failed to toggle status');
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this recurring transaction?')) {
            try {
                await recurringService.delete(id);
                fetchData();
            } catch (err) {
                setError('Failed to delete');
            }
        }
    };

    const frequencyOptions = recurringService.getFrequencyOptions();
    const typeOptions = recurringService.getTypeOptions();

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Box sx={{ p: 3 }}>
            {/* Header */}
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Box>
                    <Typography variant="h4" fontWeight="bold">
                        <RepeatIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                        Recurring Transactions
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Automatically create transactions on a schedule
                    </Typography>
                </Box>
                <Box display="flex" gap={2} alignItems="center">
                    <FormControlLabel
                        control={
                            <Switch
                                checked={showInactive}
                                onChange={(e) => setShowInactive(e.target.checked)}
                            />
                        }
                        label="Show Inactive"
                    />
                    <Button
                        variant="contained"
                        startIcon={<AddIcon />}
                        onClick={() => handleOpenDialog()}
                    >
                        New Recurring
                    </Button>
                </Box>
            </Box>

            {error && (
                <Alert severity="error" sx={{ mb: 2 }} onClose={() => setError(null)}>
                    {error}
                </Alert>
            )}

            {/* Stats Cards */}
            <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ bgcolor: 'success.light', color: 'success.contrastText' }}>
                        <CardContent>
                            <Typography variant="h6">Active Income</Typography>
                            <Typography variant="h4">
                                ₹{transactions
                                    .filter(t => t.isActive && t.type === 'INCOME')
                                    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
                                    .toLocaleString()}
                            </Typography>
                            <Typography variant="body2">/month (avg)</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ bgcolor: 'error.light', color: 'error.contrastText' }}>
                        <CardContent>
                            <Typography variant="h6">Active Expenses</Typography>
                            <Typography variant="h4">
                                ₹{transactions
                                    .filter(t => t.isActive && t.type === 'EXPENSE')
                                    .reduce((sum, t) => sum + parseFloat(t.amount), 0)
                                    .toLocaleString()}
                            </Typography>
                            <Typography variant="body2">/month (avg)</Typography>
                        </CardContent>
                    </Card>
                </Grid>
                <Grid item xs={12} sm={4}>
                    <Card sx={{ bgcolor: 'primary.light', color: 'primary.contrastText' }}>
                        <CardContent>
                            <Typography variant="h6">Total Active</Typography>
                            <Typography variant="h4">
                                {transactions.filter(t => t.isActive).length}
                            </Typography>
                            <Typography variant="body2">recurring transactions</Typography>
                        </CardContent>
                    </Card>
                </Grid>
            </Grid>

            {/* Transactions Table */}
            <TableContainer component={Paper}>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'grey.100' }}>
                            <TableCell>Type</TableCell>
                            <TableCell>Description</TableCell>
                            <TableCell>Category</TableCell>
                            <TableCell align="right">Amount</TableCell>
                            <TableCell>Frequency</TableCell>
                            <TableCell>Next Date</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell align="center">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {transactions.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">
                                        No recurring transactions yet. Create one to get started!
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            transactions.map((transaction) => (
                                <TableRow
                                    key={transaction.id}
                                    sx={{ opacity: transaction.isActive ? 1 : 0.5 }}
                                >
                                    <TableCell>
                                        {transaction.type === 'INCOME' ? (
                                            <Chip
                                                icon={<IncomeIcon />}
                                                label="Income"
                                                color="success"
                                                size="small"
                                            />
                                        ) : (
                                            <Chip
                                                icon={<ExpenseIcon />}
                                                label="Expense"
                                                color="error"
                                                size="small"
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell>{transaction.description || '-'}</TableCell>
                                    <TableCell>{transaction.categoryName}</TableCell>
                                    <TableCell align="right" sx={{ fontWeight: 'bold' }}>
                                        ₹{parseFloat(transaction.amount).toLocaleString()}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={frequencyOptions.find(f => f.value === transaction.frequency)?.label}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(transaction.nextOccurrence), 'MMM dd, yyyy')}
                                    </TableCell>
                                    <TableCell>
                                        <Chip
                                            label={transaction.isActive ? 'Active' : 'Paused'}
                                            color={transaction.isActive ? 'success' : 'default'}
                                            size="small"
                                        />
                                    </TableCell>
                                    <TableCell align="center">
                                        <Tooltip title={transaction.isActive ? 'Pause' : 'Resume'}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleToggleActive(transaction.id)}
                                            >
                                                {transaction.isActive ? <PauseIcon /> : <PlayIcon />}
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Edit">
                                            <IconButton
                                                size="small"
                                                onClick={() => handleOpenDialog(transaction)}
                                            >
                                                <EditIcon />
                                            </IconButton>
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDelete(transaction.id)}
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        </Tooltip>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>

            {/* Create/Edit Dialog */}
            <Dialog open={dialogOpen} onClose={handleCloseDialog} maxWidth="sm" fullWidth>
                <DialogTitle>
                    {editingTransaction ? 'Edit Recurring Transaction' : 'New Recurring Transaction'}
                </DialogTitle>
                <DialogContent>
                    <Grid container spacing={2} sx={{ mt: 1 }}>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Type</InputLabel>
                                <Select
                                    name="type"
                                    value={formData.type}
                                    onChange={handleInputChange}
                                    label="Type"
                                >
                                    {typeOptions.map(opt => (
                                        <MenuItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="amount"
                                label="Amount"
                                type="number"
                                fullWidth
                                value={formData.amount}
                                onChange={handleInputChange}
                                InputProps={{ startAdornment: '₹' }}
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Category</InputLabel>
                                <Select
                                    name="categoryId"
                                    value={formData.categoryId}
                                    onChange={handleInputChange}
                                    label="Category"
                                >
                                    {categories.map(cat => (
                                        <MenuItem key={cat.id} value={cat.id}>
                                            {cat.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                name="description"
                                label="Description"
                                fullWidth
                                value={formData.description}
                                onChange={handleInputChange}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth>
                                <InputLabel>Frequency</InputLabel>
                                <Select
                                    name="frequency"
                                    value={formData.frequency}
                                    onChange={handleInputChange}
                                    label="Frequency"
                                >
                                    {frequencyOptions.map(opt => (
                                        <MenuItem key={opt.value} value={opt.value}>
                                            {opt.label}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="startDate"
                                label="Start Date"
                                type="date"
                                fullWidth
                                value={formData.startDate}
                                onChange={handleInputChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="endDate"
                                label="End Date (Optional)"
                                type="date"
                                fullWidth
                                value={formData.endDate}
                                onChange={handleInputChange}
                                InputLabelProps={{ shrink: true }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <TextField
                                name="maxOccurrences"
                                label="Max Occurrences (Optional)"
                                type="number"
                                fullWidth
                                value={formData.maxOccurrences}
                                onChange={handleInputChange}
                                helperText="Leave empty for unlimited"
                            />
                        </Grid>
                    </Grid>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancel</Button>
                    <Button
                        variant="contained"
                        onClick={handleSubmit}
                        disabled={!formData.amount || !formData.categoryId}
                    >
                        {editingTransaction ? 'Update' : 'Create'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default RecurringTransactionsPage;
