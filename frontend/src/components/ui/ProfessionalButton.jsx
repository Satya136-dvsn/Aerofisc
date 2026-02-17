/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import React from 'react'
import { Button } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledButton = styled(Button)(({ theme, variant = 'contained' }) => ({
  borderRadius: theme.shape.borderRadius,
  textTransform: 'none',
  fontWeight: 500,
  fontSize: '0.875rem',
  padding: '8px 16px',
  minHeight: '36px',
  boxShadow: 'none',
  transition: 'all 0.2s ease-in-out',
  
  '&:hover': {
    boxShadow: theme.shadows[4],
    transform: 'translateY(-1px)',
  },
  
  '&:active': {
    transform: 'translateY(0)',
    boxShadow: theme.shadows[2],
  },
  
  '&.Mui-disabled': {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  
  ...(variant === 'contained' && {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.primary.contrastText,
    '&:hover': {
      backgroundColor: theme.palette.primary.dark,
    },
  }),
  
  ...(variant === 'outlined' && {
    borderColor: theme.palette.primary.main,
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
      borderColor: theme.palette.primary.dark,
    },
  }),
  
  ...(variant === 'text' && {
    color: theme.palette.primary.main,
    '&:hover': {
      backgroundColor: theme.palette.action.hover,
    },
  }),
}))

const ProfessionalButton = ({ 
  children, 
  variant = 'contained', 
  size = 'medium', 
  fullWidth = false, 
  disabled = false, 
  loading = false,
  startIcon,
  endIcon,
  onClick,
  sx,
  ...props 
}) => {
  return (
    <StyledButton
      variant={variant}
      size={size}
      fullWidth={fullWidth}
      disabled={disabled || loading}
      startIcon={loading ? null : startIcon}
      endIcon={loading ? null : endIcon}
      onClick={onClick}
      sx={sx}
      {...props}
    >
      {loading ? 'Loading...' : children}
    </StyledButton>
  )
}

export default ProfessionalButton