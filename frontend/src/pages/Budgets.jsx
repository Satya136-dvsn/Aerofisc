import { useState, useEffect } from 'react';
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

    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        try {
            setLoading(true);
            // Load Budgets
            const budgetRes = await budgetService.getAll();
            setBudgets(budgetRes.data);

            // Load Categories (categoryService returns data directly based on previous view)
            const categoryData = await categoryService.getAll();
            setCategories(categoryData);

            setError('');
        } catch (err) {
            console.error('Data load error:', err);
            if (err.response?.status === 403 || err.response?.status === 401) {
                return;
            }
            setError('Failed to load budgets data');
        } finally {
            setLoading(false);
        }
    };

    const loadBudgets = async () => {
        try {
            const response = await budgetService.getAll();
            setBudgets(response.data);
        } catch (err) {
            console.error('Budget refresh error:', err);
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

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this budget?')) return;

        try {
            await budgetService.delete(id);
            loadBudgets();
        } catch (err) {
            console.error('Delete budget failed:', err);
            // More specific error message
            if (err.response && err.response.status === 409) {
                setError('Cannot delete budget because it has associated transactions. Please delete the transactions first.');
            } else {
                setError('Failed to delete budget. Please try again.');
            }
        }
    };

    const handleDialogClose = (reload) => {
        setDialogOpen(false);
        setSelectedBudget(null);
        if (reload) loadBudgets();
    };

    const handleApplyTemplate = async (template) => {
        setTemplateDialogOpen(false);

        if (!window.confirm(`Apply "${template.name}"? This will create ${template.budgets.length} new budgets.`)) {
            return;
        }

        setLoading(true);
        let successCount = 0;

        try {
            const today = new Date();
            // Set end date to 1 month from now for monthly budgets
            const endDate = new Date(today);
            endDate.setMonth(endDate.getMonth() + 1);

            const startDateStr = today.toISOString().split('T')[0];
            const endDateStr = endDate.toISOString().split('T')[0];

            // We process sequentially to avoid overwhelming backend or race conditions with category creation
            for (const item of template.budgets) {
                try {
                    // 1. Find or Create Category
                    let categoryId = null;
                    // Case insensitive check
                    const existingCat = categories.find(c => c.name.toLowerCase() === item.category.toLowerCase());

                    if (existingCat) {
                        categoryId = existingCat.id;
                    } else {
                        // Create new category if it doesn't exist
                        console.log(`Creating new category: ${item.category}`);
                        const type = item.category.toLowerCase().includes('income') ? 'INCOME' : 'EXPENSE';
                        const newCatData = await categoryService.create({
                            name: item.category,
                            type: type,
                            color: '#808080' // Default color
                        });
                        categoryId = newCatData.id;
                        // Update local categories list conservatively
                        setCategories(prev => [...prev, newCatData]);
                    }

                    // 2. Create Budget
                    await budgetService.create({
                        categoryId: categoryId, // Critical: Backend expects categoryId
                        amount: item.amount,
                        period: item.period || 'MONTHLY',
                        startDate: startDateStr,
                        endDate: endDateStr, // Critical: Backend expects endDate
                        alertThreshold: 80
                    });
                    successCount++;
                } catch (innerErr) {
                    console.warn(`Failed to create budget for ${item.category}:`, innerErr);
                }
            }

            if (successCount > 0) {
                alert(`Successfully created ${successCount} budgets from template!`);
                loadBudgets();
            } else {
                setError('Failed to apply template. Check validation rules or if budgets already exist.');
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

    if (loading && budgets.length === 0) {
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
        </Container>
    );
};

export default Budgets;
