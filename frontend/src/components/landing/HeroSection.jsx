/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { Box, Container, Typography, Button, Stack, Chip } from '@mui/material';
import { ArrowForward, PlayArrow, TrendingUp, TrendingDown, AccountBalance, Savings, Receipt, AutoAwesome, Mic, DocumentScanner, ShowChart } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';

// Floating glass card data - arranged in a clean grid pattern
const floatingCards = [
    {
        id: 1,
        content: '+24%',
        label: 'Savings',
        color: '#10b981',
        icon: TrendingUp,
        position: { top: '15%', right: '3%' },
        animation: { y: [-8, 8, -8] },
        delay: 0.5,
    },
    {
        id: 2,
        content: '-18%',
        label: 'Expenses',
        color: '#34d399',
        icon: TrendingDown,
        position: { top: '15%', right: '18%' },
        animation: { y: [6, -10, 6] },
        delay: 0.6,
    },
    {
        id: 3,
        content: '₹45K',
        label: 'Budget',
        color: '#60a5fa',
        icon: AccountBalance,
        position: { top: '35%', right: '5%' },
        animation: { y: [10, -8, 10] },
        delay: 0.7,
    },
    {
        id: 4,
        content: '₹12.5K',
        label: 'Bills',
        color: '#f59e0b',
        icon: Receipt,
        position: { top: '35%', right: '20%' },
        animation: { y: [-6, 10, -6] },
        delay: 0.8,
    },
    {
        id: 5,
        content: '7',
        label: 'Goals',
        color: '#a78bfa',
        icon: Savings,
        position: { top: '55%', right: '8%' },
        animation: { y: [8, -6, 8] },
        delay: 0.9,
    },
    {
        id: 6,
        content: '+12%',
        label: 'Portfolio',
        color: '#ec4899',
        icon: ShowChart,
        position: { top: '55%', right: '22%' },
        animation: { y: [-5, 9, -5] },
        delay: 1.0,
    },
];

const FloatingCard = ({ card }) => {
    const Icon = card.icon;

    return (
        <Box
            component={motion.div}
            initial={{ opacity: 0, y: 40, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, delay: card.delay }}
            sx={{
                position: 'absolute',
                ...card.position,
                display: { xs: 'none', lg: 'block' },
                zIndex: 1,
            }}
        >
            <Box
                component={motion.div}
                animate={card.animation}
                transition={{ duration: 4 + card.id * 0.5, repeat: Infinity, ease: 'easeInOut' }}
                sx={{
                    p: 2,
                    minWidth: 110,
                    background: 'rgba(255, 255, 255, 0.04)',
                    backdropFilter: 'blur(16px)',
                    border: '1px solid rgba(255, 255, 255, 0.08)',
                    borderRadius: 2.5,
                    boxShadow: '0 8px 32px rgba(0, 0, 0, 0.15)',
                }}
            >
                <Stack direction="row" alignItems="center" spacing={1} sx={{ mb: 0.5 }}>
                    {Icon && (
                        <Box
                            sx={{
                                width: 24,
                                height: 24,
                                borderRadius: 1,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                background: `${card.color}20`,
                            }}
                        >
                            <Icon sx={{ color: card.color, fontSize: 14 }} />
                        </Box>
                    )}
                    <Typography
                        sx={{
                            color: card.color,
                            fontSize: '1.1rem',
                            fontWeight: 700,
                            lineHeight: 1,
                        }}
                    >
                        {card.content}
                    </Typography>
                </Stack>
                <Typography
                    sx={{
                        color: '#64748b',
                        fontSize: '0.7rem',
                        fontWeight: 500,
                    }}
                >
                    {card.label}
                </Typography>
            </Box>
        </Box>
    );
};

