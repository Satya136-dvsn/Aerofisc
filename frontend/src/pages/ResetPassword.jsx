import React, { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    TextField,
    Button,
    Paper,
    Alert,
    CircularProgress
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import api from '../services/api';

// Helper to get query params
const useQuery = () => {
    return new URLSearchParams(useLocation().search);
};

const ResetPassword = () => {
    const query = useQuery();
    const token = query.get('token');
    const navigate = useNavigate();

    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (!token) {
            setError('Missing reset token. Please request a new password reset link.');
        }
    }, [token]);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess('');

        if (newPassword !== confirmPassword) {
            setError('Passwords do not match');
            setLoading(false);
            return;
        }

        try {
            const response = await api.post('/auth/reset-password', {
                token,
                newPassword
            });
            setSuccess(response.data.message || 'Password reset successfully.');
            setTimeout(() => {
                navigate('/login');
            }, 3000);
        } catch (err) {
            setError(err.response?.data?.message || err.message || 'Failed to reset password');
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
                        Create New Password
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Your new password must be at least 8 characters long.
                    </Typography>
                </Box>

                {error && <Alert severity="error" sx={{ mb: 3 }}>{error}</Alert>}
                {success && <Alert severity="success" sx={{ mb: 3 }}>{success} Redirecting to login...</Alert>}

                <Box component="form" onSubmit={handleSubmit} noValidate>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="newPassword"
                        label="New Password"
                        type="password"
                        id="newPassword"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                        disabled={loading || !token || !!success}
                    />

                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        name="confirmPassword"
                        label="Confirm New Password"
                        type="password"
                        id="confirmPassword"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        disabled={loading || !token || !!success}
                    />

                    <Button
                        type="submit"
                        fullWidth
                        variant="contained"
                        color="primary"
                        size="large"
                        disabled={loading || !token || !newPassword || !confirmPassword || !!success}
                        sx={{ mt: 3, mb: 2, padding: 1.5 }}
                    >
                        {loading ? <CircularProgress size={24} /> : 'Reset Password'}
                    </Button>

                    <Box sx={{ textAlign: 'center', mt: 2 }}>
                        <Link to="/login" style={{ textDecoration: 'none', color: '#B3C8CF', fontWeight: 'bold' }}>
                            Back to Sign in
                        </Link>
                    </Box>
                </Box>
            </Paper>
        </Box>
    );
};

export default ResetPassword;
