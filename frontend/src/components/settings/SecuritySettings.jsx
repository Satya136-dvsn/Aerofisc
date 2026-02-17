/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { useState, useEffect } from 'react';
import { Grid, TextField, Button, Typography, Switch, Divider, Box, Snackbar, Alert, Dialog, DialogTitle, DialogContent, DialogActions } from '@mui/material';
import userService from '../../services/userService';
import authService from '../../services/authService';
import { Save, Key, PhonelinkLock } from '@mui/icons-material';
import ProfessionalCard from '../ui/ProfessionalCard';
import { useAuth } from '../../context/AuthContext';
import AuditLogViewer from './AuditLogViewer';
import SessionManagement from './SessionManagement';

const SecuritySettings = () => {
    const { user } = useAuth();
    const [passwords, setPasswords] = useState({
        current: '',
        new: '',
        confirm: '',
    });
    const [twoFactor, setTwoFactor] = useState(false);
    const [mfaSetup, setMfaSetup] = useState({
        open: false,
        secret: '',
        qrCodeUrl: '',
        code: ''
    });

    useEffect(() => {
        if (user?.isMfaEnabled) {
            setTwoFactor(true);
        }
    }, [user]);

    const handleChange = (e) => {
        setPasswords({
            ...passwords,
            [e.target.name]: e.target.value,
        });
    };

    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleUpdatePassword = async () => {
        if (passwords.new !== passwords.confirm) {
            setSnackbar({ open: true, message: 'New passwords do not match', severity: 'error' });
            return;
        }

        try {
            setLoading(true);
            await userService.changePassword({
                currentPassword: passwords.current,
                newPassword: passwords.new
            });
            setSnackbar({ open: true, message: 'Password updated successfully', severity: 'success' });
            setPasswords({ current: '', new: '', confirm: '' });
        } catch (error) {
            console.error('Failed to update password:', error);
            setSnackbar({ open: true, message: 'Failed to update password', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleToggleMfa = async (e) => {
        const checked = e.target.checked;
        if (checked) {
            // Enable MFA
            try {
                const data = await authService.setupMfa();
                setMfaSetup({
                    open: true,
                    secret: data.secret,
                    qrCodeUrl: data.qrCodeUrl,
                    code: ''
                });
            } catch (error) {
                setSnackbar({ open: true, message: 'Failed to start MFA setup', severity: 'error' });
            }
        } else {
            // Disable MFA
            try {
                await authService.disableMfa();
                setTwoFactor(false);
                setSnackbar({ open: true, message: 'MFA disabled successfully', severity: 'success' });
            } catch (error) {
                setSnackbar({ open: true, message: 'Failed to disable MFA', severity: 'error' });
            }
        }
    };

    const handleVerifyMfa = async () => {
        try {
            await authService.enableMfa(mfaSetup.secret, mfaSetup.code);
            setTwoFactor(true);
            setMfaSetup({ ...mfaSetup, open: false });
            setSnackbar({ open: true, message: 'MFA enabled successfully', severity: 'success' });
        } catch (error) {
            setSnackbar({ open: true, message: 'Invalid code', severity: 'error' });
        }
    };

    return (
        <>
            <Grid container spacing={3}>
                <Grid item xs={12}>
                    <ProfessionalCard title="Change Password" icon={<Key />}>
                        <Grid container spacing={2}>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    type="password"
                                    label="Current Password"
                                    name="current"
                                    value={passwords.current}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="password"
                                    label="New Password"
                                    name="new"
                                    value={passwords.new}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    type="password"
                                    label="Confirm New Password"
                                    name="confirm"
                                    value={passwords.confirm}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} display="flex" justifyContent="flex-end">
                                <Button
                                    variant="contained"
                                    startIcon={<Save />}
                                    onClick={handleUpdatePassword}
                                    disabled={loading}
                                >
                                    {loading ? 'Updating...' : 'Update Password'}
                                </Button>
                            </Grid>
                        </Grid>
                    </ProfessionalCard>
                </Grid>

                <Grid item xs={12}>
                    <ProfessionalCard title="Two-Factor Authentication" icon={<PhonelinkLock />}>
                        <Box display="flex" justifyContent="space-between" alignItems="center">
                            <Box>
                                <Typography variant="subtitle1" fontWeight="bold">
                                    Enable 2FA
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    Add an extra layer of security to your account by requiring a code from your phone.
                                </Typography>
                            </Box>
                            <Switch
                                checked={twoFactor}
                                onChange={handleToggleMfa}
                                color="primary"
                            />
                        </Box>
                    </ProfessionalCard>
                </Grid>

                <Grid item xs={12}>
                    <SessionManagement />
                </Grid>

                <Grid item xs={12}>
                    <AuditLogViewer />
                </Grid>
            </Grid>

            <Dialog open={mfaSetup.open} onClose={() => setMfaSetup({ ...mfaSetup, open: false })}>
                <DialogTitle>Setup Multi-Factor Authentication</DialogTitle>
                <DialogContent>
                    <Box display="flex" flexDirection="column" alignItems="center" gap={2} py={2}>
                        <Typography variant="body1">
                            Scan this QR code with your authenticator app (e.g., Google Authenticator).
                        </Typography>
                        {mfaSetup.qrCodeUrl && (
                            <img src={mfaSetup.qrCodeUrl} alt="MFA QR Code" style={{ width: 200, height: 200 }} />
                        )}
                        <Typography variant="caption" color="text.secondary">
                            Secret: {mfaSetup.secret}
                        </Typography>
                        <TextField
                            fullWidth
                            label="Verification Code"
                            value={mfaSetup.code}
                            onChange={(e) => setMfaSetup({ ...mfaSetup, code: e.target.value })}
                            placeholder="Enter 6-digit code"
                        />
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setMfaSetup({ ...mfaSetup, open: false })}>Cancel</Button>
                    <Button onClick={handleVerifyMfa} variant="contained" disabled={!mfaSetup.code}>
                        Verify & Enable
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

export default SecuritySettings;
