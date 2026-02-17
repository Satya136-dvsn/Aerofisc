/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { useState, useEffect } from 'react';
import { Grid, TextField, Button, Avatar, Box, Typography, Snackbar, Alert } from '@mui/material';
import userService from '../../services/userService';
import { CloudUpload, Save } from '@mui/icons-material';
import ProfessionalCard from '../ui/ProfessionalCard';
import { useAuth } from '../../context/AuthContext';

const ProfileSettings = () => {
    const { user } = useAuth();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        email: '',
        phone: '',
        bio: '',
        avatar: '',
        monthlyIncome: '',
        savingsTarget: ''
    });

    // Load profile data on mount
    useEffect(() => {
        const loadProfile = async () => {
            try {
                const response = await userService.getProfile();
                if (response.data) {
                    setFormData({
                        firstName: response.data.firstName || '',
                        lastName: response.data.lastName || '',
                        email: user?.email || '', // Get email from AuthContext user
                        phone: response.data.phone || '',
                        bio: response.data.bio || '',
                        avatar: response.data.avatar || '',
                        monthlyIncome: response.data.monthlyIncome || '',
                        savingsTarget: response.data.savingsTarget || ''
                    });
                }
            } catch (error) {
                console.error('Failed to load profile:', error);
            }
        };
        loadProfile();
    }, [user]); // Add user as dependency

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const [loading, setLoading] = useState(false);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    const handleSave = async () => {
        try {
            setLoading(true);
            await userService.updateProfile(formData);
            setSnackbar({ open: true, message: 'Profile updated successfully', severity: 'success' });
        } catch (error) {
            console.error('Failed to update profile:', error);
            setSnackbar({ open: true, message: 'Failed to update profile', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleAvatarChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            try {
                setLoading(true);

                // Convert image to data URL for storage
                const reader = new FileReader();
                reader.onloadend = async () => {
                    const imageDataUrl = reader.result;

                    // Update avatar in state (for immediate display)
                    const updatedData = { ...formData, avatar: imageDataUrl };
                    setFormData(updatedData);

                    // Save to backend database
                    await userService.updateProfile(updatedData);

                    // Dispatch event to notify other components (navbar)
                    window.dispatchEvent(new CustomEvent('avatarChanged', { detail: imageDataUrl }));

                    setSnackbar({ open: true, message: 'Avatar uploaded successfully', severity: 'success' });
                };
                reader.readAsDataURL(file);

            } catch (error) {
                console.error('Failed to upload avatar:', error);
                setSnackbar({ open: true, message: 'Failed to upload avatar', severity: 'error' });
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <>
            <ProfessionalCard title="Profile Information" subheader="Update your personal details">
                <Grid container spacing={4}>
                    <Grid item xs={12} md={4} display="flex" flexDirection="column" alignItems="center">
                        <Avatar
                            src={formData.avatar}
                            sx={{ width: 120, height: 120, mb: 2, fontSize: '3rem' }}
                        >
                            {!formData.avatar && (user?.username?.[0]?.toUpperCase() || 'U')}
                        </Avatar>
                        <Button
                            variant="outlined"
                            component="label"
                            startIcon={<CloudUpload />}
                            size="small"
                        >
                            Upload Photo
                            <input type="file" hidden accept="image/*" onChange={handleAvatarChange} />
                        </Button>
                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1 }}>
                            Allowed *.jpeg, *.jpg, *.png, *.gif
                        </Typography>
                    </Grid>

                    <Grid item xs={12} md={8}>
                        <Grid container spacing={2}>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="First Name"
                                    name="firstName"
                                    value={formData.firstName}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Last Name"
                                    name="lastName"
                                    value={formData.lastName}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Email Address"
                                    name="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                    disabled
                                    helperText="Contact support to change email"
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    label="Phone Number"
                                    name="phone"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />
                            </Grid>
                            <Grid item xs={12}>
                                <TextField
                                    fullWidth
                                    multiline
                                    rows={4}
                                    label="Bio"
                                    name="bio"
                                    value={formData.bio}
                                    onChange={handleChange}
                                    placeholder="Tell us a little about yourself..."
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Monthly Income"
                                    name="monthlyIncome"
                                    type="number"
                                    value={formData.monthlyIncome}
                                    onChange={handleChange}
                                    placeholder="Enter your monthly income"
                                    inputProps={{ min: 0, step: 0.01 }}
                                />
                            </Grid>
                            <Grid item xs={12} sm={6}>
                                <TextField
                                    fullWidth
                                    label="Savings Target"
                                    name="savingsTarget"
                                    type="number"
                                    value={formData.savingsTarget}
                                    onChange={handleChange}
                                    placeholder="Enter your savings target"
                                    inputProps={{ min: 0, step: 0.01 }}
                                />
                            </Grid>
                            <Grid item xs={12} display="flex" justifyContent="flex-end">
                                <Button
                                    variant="contained"
                                    startIcon={<Save />}
                                    onClick={handleSave}
                                    disabled={loading}
                                >
                                    {loading ? 'Saving...' : 'Save Changes'}
                                </Button>
                            </Grid>
                        </Grid>
                    </Grid>
                </Grid>
            </ProfessionalCard>
            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default ProfileSettings;
