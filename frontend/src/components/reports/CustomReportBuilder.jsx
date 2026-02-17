/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { useState } from 'react';
import { Grid, Box, TextField, MenuItem, Button, Typography, Checkbox, FormControlLabel, FormGroup, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import reportService from '../../services/reportService';
import { Save, Preview } from '@mui/icons-material';
import ProfessionalCard from '../ui/ProfessionalCard';

const CustomReportBuilder = () => {
    const [reportName, setReportName] = useState('');
    const [dateRange, setDateRange] = useState('last_month');
    const [metrics, setMetrics] = useState({
        income: true,
        expenses: true,
        savings: false,
        budgets: false,
        goals: false,
    });
    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });
    const [previewOpen, setPreviewOpen] = useState(false);
    const [previewContent, setPreviewContent] = useState('');

    const handleMetricChange = (event) => {
        setMetrics({
            ...metrics,
            [event.target.name]: event.target.checked,
        });
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleGenerate = async (preview = false) => {
        if (!reportName) {
            setSnackbar({ open: true, message: 'Please enter a report name', severity: 'warning' });
            return;
        }

        try {
            setLoading(true);
            const config = {
                name: reportName,
                dateRange,
                metrics,
                preview
            };

            const response = await reportService.generateCustomReport(config);

            if (preview) {
                // Show preview in dialog
                const text = await response.data.text();
                setPreviewContent(text);
                setPreviewOpen(true);
                setSnackbar({ open: true, message: 'Preview generated', severity: 'info' });
            } else {
                const url = window.URL.createObjectURL(response.data);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `${reportName.replace(/\s+/g, '_')}.txt`);
                document.body.appendChild(link);
                link.click();
                link.remove();
                window.URL.revokeObjectURL(url);
                setSnackbar({ open: true, message: 'Custom report generated', severity: 'success' });
            }

        } catch (error) {
            console.error('Custom report generation failed:', error);
            setSnackbar({ open: true, message: 'Failed to generate report', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12} md={8}>
                    <ProfessionalCard title="Report Configuration">
                        <Grid container spacing={3}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Report Name"
                                    value={reportName}
                                    onChange={(e) => setReportName(e.target.value)}
                                    placeholder="e.g., Q1 Financial Review"
                                />
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <TextField
                                    select
                                    fullWidth
                                    label="Date Range"
                                    value={dateRange}
                                    onChange={(e) => setDateRange(e.target.value)}
                                >
                                    <MenuItem value="this_month">This Month</MenuItem>
                                    <MenuItem value="last_month">Last Month</MenuItem>
                                    <MenuItem value="last_quarter">Last Quarter</MenuItem>
                                    <MenuItem value="last_year">Last Year</MenuItem>
                                    <MenuItem value="custom">Custom Range</MenuItem>
                                </TextField>
                            </Grid>
                            <Grid item xs={12}>
                                <Typography variant="subtitle2" gutterBottom>
                                    Include Metrics
                                </Typography>
                                <FormGroup row>
                                    <FormControlLabel
                                        control={<Checkbox checked={metrics.income} onChange={handleMetricChange} name="income" />}
                                        label="Income"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={metrics.expenses} onChange={handleMetricChange} name="expenses" />}
                                        label="Expenses"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={metrics.savings} onChange={handleMetricChange} name="savings" />}
                                        label="Savings Rate"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={metrics.budgets} onChange={handleMetricChange} name="budgets" />}
                                        label="Budget Performance"
                                    />
                                    <FormControlLabel
                                        control={<Checkbox checked={metrics.goals} onChange={handleMetricChange} name="goals" />}
                                        label="Goal Progress"
                                    />
                                </FormGroup>
                            </Grid>
                        </Grid>
                    </ProfessionalCard>
                </Grid>

                <Grid item xs={12} md={4}>
                    <ProfessionalCard title="Actions">
                        <Box display="flex" flexDirection="column" gap={2}>
                            <Button
                                variant="outlined"
                                startIcon={<Preview />}
                                fullWidth
                                onClick={() => handleGenerate(true)}
                                disabled={loading}
                            >
                                Preview Report
                            </Button>
                            <Button
                                variant="contained"
                                startIcon={<Save />}
                                fullWidth
                                onClick={() => handleGenerate(false)}
                                disabled={loading}
                            >
                                {loading ? 'Generating...' : 'Generate & Download'}
                            </Button>
                        </Box>
                    </ProfessionalCard>
                </Grid>
            </Grid>

            {/* Preview Dialog */}
            <Dialog open={previewOpen} onClose={() => setPreviewOpen(false)} maxWidth="md" fullWidth>
                <DialogTitle>Report Preview: {reportName}</DialogTitle>
                <DialogContent>
                    <Box sx={{ whiteSpace: 'pre-wrap', fontFamily: 'monospace', fontSize: '0.875rem', p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
                        {previewContent}
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setPreviewOpen(false)}>Close</Button>
                    <Button variant="contained" onClick={() => handleGenerate(false)}>
                        Download
                    </Button>
                </DialogActions>
            </Dialog>

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default CustomReportBuilder;
