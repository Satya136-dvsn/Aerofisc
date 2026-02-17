/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { useState } from 'react';
import { Box, Button, Stack, Typography, IconButton, Drawer, List, ListItem, useScrollTrigger } from '@mui/material';
import { Menu as MenuIcon, Close as CloseIcon } from '@mui/icons-material';
import { Link as RouterLink } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { motion } from 'framer-motion';

const navLinks = [
    { label: 'Features', id: 'features' },
    { label: 'How It Works', id: 'how-it-works' },
    { label: 'Tech Stack', id: 'tech-stack' },
];

const Navbar = () => {
    const trigger = useScrollTrigger({ disableHysteresis: true, threshold: 50 });
    const { isAuthenticated } = useAuth();
    const [mobileOpen, setMobileOpen] = useState(false);

    const scrollToSection = (sectionId) => {
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
        setMobileOpen(false);
    };

    return (
        <>
            {/* Floating Pill Navbar - Wide & Balanced */}
            <Box
                component={motion.nav}
                initial={{ y: -100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.2 }}
                sx={{
                    position: 'fixed',
                    top: 24,
                    left: 0,
                    right: 0,
                    mx: 'auto',
                    zIndex: 1100,
                    width: { xs: 'calc(100% - 32px)', md: 'calc(100% - 64px)' },
                    maxWidth: 1000,
                }}
            >
                <Box
                    sx={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        gap: 4,
                        px: { xs: 3, md: 3 },
                        py: 1,
                        background: trigger
                            ? 'rgba(15, 23, 42, 0.9)'
                            : 'rgba(255, 255, 255, 0.05)',
                        backdropFilter: 'blur(20px)',
                        border: '1px solid rgba(255, 255, 255, 0.1)',
                        borderRadius: 100,
                        boxShadow: trigger
                            ? '0 10px 40px rgba(0, 0, 0, 0.3)'
                            : '0 4px 30px rgba(0, 0, 0, 0.1)',
                        transition: 'all 0.3s ease',
                    }}
                >
                    {/* Logo */}
                    <Box
                        component={RouterLink}
                        to="/"
                        sx={{
                            display: 'flex',
                            alignItems: 'center',
                            textDecoration: 'none',
                        }}
                    >
                        <Box
                            component="img"
                            src="/icons/logo.png"
                            alt="Aerofisc"
                            sx={{
                                height: 36,
                                width: 'auto',
                            }}
                        />
                    </Box>

                    {/* Desktop Nav Links */}
                    <Stack
                        direction="row"
                        spacing={1}
                        sx={{ display: { xs: 'none', md: 'flex' } }}
                    >
                        {navLinks.map((link) => (
                            <Button
                                key={link.id}
                                onClick={() => scrollToSection(link.id)}
                                size="small"
                                sx={{
                                    color: '#94a3b8',
                                    fontWeight: 500,
                                    fontSize: '0.95rem',
                                    px: 2.5,
                                    py: 1,
                                    borderRadius: 100,
                                    minWidth: 'auto',
                                    '&:hover': {
                                        color: 'white',
                                        bgcolor: 'rgba(255, 255, 255, 0.1)',
                                    },
                                }}
                            >
                                {link.label}
                            </Button>
                        ))}
                    </Stack>

                    {/* Auth Buttons */}
                    <Stack direction="row" spacing={1.5} sx={{ display: { xs: 'none', md: 'flex' } }}>
                        {isAuthenticated ? (
                            <Button
                                component={RouterLink}
                                to="/dashboard"
                                size="small"
                                sx={{
                                    px: 3,
                                    py: 1,
                                    fontWeight: 600,
                                    fontSize: '0.95rem',
                                    borderRadius: 100,
                                    background: 'white',
                                    color: '#030712',
                                    '&:hover': { background: '#e2e8f0' },
                                }}
                            >
                                Dashboard
                            </Button>
                        ) : (
                            <>
                                <Button
                                    component={RouterLink}
                                    to="/login"
                                    size="small"
                                    sx={{
                                        color: '#94a3b8',
                                        fontWeight: 500,
                                        fontSize: '0.95rem',
                                        px: 2.5,
                                        '&:hover': { color: 'white' },
                                    }}
                                >
                                    Sign In
                                </Button>
                                <Button
                                    component={RouterLink}
                                    to="/register"
                                    size="small"
                                    sx={{
                                        px: 3,
                                        py: 1,
                                        fontWeight: 600,
                                        fontSize: '0.95rem',
                                        borderRadius: 100,
                                        background: 'white',
                                        color: '#030712',
                                        '&:hover': { background: '#e2e8f0' },
                                    }}
                                >
                                    Get Started
                                </Button>
                            </>
                        )}
                    </Stack>

                    {/* Mobile Menu Button */}
                    <IconButton
                        sx={{ display: { md: 'none' }, color: 'white', p: 0.5 }}
                        onClick={() => setMobileOpen(true)}
                    >
                        <MenuIcon />
                    </IconButton>
                </Box>
            </Box>

            {/* Mobile Drawer */}
            <Drawer
                anchor="right"
                open={mobileOpen}
                onClose={() => setMobileOpen(false)}
                PaperProps={{
                    sx: {
                        width: 280,
                        background: 'rgba(3, 7, 18, 0.98)',
                        backdropFilter: 'blur(20px)',
                    },
                }}
            >
                <Box sx={{ p: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 4 }}>
                        <IconButton onClick={() => setMobileOpen(false)} sx={{ color: 'white' }}>
                            <CloseIcon />
                        </IconButton>
                    </Box>
                    <List>
                        {navLinks.map((link) => (
                            <ListItem
                                key={link.id}
                                button
                                onClick={() => scrollToSection(link.id)}
                                sx={{ py: 2, borderRadius: 2 }}
                            >
                                <Typography sx={{ color: 'white', fontWeight: 500 }}>{link.label}</Typography>
                            </ListItem>
                        ))}
                    </List>
                    <Stack spacing={2} sx={{ mt: 4 }}>
                        <Button
                            component={RouterLink}
                            to="/login"
                            fullWidth
                            variant="outlined"
                            sx={{
                                py: 1.5,
                                borderRadius: 100,
                                borderColor: 'rgba(255, 255, 255, 0.2)',
                                color: 'white',
                            }}
                        >
                            Sign In
                        </Button>
                        <Button
                            component={RouterLink}
                            to="/register"
                            fullWidth
                            variant="contained"
                            sx={{
                                py: 1.5,
                                borderRadius: 100,
                                background: 'white',
                                color: '#030712',
                            }}
                        >
                            Get Started
                        </Button>
                    </Stack>
                </Box>
            </Drawer>
        </>
    );
};

export default Navbar;
