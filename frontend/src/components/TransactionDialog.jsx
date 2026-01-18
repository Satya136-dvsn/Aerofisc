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
  CircularProgress,
  Box,
  Typography,
  IconButton,
} from '@mui/material';
import {
  AutoAwesome as AutoAwesomeIcon,
  CloudUpload as CloudUploadIcon,
  Close as CloseIcon,
  InsertDriveFile as FileIcon
} from '@mui/icons-material';
import transactionService from '../services/transactionService';
import categoryService from '../services/categoryService';
import aiService from '../services/aiService';

const TransactionDialog = ({ open, transaction, onClose }) => {
  const [formData, setFormData] = useState({
    description: '',
    amount: '',
    type: 'EXPENSE',
    categoryId: '',
    date: new Date().toISOString().split('T')[0],
  });
  const [categories, setCategories] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [suggestingCategory, setSuggestingCategory] = useState(false);
  const [suggestion, setSuggestion] = useState(null);
  const [receiptFile, setReceiptFile] = useState(null);
  const [receiptPreview, setReceiptPreview] = useState(null);

  useEffect(() => {
    if (open) {
      // Check if user is logged in before loading categories
      const token = localStorage.getItem('token');
      if (!token) {
        setError('Session expired. Redirecting to login...');
        setTimeout(() => {
          window.location.href = '/login';
        }, 1500);
        return;
      }

      loadCategories();
      if (transaction) {
        setFormData({
          description: transaction.description,
          amount: Math.abs(transaction.amount),
          type: transaction.type,
          categoryId: transaction.categoryId || '',
          date: transaction.transactionDate || new Date().toISOString().split('T')[0],
        });
      } else {
        setFormData({
          description: '',
          amount: '',
          type: 'EXPENSE',
          categoryId: '',
          date: new Date().toISOString().split('T')[0],
        });
        setReceiptFile(null);
        setReceiptPreview(null);
      }
      setError('');
    }
  }, [open, transaction]);

  const loadCategories = async () => {
    try {
      const response = await categoryService.getAll();
      // Service already returns response.data
      setCategories(Array.isArray(response) ? response : []);
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
    // Clear suggestion when user changes anything
    if (suggestion) setSuggestion(null);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setError('File size should be less than 5MB');
        return;
      }
      setReceiptFile(file);
      if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onloadend = () => {
          setReceiptPreview(reader.result);
        };
        reader.readAsDataURL(file);
      } else {
        setReceiptPreview(null);
      }
    }
  };

  const handleRemoveReceipt = () => {
    setReceiptFile(null);
    setReceiptPreview(null);
  };

  const handleSuggestCategory = async () => {
    if (!formData.description || !formData.amount) {
      setError('Please enter description and amount first');
      return;
    }

    setSuggestingCategory(true);
    setError('');
    console.log('Calling AI service with:', { description: formData.description, amount: formData.amount });

    try {
      const response = await aiService.categorizeTransaction(
        formData.description,
        parseFloat(formData.amount)
      );

      console.log('AI service response:', response);

      if (response.data && response.data.categoryId) {
        setSuggestion({
          categoryId: response.data.categoryId,
          categoryName: response.data.categoryName || 'Suggested Category',
          confidence: response.data.confidence
        });
        console.log('Suggestion set:', response.data);
      } else {
        console.warn('AI response missing categoryId:', response.data);
        setError('AI returned invalid response. Please select manually.');
      }
    } catch (err) {
      console.error('AI categorization error:', err);
      console.error('Error details:', err.response?.data);
      setError(`AI suggestion failed: ${err.response?.data?.message || err.message || 'Unknown error'}`);
    } finally {
      setSuggestingCategory(false);
    }
  };

  const applySuggestion = () => {
    if (suggestion) {
      setFormData({ ...formData, categoryId: suggestion.categoryId });
      setSuggestion(null);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const data = {
        description: formData.description,
        amount: parseFloat(formData.amount),
        type: formData.type,
        categoryId: formData.categoryId || null,
        transactionDate: formData.date,
      };

      // Note: Backend receipt storage is not yet implemented.
      // We are just handling the UI part for Phase 3.
      if (receiptFile) {
        console.log('Receipt file selected:', receiptFile.name);
        // In a real implementation, we would upload this file here
        // const formData = new FormData();
        // formData.append('file', receiptFile);
        // await transactionService.uploadReceipt(formData);
      }

      if (transaction) {
        await transactionService.update(transaction.id, data);
      } else {
        await transactionService.create(data);
      }
      onClose(true);
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to save transaction');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={() => onClose(false)} maxWidth="sm" fullWidth>
      <DialogTitle>{transaction ? 'Edit Transaction' : 'Add Transaction'}</DialogTitle>
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
                label="Description"
                name="description"
                value={formData.description}
                onChange={handleChange}
                required
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                label="Amount"
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
                label="Date"
                name="date"
                type="date"
                value={formData.date}
                onChange={handleChange}
                required
                InputLabelProps={{ shrink: true }}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Type"
                name="type"
                value={formData.type}
                onChange={handleChange}
                required
              >
                <MenuItem value="INCOME">Income</MenuItem>
                <MenuItem value="EXPENSE">Expense</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                label="Category"
                name="categoryId"
                value={formData.categoryId}
                onChange={handleChange}
                helperText={suggestion ? `AI suggests: ${suggestion.categoryName}` : ''}
              >
                <MenuItem value="">None</MenuItem>
                {categories?.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>
                    {cat.icon} {cat.name}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>

            {/* Receipt Upload UI */}
            <Grid item xs={12}>
              <Box
                sx={{
                  border: '1px dashed #ccc',
                  borderRadius: 1,
                  p: 2,
                  textAlign: 'center',
                  bgcolor: 'background.default'
                }}
              >
                {!receiptFile ? (
                  <>
                    <input
                      accept="image/*,.pdf"
                      style={{ display: 'none' }}
                      id="receipt-file-upload"
                      type="file"
                      onChange={handleFileChange}
                    />
                    <label htmlFor="receipt-file-upload">
                      <Button
                        variant="outlined"
                        component="span"
                        startIcon={<CloudUploadIcon />}
                        sx={{ mb: 1 }}
                      >
                        Upload Receipt
                      </Button>
                    </label>
                    <Typography variant="caption" display="block" color="text.secondary">
                      Supports JPG, PNG, PDF (Max 5MB)
                    </Typography>
                  </>
                ) : (
                  <Box display="flex" alignItems="center" justifyContent="space-between">
                    <Box display="flex" alignItems="center" gap={1}>
                      {receiptPreview ? (
                        <Box
                          component="img"
                          src={receiptPreview}
                          alt="Receipt preview"
                          sx={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 1 }}
                        />
                      ) : (
                        <FileIcon color="action" />
                      )}
                      <Typography variant="body2" noWrap sx={{ maxWidth: 200 }}>
                        {receiptFile.name}
                      </Typography>
                    </Box>
                    <IconButton size="small" onClick={handleRemoveReceipt} aria-label="Remove receipt">
                      <CloseIcon />
                    </IconButton>
                  </Box>
                )}
              </Box>
            </Grid>

            <Grid item xs={12}>
              <Button
                variant="outlined"
                onClick={handleSuggestCategory}
                disabled={suggestingCategory || !formData.description || !formData.amount}
                startIcon={suggestingCategory ? <CircularProgress size={20} /> : <AutoAwesomeIcon />}
                fullWidth
              >
                {suggestingCategory ? 'Getting AI Suggestion...' : 'Suggest Category with AI'}
              </Button>
              {suggestion && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={applySuggestion}
                  fullWidth
                  sx={{ mt: 1 }}
                >
                  Apply Suggestion: {suggestion.categoryName}
                </Button>
              )}
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

export default TransactionDialog;
