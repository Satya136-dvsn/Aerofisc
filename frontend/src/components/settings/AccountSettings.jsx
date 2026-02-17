/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { useState, useEffect } from 'react';
import {
    Box,
    Typography,
    Button,
    Divider,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    TextField,
    Alert,
    CircularProgress
} from '@mui/material';
import { Download, DeleteForever, Warning, CloudUpload, AddLink, CheckCircle } from '@mui/icons-material';
import ProfessionalCard from '../ui/ProfessionalCard';
import userService from '../../services/userService';
import { useAuth } from '../../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const AccountSettings = () => {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [exportLoading, setExportLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [password, setPassword] = useState('');
    const [deleteLoading, setDeleteLoading] = useState(false);
    const [error, setError] = useState('');
    const [isDriveConnected, setIsDriveConnected] = useState(false);
    const [driveLoading, setDriveLoading] = useState(false);
    const [backupLoading, setBackupLoading] = useState(false);

    useEffect(() => {
        checkDriveStatus();
    }, []);

    const checkDriveStatus = async () => {
        try {
            setDriveLoading(true);
            const response = await userService.checkGoogleDriveStatus();
            setIsDriveConnected(response.data.isConnected);
        } catch (error) {
            console.error("Failed to check Drive status", error);
        } finally {
            setDriveLoading(false);
        }
    };

    const handleConnectDrive = async () => {
        try {
            const response = await userService.getGoogleDriveAuthUrl();
            window.location.href = response.data.url;
        } catch (error) {
            console.error("Failed to get auth URL", error);
            alert("Failed to initiate Google Drive connection.");
        }
    };

    const handleBackupToDrive = async () => {
        try {
            setBackupLoading(true);
            const response = await userService.backupToGoogleDrive();
            alert(response.data.message || "Backup uploaded successfully!");
        } catch (error) {
            console.error("Backup failed", error);
            alert("Backup failed: " + (error.response?.data?.error || error.message));
        } finally {
            setBackupLoading(false);
        }
    };

    const handleExportData = async () => {
        try {
            setExportLoading(true);
            const response = await userService.exportData();

            // Create download link
            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'aerofisc_data_export.json');
            document.body.appendChild(link);
            link.click();
            link.remove();
        } catch (err) {
            console.error('Export failed:', err);
            // Could add toast notification here
        } finally {
            setExportLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!password) {
            setError('Please enter your password to confirm.');
            return;
        }

        try {
            setDeleteLoading(true);
            setError('');
            await userService.deleteAccount(password);

            // Close dialog and logout
            setDeleteDialogOpen(false);
            logout();
            navigate('/login');
        } catch (err) {
            console.error('Delete account failed:', err);
            setError(err.response?.data?.error || 'Failed to delete account. Please check your password.');
        } finally {
            setDeleteLoading(false);
        }
    };

    return (
        <Box>
            <ProfessionalCard
                title="Data Management"
                subheader="Control your personal data and export options"
            >
                <Box sx={{ mb: 4 }}>
                    <Typography variant="h6" gutterBottom>
                        Export Your Data
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                        Download a copy of all your personal data, including transactions, budgets, and goals, in JSON format.
                        This file can be used to migrate your data to another service or for your own records.
                    </Typography>
                    <Button
                        variant="outlined"
                        startIcon={exportLoading ? <CircularProgress size={20} /> : <Download />}
                        onClick={handleExportData}
                        disabled={exportLoading}
                        sx={{ mr: 2 }}
                    >
                        {exportLoading ? 'Exporting...' : 'Download All Data (JSON)'}
                    </Button>
                    <Button
                        variant="contained"
                        color={isDriveConnected ? "success" : "primary"}
                        startIcon={backupLoading || driveLoading ? <CircularProgress size={20} color="inherit" /> : (isDriveConnected ? <CloudUpload /> : <AddLink />)}
                        onClick={isDriveConnected ? handleBackupToDrive : handleConnectDrive}
                        disabled={backupLoading || driveLoading}
                    >
                        {driveLoading ? 'Checking...' : (isDriveConnected ? (backupLoading ? 'Backing up...' : 'Backup to Google Drive') : 'Connect Google Drive')}
                    </Button>
                </Box>
            </ProfessionalCard>

            <Box sx={{ mt: 3 }}>
                <ProfessionalCard
                    title="Danger Zone"
                    subheader="Irreversible account actions"
                    sx={{ borderColor: 'error.main', borderWidth: 1, borderStyle: 'solid' }}
                >
                    <Box>
                        <Typography variant="h6" color="error" gutterBottom>
                            Delete Account
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            Permanently delete your account and all associated data. This action cannot be undone.
                        </Typography>
                        <Button
                            variant="contained"
                            color="error"
                            startIcon={<DeleteForever />}
                            onClick={() => setDeleteDialogOpen(true)}
                        >
                            Delete Account
                        </Button>
                    </Box>
                </ProfessionalCard>
            </Box>

            {/* Delete Account Confirmation Dialog */}
            <Dialog
                open={deleteDialogOpen}
                onClose={() => !deleteLoading && setDeleteDialogOpen(false)}
            >
                <DialogTitle sx={{ display: 'flex', alignItems: 'center', gap: 1, color: 'error.main' }}>
                    <Warning /> Delete Account?
                </DialogTitle>
                <DialogContent>
                    <DialogContentText paragraph>
                        Are you absolutely sure you want to delete your account? This action is <strong>irreversible</strong>.
                        All your transactions, budgets, goals, and personal data will be permanently removed from our servers.
                    </DialogContentText>

                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        autoFocus
                        margin="dense"
                        label="Confirm Password"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        disabled={deleteLoading}
                        helperText="Please enter your password to confirm deletion"
                    />
                </DialogContent>
                <DialogActions>
                    <Button
                        onClick={() => setDeleteDialogOpen(false)}
                        disabled={deleteLoading}
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={handleDeleteAccount}
                        color="error"
                        variant="contained"
                        disabled={deleteLoading}
                    >
                        {deleteLoading ? 'Deleting...' : 'Permanently Delete'}
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default AccountSettings;
