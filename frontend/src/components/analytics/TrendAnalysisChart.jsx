/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { ResponsiveContainer, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';
import { Box, Typography, Skeleton, useTheme } from '@mui/material';

const TrendAnalysisChart = ({ data, loading, disableAnimation = false }) => {
    const theme = useTheme();

    if (loading) {
        return <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />;
    }

    if (!data || data.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                <Typography color="text.secondary">No trend data available for this period</Typography>
            </Box>
        );
    }

    const formatCurrency = (value) => {
        return new Intl.NumberFormat('en-IN', {
            style: 'currency',
            currency: 'INR',
            maximumFractionDigits: 0,
        }).format(value);
    };

    return (
        <ResponsiveContainer width="100%" height={300}>
            <AreaChart data={data} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                <defs>
                    <linearGradient id="colorIncome" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.success.main} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={theme.palette.success.main} stopOpacity={0} />
                    </linearGradient>
                    <linearGradient id="colorExpenses" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor={theme.palette.error.main} stopOpacity={0.3} />
                        <stop offset="95%" stopColor={theme.palette.error.main} stopOpacity={0} />
                    </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke={theme.palette.divider} vertical={false} />
                <XAxis
                    dataKey="month"
                    stroke={theme.palette.text.secondary}
                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                    tickLine={false}
                    axisLine={false}
                />
                <YAxis
                    stroke={theme.palette.text.secondary}
                    tick={{ fill: theme.palette.text.secondary, fontSize: 12 }}
                    tickFormatter={(value) => `₹${value / 1000}k`}
                    tickLine={false}
                    axisLine={false}
                />
                <Tooltip
                    formatter={(value) => formatCurrency(value)}
                    contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        borderColor: theme.palette.divider,
                        borderRadius: 8,
                        boxShadow: theme.shadows[3]
                    }}
                    itemStyle={{ color: theme.palette.text.primary }}
                />
                <Legend />
                <Area
                    type="monotone"
                    dataKey="income"
                    name="Income"
                    stroke={theme.palette.success.main}
                    fillOpacity={1}
                    fill="url(#colorIncome)"
                    strokeWidth={2}
                    isAnimationActive={!disableAnimation}
                />
                <Area
                    type="monotone"
                    dataKey="expenses"
                    name="Expenses"
                    stroke={theme.palette.error.main}
                    fillOpacity={1}
                    fill="url(#colorExpenses)"
                    strokeWidth={2}
                    isAnimationActive={!disableAnimation}
                />
            </AreaChart>
        </ResponsiveContainer>
    );
};

export default TrendAnalysisChart;
