import React, { useState } from 'react';
import {
    Box,
    Card,
    CardContent,
    Typography,
    Grid,
    Button,
    Chip,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Divider,
} from '@mui/material';
import {
    Restaurant as FoodIcon,
    DirectionsCar as TransportIcon,
    LocalHospital as HealthIcon,
    ShoppingCart as ShoppingIcon,
    Movie as EntertainmentIcon,
    School as EducationIcon,
    Home as HousingIcon,
    Savings as SavingsIcon,
    Check as CheckIcon,
    Close as CloseIcon,
} from '@mui/icons-material';

// Predefined Budget Templates
const BUDGET_TEMPLATES = {
    student: {
        name: 'Student Budget',
        description: 'Essential budgets for students living on a tight budget',
        icon: <EducationIcon />,
        color: '#4CAF50',
        budgets: [
            { category: 'Food & Groceries', amount: 5000, period: 'MONTHLY' },
            { category: 'Transportation', amount: 2000, period: 'MONTHLY' },
            { category: 'Education', amount: 3000, period: 'MONTHLY' },
            { category: 'Entertainment', amount: 1500, period: 'MONTHLY' },
        ],
    },
    professional: {
        name: 'Working Professional',
        description: 'Balanced budget for young professionals',
        icon: <ShoppingIcon />,
        color: '#2196F3',
        budgets: [
            { category: 'Food & Dining', amount: 10000, period: 'MONTHLY' },
            { category: 'Transportation', amount: 5000, period: 'MONTHLY' },
            { category: 'Shopping', amount: 8000, period: 'MONTHLY' },
            { category: 'Entertainment', amount: 5000, period: 'MONTHLY' },
            { category: 'Health & Fitness', amount: 3000, period: 'MONTHLY' },
        ],
    },
    family: {
        name: 'Family Budget',
        description: 'Comprehensive budget for families with household expenses',
        icon: <HousingIcon />,
        color: '#FF9800',
        budgets: [
            { category: 'Groceries', amount: 15000, period: 'MONTHLY' },
            { category: 'Utilities', amount: 5000, period: 'MONTHLY' },
            { category: 'Education', amount: 10000, period: 'MONTHLY' },
            { category: 'Healthcare', amount: 5000, period: 'MONTHLY' },
            { category: 'Transportation', amount: 8000, period: 'MONTHLY' },
            { category: 'Entertainment', amount: 5000, period: 'MONTHLY' },
        ],
    },
    minimalist: {
        name: 'Minimalist',
        description: 'Focus on essential spending only',
        icon: <SavingsIcon />,
        color: '#9C27B0',
        budgets: [
            { category: 'Food', amount: 8000, period: 'MONTHLY' },
            { category: 'Transportation', amount: 3000, period: 'MONTHLY' },
            { category: 'Utilities', amount: 3000, period: 'MONTHLY' },
        ],
    },
    saver: {
        name: 'Aggressive Saver',
        description: 'Maximize savings with strict limits',
        icon: <SavingsIcon />,
        color: '#00BCD4',
        budgets: [
            { category: 'Food & Essentials', amount: 6000, period: 'MONTHLY' },
            { category: 'Transportation', amount: 2000, period: 'MONTHLY' },
            { category: 'Utilities', amount: 2500, period: 'MONTHLY' },
            { category: 'Personal Care', amount: 1000, period: 'MONTHLY' },
        ],
    },
};

