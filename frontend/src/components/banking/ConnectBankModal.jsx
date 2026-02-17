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
    MenuItem,
    Box,
    Typography,
    Stepper,
    Step,
    StepLabel,
    CircularProgress,
    Alert,
} from '@mui/material';
import { CheckCircle } from '@mui/icons-material';
import bankingService from '../../services/bankingService';

const ConnectBankModal = ({ open, onClose, onSuccess }) => {
    const [activeStep, setActiveStep] = useState(0);
    const [banks, setBanks] = useState([]);
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        bankName: '',
        accountType: 'Savings',
    });
    const [connectionStatus, setConnectionStatus] = useState(null);

    const steps = ['Select Bank', 'Connect Account', 'Confirmation'];

    useEffect(() => {
        if (open) {
            loadBanks();
        }
    }, [open]);

    const loadBanks = async () => {
        try {
            const response = await bankingService.getAvailableBanks();
            setBanks(response.data);
        } catch (error) {
            console.error('Failed to load banks:', error);
        }
    };

    const handleNext = async () => {
        if (activeStep === 1) {
            // Simulate OAuth connection
            setLoading(true);
            try {
                const response = await bankingService.connectBank(formData);
                setConnectionStatus({ success: true, data: response.data });
                setActiveStep(2);
            } catch (error) {
                setConnectionStatus({ success: false, error: error.message });
            } finally {
                setLoading(false);
            }
        } else {
            setActiveStep((prev) => prev + 1);
        }
    };

    const handleBack = () => {
        setActiveStep((prev) => prev - 1);
    };

    const handleClose = () => {
        setActiveStep(0);
        setFormData({ bankName: '', accountType: 'Savings' });
        setConnectionStatus(null);
        onClose();
    };

    const handleFinish = () => {
        if (connectionStatus?.success) {
            onSuccess(connectionStatus.data);
        }
        handleClose();
    };

    const getStepContent = (step) => {
        switch (step) {
            case 0:
                return (
                    <Box>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            Select your bank from the list below
                        </Typography>
                        <TextField
                            select
                            fullWidth
                            label="Select Bank"
                            value={formData.bankName}
                            onChange={(e) => setFormData({ ...formData, bankName: e.target.value })}
                        >
                            {banks.map((bank) => (
                                <MenuItem key={bank.id} value={bank.name}>
                                    {bank.logo} {bank.name}
                                </MenuItem>
                            ))}
                        </TextField>
                    </Box>
                );
            case 1:
                return (
                    <Box>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            Select account type to connect
                        </Typography>
                        <TextField
                            select
                            fullWidth
                            label="Account Type"
                            value={formData.accountType}
                            onChange={(e) => setFormData({ ...formData, accountType: e.target.value })}
                            sx={{ mb: 2 }}
                        >
                            <MenuItem value="Savings">Savings Account</MenuItem>
                            <MenuItem value="Current">Current Account</MenuItem>
                            <MenuItem value="Credit">Credit Card</MenuItem>
                        </TextField>
                        <Alert severity="info">
                            You will be redirected to {formData.bankName} to authorize the connection
                        </Alert>
                    </Box>
                );
            case 2:
                return (
                    <Box textAlign="center" py={3}>
                        {connectionStatus?.success ? (
                            <>
                                <CheckCircle color="success" sx={{ fontSize: 64, mb: 2 }} />
                                <Typography variant="h6" gutterBottom>
                                    Connection Successful!
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    {formData.bankName} account has been connected successfully.
                                </Typography>
                            </>
                        ) : (
                            <Alert severity="error">{connectionStatus?.error}</Alert>
                        )}
                    </Box>
                );
            default:
                return null;
        }
    };

    return (
        <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
            <DialogTitle>Connect Bank Account</DialogTitle>
            <DialogContent>
                <Stepper activeStep={activeStep} sx={{ mb: 3, mt: 1 }}>
                    {steps.map((label) => (
                        <Step key={label}>
                            <StepLabel>{label}</StepLabel>
                        </Step>
                    ))}
                </Stepper>
                {getStepContent(activeStep)}
            </DialogContent>
            <DialogActions>
                {activeStep < 2 && (
                    <>
                        <Button onClick={handleClose}>Cancel</Button>
                        {activeStep > 0 && (
                            <Button onClick={handleBack} disabled={loading}>
                                Back
                            </Button>
                        )}
                        <Button
                            variant="contained"
                            onClick={handleNext}
                            disabled={!formData.bankName || loading}
                        >
                            {loading ? <CircularProgress size={24} /> : activeStep === 1 ? 'Connect' : 'Next'}
                        </Button>
                    </>
                )}
                {activeStep === 2 && (
                    <Button variant="contained" onClick={handleFinish}>
                        Done
                    </Button>
                )}
            </DialogActions>
        </Dialog>
    );
};

export default ConnectBankModal;
