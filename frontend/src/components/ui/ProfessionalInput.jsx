/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import React from 'react'
import { TextField } from '@mui/material'
import { styled } from '@mui/material/styles'

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    borderRadius: theme.shape.borderRadius,
    transition: 'all 0.2s ease-in-out',

    '& fieldset': {
      borderColor: '#2d2d2d',
      borderWidth: '1px',
    },

    '&:hover': {
      backgroundColor: 'rgba(255, 255, 255, 0.08)',
      '& fieldset': {
        borderColor: theme.palette.primary.main,
      },
    },

    '&.Mui-focused': {
      backgroundColor: 'rgba(255, 255, 255, 0.12)',
      '& fieldset': {
        borderColor: theme.palette.primary.main,
        borderWidth: '2px',
      },
    },

    '&.Mui-error': {
      '& fieldset': {
        borderColor: theme.palette.error.main,
      },
    },

    '& input': {
      color: theme.palette.text.primary,
      padding: '12px 16px',
      fontSize: '0.875rem',
    },

    '& textarea': {
      color: theme.palette.text.primary,
      padding: '12px 16px',
      fontSize: '0.875rem',
    },
  },

  '& .MuiInputLabel-root': {
    color: theme.palette.text.secondary,
    fontSize: '0.875rem',
    transform: 'translate(14px, 12px) scale(1)',

    '&.Mui-focused': {
      color: theme.palette.primary.main,
    },

    '&.Mui-error': {
      color: theme.palette.error.main,
    },
  },

  '& .MuiInputLabel-root.MuiInputLabel-shrink': {
    transform: 'translate(14px, -6px) scale(0.75)',
  },

  '& .MuiFormHelperText-root': {
    color: theme.palette.text.secondary,
    fontSize: '0.75rem',
    marginLeft: 0,
    marginTop: '4px',

    '&.Mui-error': {
      color: theme.palette.error.main,
    },
  },

  '& .MuiInputAdornment-root': {
    color: theme.palette.text.secondary,
  },
}))

const ProfessionalInput = React.forwardRef(({
  label,
  type = 'text',
  placeholder,
  value,
  onChange,
  error,
  helperText,
  required = false,
  disabled = false,
  multiline = false,
  rows = 1,
  fullWidth = true,
  startAdornment,
  endAdornment,
  sx,
  ...props
}, ref) => {
  return (
    <StyledTextField
      inputRef={ref}
      label={label}
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      error={error}
      helperText={helperText}
      required={required}
      disabled={disabled}
      multiline={multiline}
      rows={rows}
      fullWidth={fullWidth}
      InputProps={{
        startAdornment,
        endAdornment,
      }}
      variant="outlined"
      sx={sx}
      {...props}
    />
  )
})

ProfessionalInput.displayName = 'ProfessionalInput'

export default ProfessionalInput