/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { useState, useEffect } from 'react';
import { Container, Box, Typography, Fade, Snackbar, Alert, CircularProgress, Button } from '@mui/material';
import SystemStatsWidget from '../components/admin/SystemStatsWidget';
import UserManagementTable from '../components/admin/UserManagementTable';
import UserProfileDialog from '../components/admin/UserProfileDialog';

import adminService from '../services/adminService';
import userService from '../services/userService';
import { CloudUpload, AddLink, CheckCircle } from '@mui/icons-material';
import { Paper } from '@mui/material';

const AdminDashboard = () => {
    const [stats, setStats] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const [profileDialog, setProfileDialog] = useState({ open: false, userId: null, userName: '' });
    const [isDriveConnected, setIsDriveConnected] = useState(false);
    const [driveLoading, setDriveLoading] = useState(false);
    const [backupLoading, setBackupLoading] = useState(false);

    useEffect(() => {
        fetchDashboardData();
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
            setSnackbar({ open: true, message: 'Failed to initiate Google Drive connection', severity: 'error' });
        }
    };

    const handleBackupToDrive = async () => {
        try {
            setBackupLoading(true);
            const response = await userService.backupToGoogleDrive();
            setSnackbar({ open: true, message: response.data.message || "Backup uploaded successfully!", severity: 'success' });
        } catch (error) {
            console.error("Backup failed", error);
            setSnackbar({ open: true, message: "Backup failed: " + (error.response?.data?.error || error.message), severity: 'error' });
        } finally {
            setBackupLoading(false);
        }
    };

    const fetchDashboardData = async () => {
        try {
            setLoading(true);
            const [statsRes, usersRes] = await Promise.all([
                adminService.getStats(),
                adminService.getUsers()
            ]);

            // Map backend stats to widget format
            setStats({
                totalUsers: statsRes.data.totalUsers || 0,
                activeUsers: statsRes.data.activeUsers || 0,
                revenue: statsRes.data.revenue || 0,
                serverStatus: 'Online' // Mock status
            });

            // Map backend user page to table format
            const userContent = usersRes.data.content || [];
            const mappedUsers = userContent.map(user => ({
                id: user.id,
                name: user.username, // Map username to name
                email: user.email,
                role: user.role,
                status: user.isActive ? 'Active' : 'Inactive', // Map isActive to status
                joined: user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'
            }));

            setUsers(mappedUsers);
        } catch (error) {
            console.error('Failed to fetch admin data:', error);
            setSnackbar({ open: true, message: 'Failed to load dashboard data', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateUserStatus = async (userId, status) => {
        try {
            await adminService.updateUserStatus(userId, status);
            setUsers(users.map(user =>
                user.id === userId ? { ...user, status } : user
            ));
            setSnackbar({ open: true, message: 'User status updated', severity: 'success' });
        } catch (error) {
            console.error('Failed to update user status:', error);
            setSnackbar({ open: true, message: 'Failed to update user status', severity: 'error' });
        }
    };

    const handleDeleteUser = async (userId) => {
        if (!window.confirm('Are you sure you want to delete this user?')) return;

        try {
            await adminService.deleteUser(userId);
            setUsers(users.filter(user => user.id !== userId));
            setSnackbar({ open: true, message: 'User deleted successfully', severity: 'success' });
        } catch (error) {
            console.error('Failed to delete user:', error);
            setSnackbar({ open: true, message: 'Failed to delete user', severity: 'error' });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleViewTransactions = (userId, userName) => {
        setProfileDialog({ open: true, userId, userName });
    };

    const handleCloseProfileDialog = () => {
        setProfileDialog({ open: false, userId: null, userName: '' });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="xl" sx={{ pb: 4 }}>
            <Fade in timeout={300}>
                <Box mb={4}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 0.5 }}>
                        Admin Dashboard
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage users, view system statistics, and monitor platform activity
                    </Typography>
                </Box>
            </Fade>

            <Box mb={4}>
                <SystemStatsWidget stats={stats} />
            </Box>

            <Box mb={4}>
                <Paper sx={{ p: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <Box>
                        <Typography variant="h6" gutterBottom>
                            System Backup
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            {isDriveConnected
                                ? <span style={{ display: 'flex', alignItems: 'center', gap: '8px' }}><CheckCircle color="success" fontSize="small" /> Connected to Google Drive</span>
                                : "Connect Google Drive to enable cloud backups"}
                        </Typography>
                    </Box>
                    <Box>
                        <Button
                            variant="contained"
                            color={isDriveConnected ? "success" : "primary"}
                            startIcon={backupLoading || driveLoading ? <CircularProgress size={20} color="inherit" /> : (isDriveConnected ? <CloudUpload /> : <AddLink />)}
                            onClick={isDriveConnected ? handleBackupToDrive : handleConnectDrive}
                            disabled={backupLoading || driveLoading}
                        >
                            {driveLoading ? 'Checking...' : (isDriveConnected ? (backupLoading ? 'Backing up...' : 'Backup Now') : 'Connect Drive')}
                        </Button>
                    </Box>
                </Paper>
            </Box>

            <UserManagementTable
                users={users}
                onUpdateStatus={handleUpdateUserStatus}
                onDeleteUser={handleDeleteUser}
                onViewTransactions={handleViewTransactions}
            />

            <UserProfileDialog
                open={profileDialog.open}
                onClose={handleCloseProfileDialog}
                userId={profileDialog.userId}
                userName={profileDialog.userName}
            />

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default AdminDashboard;
