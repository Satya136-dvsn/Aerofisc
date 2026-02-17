/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { useState } from 'react';
import {
    Box,
    Paper,
    Grid,
    TextField,
    MenuItem,
    Button,
    Chip,
    Slider,
    FormControl,
    InputLabel,
    Select,
    OutlinedInput,
    IconButton,
    Collapse,
    Typography,
} from '@mui/material';
import {
    FilterList as FilterIcon,
    Clear as ClearIcon,
    ExpandMore as ExpandMoreIcon,
    ExpandLess as ExpandLessIcon,
} from '@mui/icons-material';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';

const TransactionFilters = ({ categories, onFilterChange, activeFilters }) => {
    const [expanded, setExpanded] = useState(true);
    const [filters, setFilters] = useState({
        startDate: activeFilters?.startDate || null,
        endDate: activeFilters?.endDate || null,
        categories: activeFilters?.categories || [],
        type: activeFilters?.type || 'ALL',
        minAmount: activeFilters?.minAmount || 0,
        maxAmount: activeFilters?.maxAmount || 100000,
        searchText: activeFilters?.searchText || '',
    });

    const datePresets = [
        {
            label: 'This Month',
            getValue: () => {
                const now = new Date();
                return {
                    start: new Date(now.getFullYear(), now.getMonth(), 1),
                    end: new Date(now.getFullYear(), now.getMonth() + 1, 0),
                };
            },
        },
        {
            label: 'Last Month',
            getValue: () => {
                const now = new Date();
                return {
                    start: new Date(now.getFullYear(), now.getMonth() - 1, 1),
                    end: new Date(now.getFullYear(), now.getMonth(), 0),
                };
            },
        },
        {
            label: 'Last 3 Months',
            getValue: () => {
                const now = new Date();
                return {
                    start: new Date(now.getFullYear(), now.getMonth() - 3, 1),
                    end: now,
                };
            },
        },
    ];

    const handleFilterChange = (field, value) => {
        const newFilters = { ...filters, [field]: value };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handlePresetClick = (preset) => {
        const { start, end } = preset.getValue();
        const newFilters = { ...filters, startDate: start, endDate: end };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const handleClearFilters = () => {
        const clearedFilters = {
            startDate: null,
            endDate: null,
            categories: [],
            type: 'ALL',
            minAmount: 0,
            maxAmount: 100000,
            searchText: '',
        };
        setFilters(clearedFilters);
        onFilterChange(clearedFilters);
    };

    const getActiveFilterCount = () => {
        let count = 0;
        if (filters.startDate || filters.endDate) count++;
        if (filters.categories.length > 0) count++;
        if (filters.type !== 'ALL') count++;
        if (filters.minAmount > 0 || filters.maxAmount < 100000) count++;
        if (filters.searchText) count++;
        return count;
    };

    const activeFilterCount = getActiveFilterCount();

    return (
        <Paper sx={{ p: 2, mb: 3 }}>
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                <Box display="flex" alignItems="center" gap={1}>
                    <FilterIcon />
                    <Typography variant="h6">Filters</Typography>
                    {activeFilterCount > 0 && (
                        <Chip label={`${activeFilterCount} active`} size="small" color="primary" />
                    )}
                </Box>
                <Box>
                    {activeFilterCount > 0 && (
                        <Button
                            size="small"
                            startIcon={<ClearIcon />}
                            onClick={handleClearFilters}
                            sx={{ mr: 1 }}
                        >
                            Clear All
                        </Button>
                    )}
                    <IconButton size="small" onClick={() => setExpanded(!expanded)}>
                        {expanded ? <ExpandLessIcon /> : <ExpandMoreIcon />}
                    </IconButton>
                </Box>
            </Box>

            <Collapse in={expanded}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                    <Grid container spacing={2}>
                        {/* Search */}
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                size="small"
                                label="Search Description"
                                value={filters.searchText}
                                onChange={(e) => handleFilterChange('searchText', e.target.value)}
                                placeholder="Search by description..."
                            />
                        </Grid>

                        {/* Date Range Presets */}
                        <Grid item xs={12}>
                            <Box display="flex" gap={1} flexWrap="wrap">
                                {datePresets.map((preset) => (
                                    <Chip
                                        key={preset.label}
                                        label={preset.label}
                                        onClick={() => handlePresetClick(preset)}
                                        variant="outlined"
                                        size="small"
                                    />
                                ))}
                            </Box>
                        </Grid>

                        {/* Date Range */}
                        <Grid item xs={12} sm={6}>
                            <DatePicker
                                label="Start Date"
                                value={filters.startDate}
                                onChange={(date) => handleFilterChange('startDate', date)}
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                        fullWidth: true,
                                    },
                                }}
                            />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                            <DatePicker
                                label="End Date"
                                value={filters.endDate}
                                onChange={(date) => handleFilterChange('endDate', date)}
                                slotProps={{
                                    textField: {
                                        size: 'small',
                                        fullWidth: true,
                                    },
                                }}
                            />
                        </Grid>

                        {/* Category Filter */}
                        <Grid item xs={12} sm={6}>
                            <FormControl fullWidth size="small">
                                <InputLabel>Categories</InputLabel>
                                <Select
                                    multiple
                                    value={filters.categories}
                                    onChange={(e) => handleFilterChange('categories', e.target.value)}
                                    input={<OutlinedInput label="Categories" />}
                                    renderValue={(selected) => (
                                        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                                            {selected.map((value) => {
                                                const category = categories.find((c) => c.id === value);
                                                return <Chip key={value} label={category?.name || value} size="small" />;
                                            })}
                                        </Box>
                                    )}
                                >
                                    {categories.map((category) => (
                                        <MenuItem key={category.id} value={category.id}>
                                            {category.name}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </FormControl>
                        </Grid>

                        {/* Type Filter */}
                        <Grid item xs={12} sm={6}>
                            <TextField
                                fullWidth
                                select
                                size="small"
                                label="Type"
                                value={filters.type}
                                onChange={(e) => handleFilterChange('type', e.target.value)}
                            >
                                <MenuItem value="ALL">All</MenuItem>
                                <MenuItem value="INCOME">Income</MenuItem>
                                <MenuItem value="EXPENSE">Expense</MenuItem>
                            </TextField>
                        </Grid>

                        {/* Amount Range */}
                        <Grid item xs={12}>
                            <Typography gutterBottom variant="body2" color="text.secondary">
                                Amount Range: ₹{filters.minAmount.toLocaleString()} - ₹
                                {filters.maxAmount.toLocaleString()}
                            </Typography>
                            <Slider
                                value={[filters.minAmount, filters.maxAmount]}
                                onChange={(e, newValue) => {
                                    handleFilterChange('minAmount', newValue[0]);
                                    handleFilterChange('maxAmount', newValue[1]);
                                }}
                                valueLabelDisplay="auto"
                                min={0}
                                max={100000}
                                step={100}
                                marks={[
                                    { value: 0, label: '₹0' },
                                    { value: 50000, label: '₹50k' },
                                    { value: 100000, label: '₹100k' },
                                ]}
                            />
                        </Grid>
                    </Grid>
                </LocalizationProvider>
            </Collapse>
        </Paper>
    );
};

export default TransactionFilters;
