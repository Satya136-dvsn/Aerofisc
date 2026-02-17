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
  Grid,
  Alert,
} from '@mui/material';
import savingsGoalService from '../services/savingsGoalService';

const SavingsGoalDialog = ({ open, goal, onClose }) => {
  const [formData, setFormData] = useState({
    name: '',
    targetAmount: '',
    deadline: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (open) {
      if (goal) {
        setFormData({
          name: goal.name,
          targetAmount: goal.targetAmount,
          deadline: goal.deadline ? goal.deadline.split('T')[0] : '',
        });
      } else {
        setFormData({
          name: '',
          targetAmount: '',
          deadline: '',
        });
      }
      setError('');
    }
  }, [open, goal]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        name: formData.name,
        targetAmount: parseFloat(formData.targetAmount),
        deadline: formData.deadline || null,
      };

      if (goal) {
        await savingsGoalService.update(goal.id, data);
      } else {
        await savingsGoalService.create(data);
      }
      onClose(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save goal');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{goal ? 'Edit Savings Goal' : 'Add Savings Goal'}</DialogTitle>
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
                label="Goal Name"
                name="name"
                value={formData.name}
                onChange={handleChange}
                required
                placeholder="e.g., Emergency Fund, Vacation"
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Target Amount"
                name="targetAmount"
                type="number"
                value={formData.targetAmount}
                onChange={handleChange}
                required
                inputProps={{ min: 0, step: 0.01 }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Target Date"
                name="deadline"
                type="date"
                value={formData.deadline}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
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

export default SavingsGoalDialog;
