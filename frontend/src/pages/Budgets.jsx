/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { useState, useEffect, useCallback } from 'react';
import {
    Container,
    Box,
    Typography,
    Button,
    Grid,
    Alert,
    Fade,
    Fab,
    CircularProgress,
    Chip,
    Dialog,
    DialogContent,
    DialogTitle,
    DialogActions,
    DialogContentText,
} from '@mui/material';
import { Add as AddIcon, TrendingUp as TrendingUpIcon, AutoAwesome as TemplateIcon } from '@mui/icons-material';
import budgetService from '../services/budgetService';
import categoryService from '../services/categoryService';
import exportService from '../services/exportService';
import ExportMenu from '../components/common/ExportMenu';
import BudgetDialog from '../components/BudgetDialog';
import BudgetCard from '../components/budgets/BudgetCard';
import BudgetTemplates from '../components/BudgetTemplates';

const Budgets = () => {
    const [budgets, setBudgets] = useState([]);
    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedBudget, setSelectedBudget] = useState(null);
    const [templateDialogOpen, setTemplateDialogOpen] = useState(false);

    // Delete confirmation dialog state
    const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
    const [budgetToDelete, setBudgetToDelete] = useState(null);
    const [isDeleting, setIsDeleting] = useState(false);

    useEffect(() => {
        loadBudgets();
        loadCategories();
    }, []);

    const loadCategories = async () => {
        try {
            const response = await categoryService.getAll();
            setCategories(response.data);
        } catch (err) {
            console.error('Failed to load categories', err);
        }
    };

    const loadBudgets = async () => {
        try {
            setLoading(true);
            const response = await budgetService.getAll();
            setBudgets(response.data);
            setError('');
        } catch (err) {
            console.error('Budget load error:', err);
            if (err.response?.status === 403 || err.response?.status === 401) {
                return;
            }
            setError('Failed to load budgets');
        } finally {
            setLoading(false);
        }
    };

    const handleAdd = () => {
        setSelectedBudget(null);
        setDialogOpen(true);
    };

    const handleEdit = (budget) => {
        setSelectedBudget(budget);
        setDialogOpen(true);
    };

    // Opens the delete confirmation dialog 
    const handleDelete = useCallback((id) => {
        console.log('handleDelete called - opening confirm dialog for ID:', id);
        if (!id) {
            setError('Invalid budget ID');
            return;
        }
        setBudgetToDelete(id);
        setDeleteConfirmOpen(true);
    }, []);

    // Actually performs the deletion after user confirms
    const confirmDelete = async () => {
        console.log('confirmDelete called for ID:', budgetToDelete);
        setDeleteConfirmOpen(false);

        if (!budgetToDelete || isDeleting) {
            return;
        }

        setIsDeleting(true);
        try {
            console.log('Sending delete request for budget:', budgetToDelete);
            await budgetService.delete(budgetToDelete);
            console.log('Delete successful');
            await loadBudgets();
        } catch (err) {
            console.error('Delete failed:', err);
            setError(err.response?.data?.message || 'Failed to delete budget. It may have associated transactions.');
        } finally {
            setIsDeleting(false);
            setBudgetToDelete(null);
        }
    };

    const cancelDelete = () => {
        setDeleteConfirmOpen(false);
        setBudgetToDelete(null);
    };

    const handleDialogClose = (reload) => {
        setDialogOpen(false);
        setSelectedBudget(null);
        if (reload) loadBudgets();
    };

    const handleApplyTemplate = async (template) => {
        console.log('handleApplyTemplate called with:', template);
        console.log('Current categories:', categories);
        console.log('Existing budgets:', budgets);

        setTemplateDialogOpen(false);

        // No window.confirm here - BudgetTemplates component already has confirmation dialog

        setLoading(true);
        let successCount = 0;
        let updateCount = 0;

        try {
            const today = new Date();
            const endDate = new Date(today);
            endDate.setMonth(endDate.getMonth() + 1);

            const startDateStr = today.toISOString().split('T')[0];
            const endDateStr = endDate.toISOString().split('T')[0];

            console.log('Date range:', startDateStr, 'to', endDateStr);

            for (const item of template.budgets) {
                console.log('Processing template item:', item);
                try {
                    // 1. Find Category using fuzzy matching (partial match)
                    let categoryId = null;
                    const templateCatLower = item.category.toLowerCase();

                    // First try exact match, then partial match
                    let existingCat = categories.find(c => c.name.toLowerCase() === templateCatLower);

                    if (!existingCat) {
                        // Try partial match: category contains template name OR template name contains category
                        existingCat = categories.find(c => {
                            const catNameLower = c.name.toLowerCase();
                            return catNameLower.includes(templateCatLower) || templateCatLower.includes(catNameLower);
                        });
                    }

                    console.log('Category search result (fuzzy):', existingCat);

                    if (existingCat) {
                        categoryId = existingCat.id;
                        console.log('Using existing category ID:', categoryId, 'Name:', existingCat.name);
                    } else {
                        console.log(`Creating new category: ${item.category}`);
                        const type = item.category.includes('Income') ? 'INCOME' : 'EXPENSE';
                        const newCatRes = await categoryService.create({
                            name: item.category,
                            type: type,
                            color: '#808080'
                        });
                        console.log('Category creation response:', newCatRes);
                        categoryId = newCatRes.data.id;
                        setCategories(prev => [...prev, newCatRes.data]);
                    }

                    // 2. Check if a budget for this category already exists (by categoryId OR by matched category name)
                    let existingBudget = budgets.find(b => b.categoryId === categoryId);

                    // Also try matching by category name (in case categoryId differs due to system categories)
                    if (!existingBudget && existingCat) {
                        existingBudget = budgets.find(b =>
                            b.categoryName?.toLowerCase() === existingCat.name.toLowerCase()
                        );
                    }

                    console.log('Existing budget search result:', existingBudget);

                    if (existingBudget) {
                        // Update existing budget
                        console.log('Updating existing budget:', existingBudget);
                        const updatePayload = {
                            categoryId: categoryId,
                            amount: item.amount,
                            period: item.period || 'MONTHLY',
                            startDate: existingBudget.startDate || startDateStr,
                            endDate: existingBudget.endDate || endDateStr,
                            alertThreshold: existingBudget.alertThreshold || 80
                        };
                        console.log('Update payload:', updatePayload);
                        await budgetService.update(existingBudget.id, updatePayload);
                        updateCount++;
                    } else {
                        // Create new budget
                        const budgetPayload = {
                            categoryId: categoryId,
                            amount: item.amount,
                            period: item.period || 'MONTHLY',
                            startDate: startDateStr,
                            endDate: endDateStr,
                            alertThreshold: 80
                        };
                        console.log('Creating budget with payload:', budgetPayload);

                        const budgetRes = await budgetService.create(budgetPayload);
                        console.log('Budget creation response:', budgetRes);
                        successCount++;
                    }
                } catch (innerErr) {
                    console.error(`Failed to process budget for ${item.category}:`, innerErr);
                    console.error('Error response:', innerErr.response?.data);
                }
            }

            console.log('Template application complete. Created:', successCount, 'Updated:', updateCount);

            const totalProcessed = successCount + updateCount;
            if (totalProcessed > 0) {
                let message = '';
                if (successCount > 0 && updateCount > 0) {
                    message = `Successfully created ${successCount} and updated ${updateCount} budgets!`;
                } else if (successCount > 0) {
                    message = `Successfully created ${successCount} budgets!`;
                } else {
                    message = `Successfully updated ${updateCount} existing budgets!`;
                }
                alert(message);
                loadBudgets();
            } else {
                setError('Failed to apply template. Please check console for details.');
            }

        } catch (err) {
            console.error('Template application error:', err);
            setError('An unexpected error occurred while applying the template.');
        } finally {
            setLoading(false);
        }
    };

    // Calculate summary stats
    const totalBudgeted = budgets.reduce((sum, b) => sum + (b.amount || 0), 0);
    const totalSpent = budgets.reduce((sum, b) => sum + (b.spent || 0), 0);
    const onTrackCount = budgets.filter((b) => {
        const percentage = (b.spent / b.amount) * 100;
        return percentage < 80;
    }).length;
    const nearLimitCount = budgets.filter((b) => {
        const percentage = (b.spent / b.amount) * 100;
        return percentage >= 80 && percentage < 100;
    }).length;
    const exceededCount = budgets.filter((b) => {
        const percentage = (b.spent / b.amount) * 100;
        return percentage >= 100;
    }).length;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ pb: 4 }}>
            {/* Page Header */}
            <Fade in timeout={300}>
                <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Box>
                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 0.5 }}>
                                Budget Management
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Track your spending limits and stay on budget
                            </Typography>
                        </Box>
                        <Box display="flex" gap={1}>
                            <ExportMenu
                                formats={['excel', 'pdf']}
                                onExport={(format) => exportService.exportBudgets(format)}
                            />
                            <Button
                                variant="outlined"
                                startIcon={<TemplateIcon />}
                                onClick={() => setTemplateDialogOpen(true)}
                            >
                                Use Template
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<AddIcon />}
                                onClick={handleAdd}
                                size="large"
                            >
                                Create Budget
                            </Button>
                        </Box>
                    </Box>

                    {error && (
                        <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>
                            {error}
                        </Alert>
                    )}

                    {/* Summary Stats */}
                    {budgets.length > 0 && (
                        <Grid container spacing={2} sx={{ mb: 4 }}>
                            <Grid item xs={12} sm={6} md={3}>
                                <Box p={2} bgcolor="background.paper" borderRadius={2} textAlign="center">
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Total Budgeted
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'primary.main' }}>
                                        {formatCurrency(totalBudgeted)}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={3}>
                                <Box p={2} bgcolor="background.paper" borderRadius={2} textAlign="center">
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Total Spent
                                    </Typography>
                                    <Typography variant="h5" sx={{ fontWeight: 700, color: 'error.main' }}>
                                        {formatCurrency(totalSpent)}
                                    </Typography>
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <Box p={2} bgcolor="background.paper" borderRadius={2} textAlign="center">
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        On Track
                                    </Typography>
                                    <Chip label={onTrackCount} color="success" sx={{ mt: 1, fontWeight: 600 }} />
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <Box p={2} bgcolor="background.paper" borderRadius={2} textAlign="center">
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Near Limit
                                    </Typography>
                                    <Chip label={nearLimitCount} color="warning" sx={{ mt: 1, fontWeight: 600 }} />
                                </Box>
                            </Grid>
                            <Grid item xs={12} sm={6} md={2}>
                                <Box p={2} bgcolor="background.paper" borderRadius={2} textAlign="center">
                                    <Typography variant="caption" color="text.secondary" display="block">
                                        Exceeded
                                    </Typography>
                                    <Chip label={exceededCount} color="error" sx={{ mt: 1, fontWeight: 600 }} />
                                </Box>
                            </Grid>
                        </Grid>
                    )}

                    {/* Budget Cards */}
                    {budgets.length === 0 ? (
                        <Fade in timeout={500}>
                            <Box
                                display="flex"
                                flexDirection="column"
                                alignItems="center"
                                justifyContent="center"
                                minHeight="40vh"
                                textAlign="center"
                                p={4}
                            >
                                <TrendingUpIcon sx={{ fontSize: 80, color: 'text.disabled', mb: 2 }} />
                                <Typography variant="h5" gutterBottom sx={{ fontWeight: 600 }}>
                                    No Budgets Created Yet
                                </Typography>
                                <Typography variant="body1" color="text.secondary" sx={{ mb: 3, maxWidth: 500 }}>
                                    Start managing your finances by creating budgets for different spending categories.
                                    Set limits and track your progress to stay on top of your financial goals.
                                </Typography>
                                <Button
                                    variant="contained"
                                    startIcon={<AddIcon />}
                                    onClick={handleAdd}
                                    size="large"
                                >
                                    Create Your First Budget
                                </Button>
                            </Box>
                        </Fade>
                    ) : (
                        <Grid container spacing={3}>
                            {budgets.map((budget, index) => (
                                <Grid item xs={12} sm={6} md={4} key={budget.id}>
                                    <Fade in timeout={300 + index * 100}>
                                        <Box>
                                            <BudgetCard
                                                budget={budget}
                                                onEdit={handleEdit}
                                                onDelete={handleDelete}
                                            />
                                        </Box>
                                    </Fade>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Box>
            </Fade>

            {/* Floating Action Button */}
            {budgets.length > 0 && (
                <Fab
                    color="primary"
                    aria-label="add budget"
                    onClick={handleAdd}
                    sx={{
                        position: 'fixed',
                        bottom: 32,
                        right: 32,
                    }}
                >
                    <AddIcon />
                </Fab>
            )}

            {/* Budget Dialog */}
            <BudgetDialog
                open={dialogOpen}
                budget={selectedBudget}
                onClose={handleDialogClose}
            />

            {/* Budget Templates Dialog */}
            <Dialog open={templateDialogOpen} onClose={() => setTemplateDialogOpen(false)} maxWidth="md" fullWidth>
                <DialogContent sx={{ p: 3 }}>
                    <BudgetTemplates
                        onApplyTemplate={handleApplyTemplate}
                        onClose={() => setTemplateDialogOpen(false)}
                    />
                </DialogContent>
            </Dialog>

            {/* Delete Confirmation Dialog */}
            <Dialog
                open={deleteConfirmOpen}
                onClose={cancelDelete}
                aria-labelledby="delete-dialog-title"
                aria-describedby="delete-dialog-description"
            >
                <DialogTitle id="delete-dialog-title">
                    Delete Budget?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="delete-dialog-description">
                        Are you sure you want to delete this budget? This action cannot be undone.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={cancelDelete} color="inherit">
                        Cancel
                    </Button>
                    <Button onClick={confirmDelete} color="error" variant="contained" autoFocus>
                        Delete
                    </Button>
                </DialogActions>
            </Dialog>
        </Container>
    );
};

export default Budgets;
