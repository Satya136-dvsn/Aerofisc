/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  MenuItem,
  Grid,
  Alert,
} from '@mui/material';
import budgetService from '../services/budgetService';
import categoryService from '../services/categoryService';

const BudgetDialog = ({ open, budget, onClose }) => {
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    period: 'MONTHLY',
    startDate: '',
    endDate: '',
    alertThreshold: '80',
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      loadCategories();
      if (budget) {
        setFormData({
          categoryId: budget.categoryId || '',
          amount: budget.amount ?? '',
          period: budget.period,
          startDate: budget.startDate ?? '',
          endDate: budget.endDate ?? '',
          alertThreshold: budget.alertThreshold ?? '80',
        });
      } else {
        setFormData({
          categoryId: '',
          amount: '',
          period: 'MONTHLY',
          startDate: '',
          endDate: '',
          alertThreshold: '80',
        });
      }
      setError('');
    }
  }, [open, budget]);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll();
      const expenseCategories = response.data.filter(c => c.type === 'EXPENSE');
      console.log('BudgetDialog - All categories:', response.data);
      console.log('BudgetDialog - Expense categories:', expenseCategories);
      setCategories(expenseCategories);
    } catch (err) {
      console.error('Failed to load categories:', err);
      if (err.response?.status === 403 || err.response?.status === 401) {
        setError('Session expired. Please login again.');
      } else {
        setError('Failed to load categories');
      }
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        categoryId: formData.categoryId || null,
        amount: formData.amount ? parseFloat(formData.amount) : null,
        period: formData.period,
        startDate: formData.startDate,
        endDate: formData.endDate,
        alertThreshold: formData.alertThreshold
          ? parseFloat(formData.alertThreshold)
          : null,
      };

      if (budget) {
        await budgetService.update(budget.id, data);
      } else {
        await budgetService.create(data);
      }
      onClose(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save budget');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{budget ? 'Edit Budget' : 'Add Budget'}</DialogTitle>
      <form onSubmit={handleSubmit}>
        <DialogContent>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              {error}
            </Alert>
          )}
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <TextField
                fullWidth
                select
                label="Category"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                InputLabelProps={{ shrink: true }}
                SelectProps={{
                  displayEmpty: true,
                  renderValue: (selected) => {
                    if (!selected) {
                      return 'All Categories';
                    }
                    const cat = categories.find(
                      (c) => String(c.id) === String(selected)
                    );
                    return cat ? `${cat.icon} ${cat.name}` : 'All Categories';
                  },
                }}
              >
                <MenuItem value="">All Categories</MenuItem>
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Limit Amount"
                name="amount"
                type="number"
                value={formData.amount}
                onChange={handleChange}
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Period"
                name="period"
                value={formData.period}
                onChange={handleChange}
                required
              >
                <MenuItem value="DAILY">Daily</MenuItem>
                <MenuItem value="WEEKLY">Weekly</MenuItem>
                <MenuItem value="MONTHLY">Monthly</MenuItem>
                <MenuItem value="YEARLY">Yearly</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Start Date"
                name="startDate"
                type="date"
                value={formData.startDate}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="End Date"
                name="endDate"
                type="date"
                value={formData.endDate}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Alert Threshold (%)"
                name="alertThreshold"
                type="number"
                value={formData.alertThreshold}
                onChange={handleChange}
                inputProps={{ min: 0, max: 100, step: 1 }}
              />
            </Grid>
          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => onClose(false)}>Cancel</Button>
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default BudgetDialog;
