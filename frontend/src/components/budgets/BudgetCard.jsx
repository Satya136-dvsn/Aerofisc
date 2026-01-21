import {
    Card,
    CardContent,
    CardActions,
    Box,
    Typography,
    LinearProgress,
    IconButton,
    Chip,
    Tooltip,
} from '@mui/material';
import {
    Edit as EditIcon,
    Delete as DeleteIcon,
    TrendingUp as TrendingUpIcon,
    TrendingDown as TrendingDownIcon,
} from '@mui/icons-material';

const BudgetCard = ({ budget, onEdit, onDelete }) => {
    const { category, amount, spent, period, startDate } = budget;

    const remaining = amount - spent;
    const percentage = (spent / amount) * 100;

    // Color coding based on percentage
    const getProgressColor = () => {
        if (percentage < 80) return 'success'; // Green
        if (percentage < 100) return 'warning'; // Yellow
        return 'error'; // Red
    };

    const getStatusLabel = () => {
        if (percentage < 80) return 'On Track';
        if (percentage < 100) return 'Warning';
        return 'Exceeded';
    };

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            month: 'short',
            year: 'numeric',
        });
    };

    const progressColor = getProgressColor();

    return (
        <Card
            sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                position: 'relative',
                transition: 'all 0.3s ease',
                '&:hover': {
                    boxShadow: (theme) => `0 8px 24px ${theme.palette.action.hover}`,
                    transform: 'translateY(-4px)',
                },
            }}
        >
            <CardContent sx={{ flexGrow: 1, pb: 1 }}>
                {/* Header */}
                <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                    <Box>
                        <Typography variant="h6" sx={{ fontWeight: 600, mb: 0.5 }}>
                            {budget.categoryName || 'Uncategorized'}
                        </Typography>
                        <Chip
                            label={`${period} Budget`}
                            size="small"
                            variant="outlined"
                            sx={{ fontSize: '0.75rem' }}
                        />
                    </Box>
                    <Chip
                        label={getStatusLabel()}
                        color={progressColor}
                        size="small"
                        sx={{ fontWeight: 600 }}
                    />
                </Box>

                {/* Budget Amount */}
                <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Budget Amount
                    </Typography>
                    <Typography variant="h5" sx={{ fontWeight: 700 }}>
                        {formatCurrency(amount)}
                    </Typography>
                </Box>

                {/* Spent vs Remaining */}
                <Box mb={2}>
                    <Box display="flex" justifyContent="space-between" mb={1}>
                        <Box flex={1} mr={2}>
                            <Typography variant="caption" color="text.secondary" display="block">
                                Spent
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 600,
                                    color: `${progressColor}.main`,
                                }}
                            >
                                {formatCurrency(spent)}
                            </Typography>
                        </Box>
                        <Box flex={1}>
                            <Typography variant="caption" color="text.secondary" display="block">
                                Remaining
                            </Typography>
                            <Typography
                                variant="body1"
                                sx={{
                                    fontWeight: 600,
                                    color: remaining >= 0 ? 'success.main' : 'error.main',
                                }}
                            >
                                {formatCurrency(Math.abs(remaining))}
                                {remaining < 0 && ' over'}
                            </Typography>
                        </Box>
                    </Box>
                </Box>

                {/* Progress Bar */}
                <Box mb={1}>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={0.5}>
                        <Typography variant="caption" color="text.secondary">
                            Progress
                        </Typography>
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {percentage.toFixed(1)}%
                        </Typography>
                    </Box>
                    <LinearProgress
                        variant="determinate"
                        value={Math.min(percentage, 100)}
                        color={progressColor}
                        sx={{
                            height: 8,
                            borderRadius: 4,
                            backgroundColor: (theme) => theme.palette.action.hover,
                        }}
                    />
                </Box>

                {/* Period Info */}
                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mt: 2 }}>
                    {startDate && `Started: ${formatDate(startDate)}`}
                </Typography>

                {/* Trend Indicator */}
                {percentage >= 100 && (
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={0.5}
                        mt={1}
                        p={1}
                        borderRadius={1}
                        bgcolor="error.dark"
                        sx={{ opacity: 0.8 }}
                    >
                        <TrendingUpIcon fontSize="small" />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            Budget exceeded by {formatCurrency(Math.abs(remaining))}
                        </Typography>
                    </Box>
                )}
                {percentage >= 80 && percentage < 100 && (
                    <Box
                        display="flex"
                        alignItems="center"
                        gap={0.5}
                        mt={1}
                        p={1}
                        borderRadius={1}
                        bgcolor="warning.dark"
                        sx={{ opacity: 0.8 }}
                    >
                        <TrendingDownIcon fontSize="small" />
                        <Typography variant="caption" sx={{ fontWeight: 600 }}>
                            {formatCurrency(remaining)} until limit
                        </Typography>
                    </Box>
                )}
            </CardContent>

            <CardActions sx={{ justifyContent: 'flex-end', p: 2, pt: 0 }}>
                <Tooltip title="Edit Budget">
                    <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); onEdit(budget); }}
                        color="primary"
                    >
                        <EditIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
                <Tooltip title="Delete Budget">
                    <IconButton
                        size="small"
                        onClick={(e) => { e.stopPropagation(); onDelete(budget.id); }}
                        color="error"
                    >
                        <DeleteIcon fontSize="small" />
                    </IconButton>
                </Tooltip>
            </CardActions>
        </Card>
    );
};

export default BudgetCard;
