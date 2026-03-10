import React, { useState } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Alert,
    CircularProgress
} from '@mui/material';
import { Link } from 'react-router-dom';
import api from '../services/api';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');
    const [demoToken, setDemoToken] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');
        setDemoToken('');

        try {
            const response = await api.post('/auth/forgot-password', { email });
            setSuccess(response.data.message || 'If an account exists, a reset link has been sent.');

            // For demo purposes (since we have no real email server)
            if (response.data.demoToken) {
                setDemoToken(response.data.demoToken);
            }
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to send reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Box sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            bgcolor: 'background.default',
            p: 3
        }}>
            <Paper elevation={3} sx={{ p: 4, width: '100%', maxWidth: 450, borderRadius: 2 }}>

                <Box sx={{ mb: 4, textAlign: 'center' }}>
                    <Typography variant="h4" component="h1" fontWeight="bold" gutterBottom>
                        Reset Password
                    </Typography>
                    <Typography variant="body1" color="text.secondary">
                        Enter your email to receive a password reset link.
                    </Typography>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 3 }}>{success}</Alert>}

                {demoToken && (
                    <Alert severity="info" sx={{ mb: 3, wordBreak: 'break-all' }}>
                        <Typography variant="body2" fontWeight="bold">DEMO MODE TOKEN:</Typography>
                        <Typography variant="body2">{demoToken}</Typography>
                        <Box mt={1}>
                            <Button
                                variant="outlined"
                                size="small"
                                component={Link}
                                to={`/reset-password?token=${demoToken}`}
                            >
                                Simulate Clicking Email Link
                            </Button>
                        </Box>
                    </Alert>
                )}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email Address"
                        name="email"
                        autoComplete="email"
                        autoFocus
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        disabled={loading}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={loading || !email}
                        sx={{ mt: 3, mb: 2, padding: 1.5 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Send Reset Link'}
                    </Button>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Typography variant="body2">
                            Remembered your password?{' '}
                            <Link to="/login" style={{ textDecoration: 'none', color: '#B3C8CF', fontWeight: 'bold' }}>
                                Sign in
                            </Link>
                        </Typography>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default ForgotPassword;
