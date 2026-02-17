/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { Paper, Box, Typography, Grid } from '@mui/material';
import { People, AttachMoney, Storage, TrendingUp } from '@mui/icons-material';

const StatCard = ({ title, value, icon, color }) => (
    <Paper elevation={0} sx={{ p: 3, border: '1px solid', borderColor: 'divider', borderRadius: 2 }}>
        <Box display="flex" justifyContent="space-between" alignItems="flex-start">
            <Box>
                <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                    {title}
                </Typography>
                <Typography variant="h4" fontWeight="bold">
                    {value}
                </Typography>
            </Box>
            <Box
                sx={{
                    bgcolor: `${color}.light`,
                    color: `${color}.main`,
                    p: 1,
                    borderRadius: 1,
                    display: 'flex',
                }}
            >
                {icon}
            </Box>
        </Box>
    </Paper>
);

const SystemStatsWidget = ({ stats }) => {
    if (!stats) return null;

    return (
        <Grid container spacing={3}>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard
                    title="Total Users"
                    value={stats.totalUsers}
                    icon={<People />}
                    color="primary"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard
                    title="Active Users"
                    value={stats.activeUsers}
                    icon={<TrendingUp />}
                    color="success"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard
                    title="Total Revenue"
                    value={`₹${stats.revenue}`}
                    icon={<AttachMoney />}
                    color="warning"
                />
            </Grid>
            <Grid item xs={12} sm={6} md={3}>
                <StatCard
                    title="Server Status"
                    value={stats.serverStatus}
                    icon={<Storage />}
                    color="info"
                />
            </Grid>
        </Grid>
    );
};

export default SystemStatsWidget;
