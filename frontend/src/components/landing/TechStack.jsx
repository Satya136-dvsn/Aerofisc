import { Box, Container, Typography, Stack } from '@mui/material';
import { motion } from 'framer-motion';

const technologies = [
    { name: 'React', color: '#61dafb' },
    { name: 'Spring Boot', color: '#6db33f' },
    { name: 'Material UI', color: '#007fff' },
    { name: 'MySQL', color: '#4479a1' },
    { name: 'Java 21', color: '#f89820' },
    { name: 'Framer Motion', color: '#ff0055' },
    { name: 'Vite', color: '#646cff' },
    { name: 'JWT', color: '#fb015b' },
];

const TechStack = () => {
    return (
        <Box
            component="section"
            id="tech-stack"
            sx={{
                py: { xs: 12, md: 16 },
                background: '#030712',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Gradient overlay */}
            <Box
                sx={{
                    position: 'absolute',
                    inset: 0,
                    background: 'radial-gradient(ellipse 80% 40% at 50% 100%, rgba(59, 130, 246, 0.08) 0%, transparent 60%)',
                    zIndex: 0,
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                {/* Header */}
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
                            color: '#34d399',
                            letterSpacing: 3,
                            fontSize: '0.8rem',
                            fontWeight: 600,
                            mb: 2,
                            display: 'block',
                        }}
                    >
                        TECH STACK
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
                        Built with{' '}
                        <Box
                            component="span"
                            sx={{
                                background: 'linear-gradient(135deg, #34d399 0%, #60a5fa 100%)',
                                WebkitBackgroundClip: 'text',
                                WebkitTextFillColor: 'transparent',
                            }}
                        >
                            modern tech
                        </Box>
                    </Typography>
                    <Typography
                        variant="body1"
                        sx={{ color: '#64748b', fontSize: '1.1rem' }}
                    >
                        Production-grade architecture you can trust.
                    </Typography>
                </Box>

                {/* Marquee effect */}
                <Box
                    sx={{
                        position: 'relative',
                        overflow: 'hidden',
                        '&::before, &::after': {
                            content: '""',
                            position: 'absolute',
                            top: 0,
                            bottom: 0,
                            width: 100,
                            zIndex: 2,
                        },
                        '&::before': {
                            left: 0,
                            background: 'linear-gradient(to right, #030712, transparent)',
                        },
                        '&::after': {
                            right: 0,
                            background: 'linear-gradient(to left, #030712, transparent)',
                        },
                    }}
                >
                    <Box
                        component={motion.div}
                        animate={{ x: [0, -1000] }}
                        transition={{
                            duration: 20,
                            repeat: Infinity,
                            ease: 'linear',
                        }}
                        sx={{ display: 'flex', gap: 4, width: 'max-content' }}
                    >
                        {/* Duplicate for seamless loop */}
                        {[...technologies, ...technologies, ...technologies].map((tech, index) => (
                            <Box
                                key={`${tech.name}-${index}`}
                                sx={{
                                    px: 4,
                                    py: 2.5,
                                    background: 'rgba(255, 255, 255, 0.03)',
                                    backdropFilter: 'blur(10px)',
                                    border: '1px solid rgba(255, 255, 255, 0.06)',
                                    borderRadius: 3,
                                    display: 'flex',
                                    alignItems: 'center',
                                    gap: 2,
                                    whiteSpace: 'nowrap',
                                }}
                            >
                                <Box
                                    sx={{
                                        width: 10,
                                        height: 10,
                                        borderRadius: '50%',
                                        background: tech.color,
                                        boxShadow: `0 0 15px ${tech.color}`,
                                    }}
                                />
                                <Typography
                                    sx={{
                                        color: 'white',
                                        fontWeight: 500,
                                        fontSize: '1rem',
                                    }}
                                >
                                    {tech.name}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            </Container>
        </Box>
    );
};

export default TechStack;
