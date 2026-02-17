/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import React from 'react'
import { Card, CardContent, CardHeader, CardActions } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledCard = styled(Card)(({ theme }) => ({
  backgroundColor: theme.palette.background.paper,
  borderRadius: theme.shape.borderRadius,
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.3)',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'all 0.2s ease-in-out',
  overflow: 'hidden',
  
  '&:hover': {
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.4)',
    transform: 'translateY(-2px)',
  },
  
  '& .MuiCardHeader-root': {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    borderBottom: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(3),
  },
  
  '& .MuiCardHeader-title': {
    fontSize: '1.125rem',
    fontWeight: 600,
    color: theme.palette.text.primary,
  },
  
  '& .MuiCardHeader-subheader': {
    fontSize: '0.875rem',
    color: theme.palette.text.secondary,
  },
  
  '& .MuiCardContent-root': {
    padding: theme.spacing(3),
  },
  
  '& .MuiCardActions-root': {
    padding: theme.spacing(2, 3),
    borderTop: `1px solid ${theme.palette.divider}`,
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
  },
}))

const ProfessionalCard = ({ 
  title,
  subheader,
  children,
  actions,
  headerAction,
  elevation = 1,
  sx,
  ...props 
}) => {
  return (
    <StyledCard elevation={elevation} sx={sx} {...props}>
      {(title || subheader || headerAction) && (
        <CardHeader
          title={title}
          subheader={subheader}
          action={headerAction}
        />
      )}
      {children && <CardContent>{children}</CardContent>}
      {actions && <CardActions>{actions}</CardActions>}
    </StyledCard>
  )
}

export default ProfessionalCard