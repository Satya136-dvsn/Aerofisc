import { useState, useEffect } from 'react';
import { Grid, TextField, MenuItem, Typography, Box, Alert, Snackbar } from '@mui/material';
import ProfessionalCard from '../ui/ProfessionalCard';
import { useCurrency } from '../../context/CurrencyContext';
import { getCurrencyOptions } from '../../utils/currencyUtils';

const AppSettings = () => {
    const { currency, updateCurrency, loading } = useCurrency();
    const [settings, setSettings] = useState({
        language: 'en',
        dateFormat: 'DD/MM/YYYY',
        timezone: 'Asia/Kolkata',
    });
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleChange = (e) => {
        setSettings({
            ...settings,
            [e.target.name]: e.target.value,
        });
    };

    const handleCurrencyChange = async (e) => {
        const newCurrency = e.target.value;
        const success = await updateCurrency(newCurrency);
        if (success) {
            setSnackbar({ open: true, message: `Currency updated to ${newCurrency}`, severity: 'success' });
        } else {
            setSnackbar({ open: true, message: 'Failed to update currency', severity: 'error' });
        }
    };

    const currencyOptions = getCurrencyOptions();

    return (
        <ProfessionalCard title="Application Preferences" subheader="Customize your experience">
            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <TextField
                        select
                        fullWidth
                        label="Currency"
                        name="currency"
                        value={currency}
                        onChange={handleCurrencyChange}
                        disabled={loading}
                        helperText="Your preferred currency for all amounts"
                    >
                        {currencyOptions.map((opt) => (
                            <MenuItem key={opt.value} value={opt.value}>
                                {opt.label}
                            </MenuItem>
                        ))}
                    </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        select
                        fullWidth
                        label="Language"
                        name="language"
                        value={settings.language}
                        onChange={handleChange}
                    >
                        <MenuItem value="en">English</MenuItem>
                        <MenuItem value="es">Spanish</MenuItem>
                        <MenuItem value="fr">French</MenuItem>
                        <MenuItem value="hi">Hindi</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        select
                        fullWidth
                        label="Date Format"
                        name="dateFormat"
                        value={settings.dateFormat}
                        onChange={handleChange}
                    >
                        <MenuItem value="DD/MM/YYYY">DD/MM/YYYY</MenuItem>
                        <MenuItem value="MM/DD/YYYY">MM/DD/YYYY</MenuItem>
                        <MenuItem value="YYYY-MM-DD">YYYY-MM-DD</MenuItem>
                    </TextField>
                </Grid>
                <Grid item xs={12} md={6}>
                    <TextField
                        select
                        fullWidth
                        label="Timezone"
                        name="timezone"
                        value={settings.timezone}
                        onChange={handleChange}
                        helperText="Default: Indian Standard Time (IST)"
                    >
                        <MenuItem value="Asia/Kolkata">Asia/Kolkata (IST)</MenuItem>
                        <MenuItem value="America/New_York">America/New_York (EST)</MenuItem>
                        <MenuItem value="Europe/London">Europe/London (GMT)</MenuItem>
                        <MenuItem value="Asia/Tokyo">Asia/Tokyo (JST)</MenuItem>
                    </TextField>
                </Grid>
            </Grid>

            <Snackbar
                open={snackbar.open}
                autoHideDuration={3000}
                onClose={() => setSnackbar({ ...snackbar, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={snackbar.severity} variant="filled">
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </ProfessionalCard>
    );
};

export default AppSettings;