const HeroSection = () => {
    return (
        <Box
            component="section"
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                position: 'relative',
                overflow: 'hidden',
                background: '#030712',
                pt: { xs: 12, md: 0 },
            }}
        >
            {/* Aurora gradient background */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    background: `
            radial-gradient(ellipse 80% 50% at 50% -20%, rgba(120, 119, 198, 0.3), transparent),
            radial-gradient(ellipse 60% 40% at 80% 50%, rgba(59, 130, 246, 0.15), transparent),
            radial-gradient(ellipse 50% 30% at 20% 80%, rgba(139, 92, 246, 0.2), transparent)
          `,
                    zIndex: 0,
                }}
            />

            {/* Animated mesh gradient */}
            <Box
                component={motion.div}
                animate={{
                    background: [
                        'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
                        'radial-gradient(circle at 80% 50%, rgba(139, 92, 246, 0.15) 0%, transparent 50%)',
                        'radial-gradient(circle at 50% 80%, rgba(16, 185, 129, 0.1) 0%, transparent 50%)',
                        'radial-gradient(circle at 20% 50%, rgba(59, 130, 246, 0.15) 0%, transparent 50%)',
                    ],
                }}
                transition={{ duration: 10, repeat: Infinity, ease: 'linear' }}
                sx={{
                    position: 'absolute',
                    inset: 0,
                    zIndex: 0,
                }}
            />

            {/* Large floating orbs */}
            <Box
                component={motion.div}
                animate={{ y: [-20, 20, -20], rotateZ: [0, 5, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}
                sx={{
                    position: 'absolute',
                    top: '15%',
                    right: '10%',
                    width: 300,
                    height: 300,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.4) 0%, rgba(139, 92, 246, 0.2) 100%)',
                    filter: 'blur(80px)',
                    zIndex: 0,
                }}
            />

            <Box
                component={motion.div}
                animate={{ y: [20, -20, 20], x: [-10, 10, -10] }}
                transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
                sx={{
                    position: 'absolute',
                    bottom: '20%',
                    left: '5%',
                    width: 250,
                    height: 250,
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, rgba(139, 92, 246, 0.3) 0%, rgba(236, 72, 153, 0.15) 100%)',
                    filter: 'blur(60px)',
                    zIndex: 0,
                }}
            />

            {/* Floating Glass Cards */}
            {floatingCards.map((card) => (
                <FloatingCard key={card.id} card={card} />
            ))}

            {/* Main content */}
            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 2 }}>
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 50 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8 }}
                    sx={{ maxWidth: 650 }}
                >
                    {/* Badge */}
                    <Chip
                        component={motion.div}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        label="✨ Free & Open Source"
                        sx={{
                            mb: 4,
                            py: 2.5,
                            px: 0.5,
                            background: 'rgba(255, 255, 255, 0.05)',
                            backdropFilter: 'blur(10px)',
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                            color: '#e2e8f0',
                            fontWeight: 500,
                            fontSize: '0.9rem',
                            '& .MuiChip-label': { px: 2 },
                        }}
                    />

                    {/* Headline */}
                    <Typography
                        variant="h1"
                        sx={{
                            fontSize: { xs: '2.75rem', sm: '4rem', md: '5rem' },
                            fontWeight: 800,
                            lineHeight: 1.05,
                            letterSpacing: '-0.02em',
                            mb: 3,
                            color: 'white',
                        }}
                    >
                        Finance made{' '}
                        <Box
                            component="span"
                            sx={{
                                background: 'linear-gradient(135deg, #60a5fa 0%, #a78bfa 50%, #f472b6 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                                backgroundSize: '200% 200%',
                                animation: 'gradient 5s ease infinite',
                                '@keyframes gradient': {
                                    '0%': { backgroundPosition: '0% 50%' },
                                    '50%': { backgroundPosition: '100% 50%' },
                                    '100%': { backgroundPosition: '0% 50%' },
                                },
                            }}
                        >
                            simple.
                        </Box>
                    </Typography>

                    {/* Subheadline */}
                    <Typography
                        variant="h5"
                        sx={{
                            color: '#94a3b8',
                            fontWeight: 400,
                            lineHeight: 1.6,
                            mb: 5,
                            fontSize: { xs: '1.1rem', md: '1.35rem' },
                            maxWidth: 520,
                        }}
                    >
                        Track, budget, and grow your wealth with AI-powered insights.
                        Voice commands, receipt scanning, and smart predictions — all free.
                    </Typography>

                    {/* CTAs */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2} sx={{ mb: 6 }}>
                        <Button
                            component={RouterLink}
                            to="/register"
                            variant="contained"
                            size="large"
                            endIcon={<ArrowForward />}
                            sx={{
                                px: 4,
                                py: 1.75,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                borderRadius: 3,
                                background: 'white',
                                color: '#030712',
                                boxShadow: '0 0 40px rgba(255, 255, 255, 0.15)',
                                '&:hover': {
                                    background: '#f1f5f9',
                                    boxShadow: '0 0 50px rgba(255, 255, 255, 0.25)',
                                },
                            }}
                        >
                            Start for Free
                        </Button>
                        <Button
                            component={RouterLink}
                            to="/login"
                            variant="outlined"
                            size="large"
                            startIcon={<PlayArrow />}
                            sx={{
                                px: 4,
                                py: 1.75,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                borderRadius: 3,
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                backdropFilter: 'blur(10px)',
                                '&:hover': {
                                    borderColor: 'rgba(255, 255, 255, 0.4)',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                },
                            }}
                        >
                            Watch Demo
                        </Button>
                    </Stack>

                    {/* Trust indicators */}
                    <Stack direction="row" spacing={2} flexWrap="wrap" useFlexGap sx={{ gap: 1.5 }}>
                        {[
                            { Icon: AutoAwesome, text: 'AI Predictions', color: '#818cf8' },
                            { Icon: Mic, text: 'Voice Commands', color: '#f472b6' },
                            { Icon: DocumentScanner, text: 'Receipt Scanner', color: '#34d399' },
                            { Icon: ShowChart, text: 'Stock Portfolio', color: '#ec4899' },
                        ].map((item) => (
                            <Box
                                key={item.text}
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 1,
                                    px: 2,
                                    py: 0.75,
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    border: '1px solid rgba(255, 255, 255, 0.06)',
                                    borderRadius: 100,
                                }}
                            >
                                <item.Icon sx={{ fontSize: 14, color: item.color }} />
                                <Typography
                                    variant="body2"
                                    sx={{
                                        color: '#94a3b8',
                                        fontSize: '0.8rem',
                                        fontWeight: 500,
                                    }}
                                >
                                    {item.text}
                                </Typography>
                            </Box>
                        ))}
                    </Stack>
                </Box>
            </Container>

            {/* Bottom gradient fade */}
            <Box
                sx={{
                    position: 'absolute',
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 150,
                    background: 'linear-gradient(to top, #030712 0%, transparent 100%)',
                    zIndex: 1,
                }}
            />
        </Box>
    );
};

export default HeroSection;
