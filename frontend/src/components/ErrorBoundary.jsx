/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import React from 'react';
import { Box, Typography, Button } from '@mui/material';
import { Refresh } from '@mui/icons-material';

class ErrorBoundary extends React.Component {
    constructor(props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error) {
        return { hasError: true, error };
    }

    componentDidCatch(error, errorInfo) {
        console.error("ErrorBoundary caught an error", error, errorInfo);
    }

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <Box sx={{
                    p: 2,
                    border: '1px dashed rgba(255,100,100,0.3)',
                    borderRadius: 2,
                    background: 'rgba(255,0,0,0.05)',
                    color: '#ffaaaa',
                    textAlign: 'center'
                }}>
                    <Typography variant="body2" sx={{ mb: 1 }}>
                        Something went wrong with this component.
                    </Typography>
                    <Button
                        size="small"
                        startIcon={<Refresh />}
                        onClick={() => this.setState({ hasError: false })}
                        sx={{ color: 'white', borderColor: 'rgba(255,255,255,0.2)' }}
                        variant="outlined"
                    >
                        Retry
                    </Button>
                </Box>
            );
        }

        return this.props.children;
    }
}

export default ErrorBoundary;