const BudgetTemplates = ({ onApplyTemplate, onClose }) => {
    const [selectedTemplate, setSelectedTemplate] = useState(null);
    const [confirmOpen, setConfirmOpen] = useState(false);

    const handleSelectTemplate = (templateKey) => {
        setSelectedTemplate(templateKey);
        setConfirmOpen(true);
    };

    const handleConfirmApply = () => {
        if (selectedTemplate && onApplyTemplate) {
            onApplyTemplate(BUDGET_TEMPLATES[selectedTemplate]);
        }
        setConfirmOpen(false);
        if (onClose) onClose();
    };

    const getCategoryIcon = (category) => {
        const lowerCategory = category.toLowerCase();
        if (lowerCategory.includes('food') || lowerCategory.includes('groceries')) return <FoodIcon />;
        if (lowerCategory.includes('transport')) return <TransportIcon />;
        if (lowerCategory.includes('health') || lowerCategory.includes('fitness')) return <HealthIcon />;
        if (lowerCategory.includes('shopping')) return <ShoppingIcon />;
        if (lowerCategory.includes('entertainment')) return <EntertainmentIcon />;
        if (lowerCategory.includes('education')) return <EducationIcon />;
        if (lowerCategory.includes('housing') || lowerCategory.includes('utilities')) return <HousingIcon />;
        return <SavingsIcon />;
    };

    const formatAmount = (amount) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <Box>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                <Typography variant="h5" fontWeight="bold">
                    Budget Templates
                </Typography>
                {onClose && (
                    <IconButton onClick={onClose}>
                        <CloseIcon />
                    </IconButton>
                )}
            </Box>

            <Typography variant="body2" color="text.secondary" mb={3}>
                Choose a template to quickly set up your monthly budgets. You can customize them after applying.
            </Typography>

            <Grid container spacing={2}>
                {Object.entries(BUDGET_TEMPLATES).map(([key, template]) => (
                    <Grid item xs={12} sm={6} md={4} key={key}>
                        <Card
                            sx={{
                                height: '100%',
                                cursor: 'pointer',
                                transition: 'all 0.2s',
                                border: '2px solid transparent',
                                '&:hover': {
                                    transform: 'translateY(-4px)',
                                    boxShadow: 4,
                                    borderColor: template.color,
                                },
                            }}
                            onClick={() => handleSelectTemplate(key)}
                        >
                            <CardContent>
                                <Box display="flex" alignItems="center" gap={1} mb={1}>
                                    <Box
                                        sx={{
                                            p: 1,
                                            borderRadius: 2,
                                            bgcolor: `${template.color}20`,
                                            color: template.color,
                                            display: 'flex',
                                        }}
                                    >
                                        {template.icon}
                                    </Box>
                                    <Typography variant="h6" fontWeight="bold">
                                        {template.name}
                                    </Typography>
                                </Box>

                                <Typography variant="body2" color="text.secondary" mb={2}>
                                    {template.description}
                                </Typography>

                                <Box display="flex" flexWrap="wrap" gap={0.5}>
                                    {template.budgets.slice(0, 3).map((budget, idx) => (
                                        <Chip
                                            key={idx}
                                            label={`${budget.category.split(' ')[0]}: ${formatAmount(budget.amount)}`}
                                            size="small"
                                            variant="outlined"
                                        />
                                    ))}
                                    {template.budgets.length > 3 && (
                                        <Chip
                                            label={`+${template.budgets.length - 3} more`}
                                            size="small"
                                            color="primary"
                                        />
                                    )}
                                </Box>
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>

            {/* Confirmation Dialog */}
            <Dialog open={confirmOpen} onClose={() => setConfirmOpen(false)} maxWidth="sm" fullWidth>
                <DialogTitle>
                    Apply "{selectedTemplate && BUDGET_TEMPLATES[selectedTemplate]?.name}" Template?
                </DialogTitle>
                <DialogContent>
                    {selectedTemplate && (
                        <>
                            <Typography variant="body2" color="text.secondary" mb={2}>
                                This will create the following budgets for you:
                            </Typography>
                            <Divider sx={{ mb: 2 }} />
                            {BUDGET_TEMPLATES[selectedTemplate].budgets.map((budget, idx) => (
                                <Box
                                    key={idx}
                                    display="flex"
                                    alignItems="center"
                                    justifyContent="space-between"
                                    py={1}
                                    borderBottom="1px solid"
                                    borderColor="divider"
                                >
                                    <Box display="flex" alignItems="center" gap={1}>
                                        {getCategoryIcon(budget.category)}
                                        <Typography>{budget.category}</Typography>
                                    </Box>
                                    <Chip label={formatAmount(budget.amount)} color="primary" size="small" />
                                </Box>
                            ))}
                        </>
                    )}
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
                    <Button
                        variant="contained"
                        startIcon={<CheckIcon />}
                        onClick={handleConfirmApply}
                    >
                        Apply Template
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export { BUDGET_TEMPLATES };
export default BudgetTemplates;
