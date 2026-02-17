/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { Box, Button, Container, IconButton, Paper, Snackbar, Alert } from '@mui/material';
import { Refresh as RefreshIcon } from '@mui/icons-material';
import { useState } from 'react';

// Toast notification component
export const Toast = ({ open, message, severity = 'success', onClose }) => {
    return (
        <Snackbar
            open={open}
            autoHideDuration={4000}
            onClose={onClose}
            anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
        >
            <Alert onClose={onClose} severity={severity} variant="filled" sx={{ width: '100%' }}>
                {message}
            </Alert>
        </Snackbar>
    );
};

// Loading overlay component
export const LoadingOverlay = ({ loading, children }) => {
    return (
        <Box position="relative">
            {loading && (
                <Box
                    position="absolute"
                    top={0}
                    left={0}
                    right={0}
                    bottom={0}
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    bgcolor="rgba(255, 255, 255, 0.8)"
                    zIndex={10}
                >
                    <Box textAlign="center">
                        <CircularProgress />
                        <Typography variant="body2" color="text.secondary" mt={2}>
                            Loading...
                        </Typography>
                    </Box>
                </Box>
            )}
            {children}
        </Box>
    );
};

// Empty state component
export const EmptyState = ({ icon: Icon, title, description, action, onAction }) => {
    return (
        <Paper
            sx={{
                p: 6,
                textAlign: 'center',
                bgcolor: 'background.default',
            }}
        >
            {Icon && <Icon sx={{ fontSize: 80, color: 'text.secondary', opacity: 0.3, mb: 2 }} />}
            <Typography variant="h6" gutterBottom>
                {title}
            </Typography>
            <Typography variant="body2" color="text.secondary" paragraph>
                {description}
            </Typography>
            {action && onAction && (
                <Button variant="contained" onClick={onAction} sx={{ mt: 2 }}>
                    {action}
                </Button>
            )}
        </Paper>
    );
};

// Refresh button component
export const RefreshButton = ({ onClick, loading }) => {
    return (
        <IconButton
            onClick={onClick}
            disabled={loading}
            color="primary"
            sx={{
                animation: loading ? 'spin 1s linear infinite' : 'none',
                '@keyframes spin': {
                    '0%': { transform: 'rotate(0deg)' },
                    '100%': { transform: 'rotate(360deg)' },
                },
            }}
        >
            <RefreshIcon />
        </IconButton>
    );
};

export default { Toast, LoadingOverlay, EmptyState, RefreshButton };
