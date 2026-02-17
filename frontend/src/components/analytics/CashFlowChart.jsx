/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
import { Box, Typography, Skeleton, useTheme } from '@mui/material';

const CashFlowChart = ({ data, loading }) => {
    const theme = useTheme();

    if (loading) {
        return <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />;
    }

    if (!data || data.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                <Typography color="text.secondary">No cash flow data available</Typography>
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
            <BarChart
                data={data}
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
            >
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
                    cursor={{ fill: theme.palette.action.hover }}
                    contentStyle={{
                        backgroundColor: theme.palette.background.paper,
                        borderColor: theme.palette.divider,
                        borderRadius: 8,
                        boxShadow: theme.shadows[3]
                    }}
                    itemStyle={{ color: theme.palette.text.primary }}
                />
                <Legend />
                <ReferenceLine y={0} stroke="#000" />
                <Bar dataKey="netSavings" name="Net Cash Flow" fill={theme.palette.primary.main} radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
};

export default CashFlowChart;
