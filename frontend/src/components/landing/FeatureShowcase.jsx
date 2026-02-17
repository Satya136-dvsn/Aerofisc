/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { Box, Container, Typography, Grid } from '@mui/material';
import {
    AutoAwesome as AIIcon,
    Mic as VoiceIcon,
    Receipt as ReceiptIcon,
    CalendarMonth as CalendarIcon,
    Savings as SavingsIcon,
    InsertChart as ChartIcon,
    ShowChart as StockIcon,
} from '@mui/icons-material';
import { motion } from 'framer-motion';

const features = [
    {
        icon: AIIcon,
        title: 'AI Predictions',
        description: 'Machine learning forecasts your spending patterns and suggests optimizations.',
        gradient: 'linear-gradient(135deg, rgba(99, 102, 241, 0.15) 0%, rgba(139, 92, 246, 0.1) 100%)',
        iconColor: '#818cf8',
        size: 'large',
    },
    {
        icon: VoiceIcon,
        title: 'Voice Commands',
        description: 'Just say "Add ₹500 for lunch" — hands-free expense tracking.',
        gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.12) 0%, rgba(244, 114, 182, 0.08) 100%)',
        iconColor: '#f472b6',
        size: 'small',
    },
    {
        icon: ReceiptIcon,
        title: 'Receipt Scanner',
        description: 'Snap a photo, auto-extract amount and category.',
        gradient: 'linear-gradient(135deg, rgba(16, 185, 129, 0.12) 0%, rgba(52, 211, 153, 0.08) 100%)',
        iconColor: '#34d399',
        size: 'small',
    },
    {
        icon: CalendarIcon,
        title: 'Bills Calendar',
        description: 'Never miss a payment with smart reminders and due date tracking.',
        gradient: 'linear-gradient(135deg, rgba(251, 146, 60, 0.12) 0%, rgba(251, 191, 36, 0.08) 100%)',
        iconColor: '#fb923c',
        size: 'medium',
    },
    {
        icon: SavingsIcon,
        title: 'Savings Goals',
        description: 'Set targets, track progress, celebrate milestones.',
        gradient: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(96, 165, 250, 0.08) 100%)',
        iconColor: '#60a5fa',
        size: 'medium',
    },
    {
        icon: ChartIcon,
        title: 'Smart Analytics',
        description: 'Beautiful charts showing where your money goes with deep insights.',
        gradient: 'linear-gradient(135deg, rgba(139, 92, 246, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
        iconColor: '#a78bfa',
        size: 'medium',
    },
    {
        icon: StockIcon,
        title: 'Stock Portfolio',
        description: 'Track investments, monitor market trends, and manage your stock holdings.',
        gradient: 'linear-gradient(135deg, rgba(236, 72, 153, 0.15) 0%, rgba(168, 85, 247, 0.1) 100%)',
        iconColor: '#ec4899',
        size: 'medium',
    },
];

const FeatureCard = ({ feature, index }) => {
    const Icon = feature.icon;

    return (
        <Grid
            item
            xs={12}
            sm={feature.size === 'large' ? 12 : 6}
            md={feature.size === 'large' ? 6 : feature.size === 'medium' ? 6 : 3}
        >
            <Box
                component={motion.div}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                whileHover={{
                    y: -8,
                    transition: { duration: 0.3 }
                }}
                sx={{
                    height: '100%',
                    p: 4,
                    background: feature.gradient,
                    backdropFilter: 'blur(20px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 4,
                    cursor: 'default',
                    position: 'relative',
                    overflow: 'hidden',
                    '&::before': {
                        content: '""',
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        right: 0,
                        height: '1px',
                        background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.15), transparent)',
                    },
                }}
            >
                {/* Icon */}
                <Box
                    sx={{
                        width: 56,
                        height: 56,
                        borderRadius: 3,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        background: 'rgba(255, 255, 255, 0.05)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        mb: 3,
                    }}
                >
                    <Icon sx={{ fontSize: 28, color: feature.iconColor }} />
                </Box>

                {/* Title */}
                <Typography
                    variant="h6"
                    sx={{
                        color: 'white',
                        fontWeight: 600,
                        mb: 1.5,
                        fontSize: '1.25rem',
                    }}
                >
                    {feature.title}
                </Typography>

                {/* Description */}
                <Typography
                    variant="body2"
                    sx={{
                        color: '#94a3b8',
                        lineHeight: 1.7,
                        fontSize: '0.95rem',
                    }}
                >
                    {feature.description}
                </Typography>
            </Box>
        </Grid>
    );
};

const FeatureShowcase = () => {
    return (
        <Box
            component="section"
            id="features"
            sx={{
                py: { xs: 12, md: 16 },
                background: '#030712',
                position: 'relative',
            }}
        >
            {/* Background accent */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '100%',
                    height: '60%',
                    background: 'radial-gradient(ellipse 50% 50% at 50% 50%, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
                    zIndex: 0,
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                {/* Section Header */}
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    sx={{ textAlign: 'center', mb: 8 }}
                >
                    <Typography
                        variant="overline"
                        sx={{
                            color: '#60a5fa',
                            letterSpacing: 3,
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            mb: 2,
                            display: 'block',
                        }}
                    >
                        FEATURES
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: { xs: '2rem', md: '3rem' },
                            fontWeight: 700,
                            color: 'white',
                            mb: 2,
                        }}
                    >
                        Everything you need to{' '}
                        <Box
                            component="span"
                            sx={{
                                background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            master your money
                        </Box>
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{
                            color: '#64748b',
                            maxWidth: 500,
                            mx: 'auto',
                            fontSize: '1.1rem',
                        }}
                    >
                        Powerful tools that make personal finance actually enjoyable.
                    </Typography>
                </Box>

                {/* Bento Grid */}
                <Grid container spacing={3}>
                    {features.map((feature, index) => (
                        <FeatureCard key={feature.title} feature={feature} index={index} />
                    ))}
                </Grid>
            </Container>
        </Box>
    );
};

export default FeatureShowcase;
