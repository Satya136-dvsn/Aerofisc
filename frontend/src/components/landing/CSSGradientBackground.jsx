/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import React from 'react';
import { Box } from '@mui/material';
import { motion } from 'framer-motion';

const CSSGradientBackground = () => {
    return (
        <Box
            sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                overflow: 'hidden',
                zIndex: 0,
                background: '#030712', // Deep dark base
            }}
        >
            {/* Orb 1: Primary Blue */}
            <Box
                component={motion.div}
                animate={{
                    x: [0, 100, -50, 0],
                    y: [0, -50, 50, 0],
                    scale: [1, 1.2, 0.9, 1],
                }}
                transition={{ duration: 20, repeat: Infinity, ease: 'easeInOut' }}
                sx={{
                    position: 'absolute',
                    top: '-10%',
                    left: '10%',
                    width: '60vw',
                    height: '60vw',
                    maxHeight: '800px',
                    maxWidth: '800px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(59,130,246,0.15) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(80px)',
                }}
            />

            {/* Orb 2: Secondary Violet */}
            <Box
                component={motion.div}
                animate={{
                    x: [0, -70, 30, 0],
                    y: [0, 60, -40, 0],
                    scale: [1, 1.1, 0.95, 1],
                }}
                transition={{ duration: 25, repeat: Infinity, ease: 'easeInOut' }}
                sx={{
                    position: 'absolute',
                    bottom: '10%',
                    right: '5%',
                    width: '50vw',
                    height: '50vw',
                    maxHeight: '700px',
                    maxWidth: '700px',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(139,92,246,0.15) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(80px)',
                }}
            />

            {/* Orb 3: Accent Cyan (Smaller) */}
            <Box
                component={motion.div}
                animate={{
                    x: [0, 50, -50, 0],
                    opacity: [0.3, 0.6, 0.3],
                }}
                transition={{ duration: 15, repeat: Infinity, ease: 'easeInOut' }}
                sx={{
                    position: 'absolute',
                    top: '40%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    width: '40vw',
                    height: '40vw',
                    borderRadius: '50%',
                    background: 'radial-gradient(circle, rgba(6,182,212,0.1) 0%, rgba(0,0,0,0) 70%)',
                    filter: 'blur(100px)',
                }}
            />

            {/* Grid Overlay for "Tech" feel */}
            <Box
                sx={{
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
                    backgroundSize: '100px 100px',
                    opacity: 0.5,
                }}
            />
        </Box>
    );
};

export default CSSGradientBackground;
