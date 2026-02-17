/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';
import { Box, Typography, Skeleton, useTheme } from '@mui/material';
import { getCategoryColor } from '../../utils/categoryColors';

const CategoryBreakdownChart = ({ data, loading, onCategoryClick, disableAnimation = false }) => {
    const theme = useTheme();

    if (loading) {
        return <Skeleton variant="rectangular" width="100%" height={300} sx={{ borderRadius: 2 }} />;
    }

    if (!data || data.length === 0) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" height={300}>
                <Typography color="text.secondary">No category data available</Typography>
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

    const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
        const RADIAN = Math.PI / 180;
        const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
        const x = cx + radius * Math.cos(-midAngle * RADIAN);
        const y = cy + radius * Math.sin(-midAngle * RADIAN);

        return percent > 0.05 ? (
            <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central" fontSize={12} fontWeight="bold">
                {`${(percent * 100).toFixed(0)}%`}
            </text>
        ) : null;
    };

    return (
        <Box height={300} position="relative" sx={{ backgroundColor: 'background.paper', borderRadius: 1 }}>
            <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                    <Pie
                        data={data}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={renderCustomizedLabel}
                        outerRadius={100}
                        fill="#8884d8"
                        dataKey="amount"
                        nameKey="categoryName"
                        paddingAngle={2}
                        onClick={(data) => onCategoryClick && onCategoryClick(data)}
                        style={{ cursor: 'pointer' }}
                        isAnimationActive={!disableAnimation}
                    >
                        {data.map((entry, index) => (
                            <Cell
                                key={`cell-${index}`}
                                fill={getCategoryColor(entry.categoryId, index)}
                                stroke={theme.palette.background.paper}
                                strokeWidth={2}
                            />
                        ))}
                    </Pie>
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
                    <Legend
                        layout="vertical"
                        verticalAlign="middle"
                        align="right"
                        wrapperStyle={{ fontSize: '12px', color: theme.palette.text.primary }}
                    />
                </PieChart>
            </ResponsiveContainer>
        </Box>
    );
};

export default CategoryBreakdownChart;
