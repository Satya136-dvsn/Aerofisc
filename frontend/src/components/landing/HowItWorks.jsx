import { Box, Container, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';

const steps = [
    {
        number: '01',
        title: 'Create Account',
        description: 'Sign up in seconds. No credit card required, ever.',
        color: '#60a5fa',
    },
    {
        number: '02',
        title: 'Add Transactions',
        description: 'Type, speak, or scan — however you prefer to track.',
        color: '#a78bfa',
    },
    {
        number: '03',
        title: 'Get Insights',
        description: 'AI analyzes your habits and suggests improvements.',
        color: '#34d399',
    },
];

const HowItWorks = () => {
    return (
        <Box
            component="section"
            id="how-it-works"
            sx={{
                py: { xs: 12, md: 16 },
                background: 'linear-gradient(180deg, #030712 0%, #0f172a 50%, #030712 100%)',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Decorative line */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: { xs: '90%', md: '60%' },
                    height: 1,
                    background: 'linear-gradient(90deg, transparent, rgba(255, 255, 255, 0.1), transparent)',
                    display: { xs: 'none', md: 'block' },
                }}
            />

            <Container maxWidth="lg">
                {/* Section Header */}
                <Box
                    component={motion.div}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    sx={{ textAlign: 'center', mb: 10 }}
                >
                    <Typography
                        variant="overline"
                        sx={{
                            color: '#a78bfa',
                            letterSpacing: 3,
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            mb: 2,
                            display: 'block',
                        }}
                    >
                        HOW IT WORKS
                    </Typography>
                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: { xs: '2rem', md: '3rem' },
                            fontWeight: 700,
                            color: 'white',
                        }}
                    >
                        Three steps to{' '}
                        <Box
                            component="span"
                            sx={{
                                background: 'linear-gradient(135deg, #a78bfa 0%, #f472b6 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            financial clarity
                        </Box>
                    </Typography>
                </Box>

                {/* Steps */}
                <Stack
                    direction={{ xs: 'column', md: 'row' }}
                    spacing={{ xs: 6, md: 4 }}
                    justifyContent="center"
                >
                    {steps.map((step, index) => (
                        <Box
                            key={step.number}
                            component={motion.div}
                            initial={{ opacity: 0, y: 40 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ duration: 0.5, delay: index * 0.15 }}
                            sx={{
                                flex: 1,
                                maxWidth: 350,
                                textAlign: 'center',
                                position: 'relative',
                            }}
                        >
                            {/* Number */}
                            <Typography
                                sx={{
                                    fontSize: '5rem',
                                    fontWeight: 800,
                                    background: `linear-gradient(135deg, ${step.color} 0%, transparent 80%)`,
                                    WebkitBackgroundClip: 'text',
                                    WebkitTextFillColor: 'transparent',
                                    opacity: 0.3,
                                    lineHeight: 1,
                                    mb: -3,
                                    position: 'relative',
                                    zIndex: 0,
                                }}
                            >
                                {step.number}
                            </Typography>

                            {/* Content */}
                            <Box
                                sx={{
                                    position: 'relative',
                                    zIndex: 1,
                                    p: 4,
                                    background: 'rgba(255, 255, 255, 0.02)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.05)',
                                    borderRadius: 4,
                                }}
                            >
                                <Typography
                                    variant="h5"
                                    sx={{
                                        color: 'white',
                                        fontWeight: 600,
                                        mb: 2,
                                    }}
                                >
                                    {step.title}
                                </Typography>
                                <Typography
                                    variant="body1"
                                    sx={{
                                        color: '#94a3b8',
                                        lineHeight: 1.7,
                                    }}
                                >
                                    {step.description}
                                </Typography>
                            </Box>

                            {/* Connector dot */}
                            {index < steps.length - 1 && (
                                <Box
                                    sx={{
                                        display: { xs: 'none', md: 'block' },
                                        position: 'absolute',
                                        top: '50%',
                                        right: -20,
                                        width: 8,
                                        height: 8,
                                        borderRadius: '50%',
                                        background: step.color,
                                        boxShadow: `0 0 20px ${step.color}`,
                                    }}
                                />
                            )}
                        </Box>
                    ))}
                </Stack>
            </Container>
        </Box>
    );
};

export default HowItWorks;
