/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import React from 'react'
import { Card, CardContent, Typography, Box } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  border: '1px solid #2d2d2d',
  transition: 'all 0.2s ease-in-out',
  height: '100%',
  
  '&:hover': {
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
    transform: 'translateY(-2px)',
  },
  
  '& .MuiCardContent-root': {
    padding: theme.spacing(3),
    '&:last-child': {
      paddingBottom: theme.spacing(3),
    },
  },
}))

const IconWrapper = styled(Box)(({ theme, color = 'primary' }) => ({
  width: 48,
  height: 48,
  borderRadius: '50%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: theme.palette[color].main + '20',
  color: theme.palette[color].main,
  marginBottom: theme.spacing(2),
  
  '& svg': {
    width: 24,
    height: 24,
  },
}))

const TrendIndicator = styled(Box)(({ theme, trend }) => ({
  display: 'inline-flex',
  alignItems: 'center',
  fontSize: '0.75rem',
  fontWeight: 500,
  color: trend === 'up' ? theme.palette.success.main : theme.palette.error.main,
  
  '&::before': {
    content: trend === 'up' ? '"↗"' : '"↘"',
    marginRight: '4px',
    fontSize: '0.875rem',
  },
}))

const StatCard = ({ 
  title,
  value,
  subtitle,
  icon,
  color = 'primary',
  trend,
  trendValue,
  loading = false,
  sx,
  ...props 
}) => {
  const formatValue = (value) => {
    if (typeof value === 'number') {
      return new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        minimumFractionDigits: 0,
        maximumFractionDigits: 0,
      }).format(value)
    }
    return value
  }
  
  return (
    <StyledCard sx={sx} {...props}>
      <CardContent>
        {icon && (
          <IconWrapper color={color}>
            {icon}
          </IconWrapper>
        )}
        
        <Typography 
          variant="h6" 
          component="div" 
          color="text.secondary"
          gutterBottom
          sx={{ fontSize: '0.875rem', fontWeight: 500 }}
        >
          {title}
        </Typography>
        
        <Typography 
          variant="h4" 
          component="div" 
          color="text.primary"
          sx={{ 
            fontSize: '1.875rem', 
            fontWeight: 700,
            mb: 1,
          }}
        >
          {loading ? '...' : formatValue(value)}
        </Typography>
        
        {subtitle && (
          <Typography 
            variant="body2" 
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            {subtitle}
          </Typography>
        )}
        
        {trend && trendValue && (
          <TrendIndicator trend={trend}>
            {trendValue}
          </TrendIndicator>
        )}
      </CardContent>
    </StyledCard>
  )
}

export default StatCard