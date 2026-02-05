import { Box, Container, Typography, Stack, Link, Divider } from '@mui/material';
import { Link as RouterLink } from 'react-router-dom';

const Footer = () => {
    const currentYear = new Date().getFullYear();

    return (
        <Box
            component="footer"
            sx={{
                py: 8,
                background: '#030712',
                borderTop: '1px solid rgba(255, 255, 255, 0.05)',
            }}
        >
            <Container maxWidth="lg">
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    justifyContent="space-between"
                    spacing={6}
                >
                    {/* Brand */}
                    <Box sx={{ maxWidth: 300 }}>
                        <Box sx={{ mb: 2 }}>
                            <Box
                                component="img"
                                src="/icons/logo.png"
                                alt="Aerofisc"
                                sx={{
                                    height: 56,
                                    width: 'auto',
                                }}
                            />
                        </Box>
                        <Typography variant="body2" sx={{ color: '#64748b', lineHeight: 1.8 }}>
                            Your personal finance command center. Track, budget, and grow your wealth with
                            AI-powered insights.
                        </Typography>
                    </Box>

                    {/* Links */}
                    <Stack direction={{ xs: 'column', sm: 'row' }} spacing={{ xs: 4, sm: 8 }}>
                        <Stack spacing={2}>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                                Product
                            </Typography>
                            <Link
                                component={RouterLink}
                                to="/register"
                                underline="none"
                                sx={{ color: '#64748b', fontSize: '0.9rem', '&:hover': { color: 'white' } }}
                            >
                                Get Started
                            </Link>
                            <Link
                                component={RouterLink}
                                to="/login"
                                underline="none"
                                sx={{ color: '#64748b', fontSize: '0.9rem', '&:hover': { color: 'white' } }}
                            >
                                Sign In
                            </Link>
                        </Stack>

                        <Stack spacing={2}>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                                Features
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>AI Predictions</Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>Voice Commands</Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>Receipt Scanner</Typography>
                        </Stack>

                        <Stack spacing={2}>
                            <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600, textTransform: 'uppercase', letterSpacing: 1 }}>
                                More
                            </Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>Bills Calendar</Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>Savings Goals</Typography>
                            <Typography variant="body2" sx={{ color: '#64748b' }}>Analytics</Typography>
                        </Stack>
                    </Stack>
                </Stack>

                <Divider sx={{ my: 6, borderColor: 'rgba(255, 255, 255, 0.05)' }} />

                {/* Bottom */}
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    justifyContent="space-between"
                    alignItems="center"
                    spacing={2}
                >
                    <Typography variant="caption" sx={{ color: '#475569' }}>
                        © {currentYear} Aerofisc. Free to use. Built with ❤️
                    </Typography>
                </Stack>
            </Container>
        </Box>
    );
};

export default Footer;
