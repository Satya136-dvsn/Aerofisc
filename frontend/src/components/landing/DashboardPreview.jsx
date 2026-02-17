/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { Box, Container, Typography, Paper, Chip, Stack } from '@mui/material';
import { motion } from 'framer-motion';

const DashboardPreview = () => {
    return (
        <Box
            component="section"
            sx={{
                py: { xs: 10, md: 15 },
                background: '#030712',
                position: 'relative',
                overflow: 'hidden',
            }}
        >
            {/* Background gradient */}
            <Box
                sx={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '80%',
                    height: '60%',
                    background: 'radial-gradient(ellipse, rgba(59, 130, 246, 0.08) 0%, transparent 70%)',
                    zIndex: 0,
                }}
            />

            <Container maxWidth="lg" sx={{ position: 'relative', zIndex: 1 }}>
                {/* Section Header */}
                <Box sx={{ textAlign: 'center', mb: 6 }}>
                    <Typography
                        variant="h2"
                        sx={{
                            fontSize: { xs: '2rem', md: '3rem' },
                            fontWeight: 700,
                            color: 'white',
                            mb: 2,
                        }}
                    >
                        See It In Action
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
                        A clean, intuitive dashboard that puts your financial data at your fingertips.
                    </Typography>
                </Box>

                {/* Dashboard Mockup */}
                <Paper
                    component={motion.div}
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    elevation={0}
                    sx={{
                        p: 2,
                        background: 'linear-gradient(135deg, rgba(30, 41, 59, 0.8) 0%, rgba(15, 23, 42, 0.9) 100%)',
                        border: '1px solid rgba(148, 163, 184, 0.15)',
                        borderRadius: 4,
                        overflow: 'hidden',
                    }}
                >
                    {/* Browser bar mockup */}
                    <Box
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            gap: 1,
                            mb: 2,
                            pb: 2,
                            borderBottom: '1px solid rgba(148, 163, 184, 0.1)',
                        }}
                    >
                        <Box sx={{ display: 'flex', gap: 0.8 }}>
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#ef4444' }} />
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#f59e0b' }} />
                            <Box sx={{ width: 12, height: 12, borderRadius: '50%', bgcolor: '#10b981' }} />
                        </Box>
                        <Box
                            sx={{
                                flex: 1,
                                mx: 4,
                                py: 0.8,
                                px: 2,
                                bgcolor: 'rgba(15, 23, 42, 0.5)',
                                borderRadius: 2,
                                textAlign: 'center',
                            }}
                        >
                            <Typography variant="caption" sx={{ color: '#64748b' }}>
                                aerofisc.vercel.app/dashboard
                            </Typography>
                        </Box>
                    </Box>

                    {/* Dashboard Image */}
                    <Box
                        component="img"
                        src="/assets/dashboard-mockup.png"
                        alt="Aerofisc Dashboard Preview"
                        sx={{
                            width: '100%',
                            height: 'auto',
                            borderRadius: 2,
                            display: 'block',
                        }}
                        onError={(e) => {
                            // Fallback if image doesn't exist
                            e.target.style.display = 'none';
                            e.target.parentElement.innerHTML += `
                <div style="
                  min-height: 400px;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                  border-radius: 8px;
                  color: #64748b;
                  font-size: 1rem;
                ">
                  Dashboard preview available in live demo
                </div>
              `;
                        }}
                    />
                </Paper>

                {/* Feature callouts */}
                <Stack
                    direction={{ xs: 'column', sm: 'row' }}
                    spacing={2}
                    justifyContent="center"
                    sx={{ mt: 4 }}
                >
                    <Chip
                        label="📊 Real-time Analytics"
                        sx={{
                            bgcolor: 'rgba(59, 130, 246, 0.1)',
                            color: '#60a5fa',
                            border: '1px solid rgba(59, 130, 246, 0.2)',
                        }}
                    />
                    <Chip
                        label="🤖 AI Insights"
                        sx={{
                            bgcolor: 'rgba(139, 92, 246, 0.1)',
                            color: '#a78bfa',
                            border: '1px solid rgba(139, 92, 246, 0.2)',
                        }}
                    />
                    <Chip
                        label="📈 Trend Visualization"
                        sx={{
                            bgcolor: 'rgba(16, 185, 129, 0.1)',
                            color: '#34d399',
                            border: '1px solid rgba(16, 185, 129, 0.2)',
                        }}
                    />
                </Stack>
            </Container>
        </Box>
    );
};

export default DashboardPreview;
