import { Box, Container, Typography, Button, Stack } from '@mui/material';
import { ArrowForward, Bolt } from '@mui/icons-material';
import { motion } from 'framer-motion';
import { Link as RouterLink } from 'react-router-dom';

const OpenSourceCTA = () => {
    return (
        <Box
            component="section"
            sx={{
                py: { xs: 12, md: 20 },
                background: '#030712',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Large gradient orb */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: 800,
                    height: 600,
                    background: 'radial-gradient(ellipse, rgba(99, 102, 241, 0.15) 0%, transparent 60%)',
                    filter: 'blur(60px)',
                    zIndex: 0,
                }}
            />

            <Container maxWidth="md" sx={{ position: 'relative', zIndex: 1 }}>
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.7 }}
                    sx={{
                        textAlign: 'center',
                        p: { xs: 5, md: 8 },
                        background: 'linear-gradient(135deg, rgba(255, 255, 255, 0.03) 0%, rgba(255, 255, 255, 0.01) 100%)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.08)',
                        borderRadius: 6,
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            right: 0,
                            height: '1px',
                            background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.2), transparent)',
                        },
                    }}
                >
                    {/* Icon */}
                    <Box
                        component={motion.div}
                        animate={{ rotate: [0, 10, 0, -10, 0] }}
                        transition={{ duration: 4, repeat: Infinity }}
                        sx={{
                            width: 80,
                            height: 80,
                            borderRadius: '50%',
                            background: 'linear-gradient(135deg, rgba(99, 102, 241, 0.2) 0%, rgba(139, 92, 246, 0.1) 100%)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            mx: 'auto',
                            mb: 4,
                            border: '1px solid rgba(255, 255, 255, 0.1)',
                        }}
                    >
                        <Bolt sx={{ fontSize: 36, color: '#818cf8' }} />
                    </Box>

                    {/* Headline */}
                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: { xs: '2rem', md: '3rem' },
                            fontWeight: 700,
                            color: 'white',
                            mb: 2,
                        }}
                    >
                        100% Free,{' '}
                        <Box
                            component="span"
                            sx={{
                                background: 'linear-gradient(135deg, #818cf8 0%, #c084fc 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            Forever
                        </Box>
                    </Typography>

                    <Typography
                        variant="body1"
                        sx={{
                            color: '#94a3b8',
                            fontSize: '1.2rem',
                            lineHeight: 1.7,
                            maxWidth: 500,
                            mx: 'auto',
                            mb: 5,
                        }}
                    >
                        No subscriptions, no premium tiers, no hidden fees.
                        Every feature is completely free to use.
                    </Typography>

                    {/* CTAs */}
                    <Stack
                        direction={{ xs: 'column', sm: 'row' }}
                        spacing={2}
                        justifyContent="center"
                    >
                        <Button
                            component={RouterLink}
                            to="/register"
                            variant="contained"
                            size="large"
                            endIcon={<ArrowForward />}
                            sx={{
                                px: 5,
                                py: 1.75,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                borderRadius: 3,
                                background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                                boxShadow: '0 0 30px rgba(99, 102, 241, 0.4)',
                                '&:hover': {
                                    background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)',
                                    boxShadow: '0 0 40px rgba(99, 102, 241, 0.5)',
                                },
                            }}
                        >
                            Create Free Account
                        </Button>
                        <Button
                            component={RouterLink}
                            to="/login"
                            variant="outlined"
                            size="large"
                            sx={{
                                px: 5,
                                py: 1.75,
                                fontSize: '1.1rem',
                                fontWeight: 600,
                                borderRadius: 3,
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                                '&:hover': {
                                    borderColor: 'rgba(255, 255, 255, 0.4)',
                                    background: 'rgba(255, 255, 255, 0.05)',
                                },
                            }}
                        >
                            Try Demo
                        </Button>
                    </Stack>
                </Box>
            </Container>
        </Box>
    );
};

export default OpenSourceCTA;
