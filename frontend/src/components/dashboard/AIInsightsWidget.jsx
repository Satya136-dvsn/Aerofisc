/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { useState, useEffect } from 'react';
import { Box, Typography, Paper, Chip, CircularProgress, Alert } from '@mui/material';
import { TrendingUp, Warning, CheckCircle } from '@mui/icons-material';
import aiService from '../../services/aiService';

const AIInsightsWidget = () => {
    const [insights, setInsights] = useState(null);
    const [anomalies, setAnomalies] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        loadInsights();
    }, []);

    const loadInsights = async () => {
        try {
            setLoading(true);
            const [advisorRes, anomaliesRes] = await Promise.all([
                aiService.getBudgetAdvisor(),
                aiService.getAnomalies(),
            ]);

            setInsights(advisorRes.data);
            setAnomalies(anomaliesRes.data || []);
        } catch (err) {
            console.error('Failed to load AI insights:', err);
            setError('AI insights unavailable');
        } finally {
            setLoading(false);
        }
    };

    if (loading) {
        return (
            <Paper sx={{ p: 3, textAlign: 'center' }}>
                <CircularProgress />
                <Typography variant="body2" color="text.secondary" sx={{ mt: 2 }}>
                    Loading AI insights...
                </Typography>
            </Paper>
        );
    }

    if (error) {
        return (
            <Paper sx={{ p: 3 }}>
                <Alert severity="info">{error}</Alert>
            </Paper>
        );
    }

    return (
        <Paper sx={{ p: 3 }}>
            <Box display="flex" alignItems="center" gap={1} mb={2}>
                <TrendingUp color="primary" />
                <Typography variant="h6" sx={{ fontWeight: 600 }}>
                    AI Insights
                </Typography>
            </Box>

            {/* Budget Recommendations */}
            {insights && insights.recommendations && (
                <Box mb={2}>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Recommendations:
                    </Typography>
                    {insights.recommendations.map((rec, index) => (
                        <Chip
                            key={index}
                            label={rec}
                            icon={<CheckCircle />}
                            color="success"
                            variant="outlined"
                            sx={{ m: 0.5 }}
                            size="small"
                        />
                    ))}
                </Box>
            )}

            {/* Anomalies */}
            {anomalies.length > 0 && (
                <Box>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Unusual Activity:
                    </Typography>
                    {anomalies.slice(0, 3).map((anomaly, index) => (
                        <Chip
                            key={index}
                            label={anomaly.description || 'Unusual spending detected'}
                            icon={<Warning />}
                            color="warning"
                            variant="outlined"
                            sx={{ m: 0.5 }}
                            size="small"
                        />
                    ))}
                </Box>
            )}

            {!insights && anomalies.length === 0 && (
                <Typography variant="body2" color="text.secondary">
                    Add more transactions to get AI-powered insights
                </Typography>
            )}
        </Paper>
    );
};

export default AIInsightsWidget;
