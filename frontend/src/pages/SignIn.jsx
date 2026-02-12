import React, { useState } from 'react'
import { Container, Box, Typography, Link, Alert } from '@mui/material'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { ProfessionalCard, ProfessionalInput, ProfessionalButton } from '../components/ui'
import { Email, Lock, ArrowBack } from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'

const SignIn = () => {
  const navigate = useNavigate()
  const { login } = useAuth()
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    defaultValues: {
      email: '',
      password: '',
    },
  })

  const onSubmit = async (data) => {
    setLoading(true)
    setError('')

    try {
      await login(data.email, data.password)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Invalid email or password')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', py: 4 }}>
        <ProfessionalCard
          title="Welcome Back"
          subheader="Sign in to your Aerofisc account"
          sx={{ boxShadow: 3 }}
        >
          <Box sx={{ mb: 2 }}>
            <ProfessionalButton
              variant="text"
              startIcon={<ArrowBack />}
              onClick={() => navigate('/')}
              sx={{ p: 0, minWidth: 'auto', mb: 2 }}
            >
              Back to Home
            </ProfessionalButton>
          </Box>
          {error && (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          )}

          <Box component="form" onSubmit={handleSubmit(onSubmit)} sx={{ mt: 1 }}>
            <Box sx={{ mb: 3 }}>
              <ProfessionalInput
                label="Email or Username"
                type="text"
                placeholder="Enter your email or username"
                fullWidth
                required
                startAdornment={<Email sx={{ color: 'text.secondary', mr: 1 }} />}
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email', {
                  required: 'Email or Username is required',
                })}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <ProfessionalInput
                label="Password"
                type="password"
                placeholder="Enter your password"
                fullWidth
                required
                startAdornment={<Lock sx={{ color: 'text.secondary', mr: 1 }} />}
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 6,
                    message: 'Password must be at least 6 characters',
                  },
                })}
              />
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mb: 3 }}>
              <Link
                component={RouterLink}
                to="/forgot-password"
                variant="body2"
                sx={{ textDecoration: 'none', color: 'primary.main' }}
              >
                Forgot password?
              </Link>
            </Box>

            <ProfessionalButton
              type="submit"
              fullWidth
              variant="contained"
              loading={loading}
              sx={{ mb: 2 }}
            >
              Sign In
            </ProfessionalButton>

            <Box sx={{ textAlign: 'center' }}>
              <Typography variant="body2" color="text.secondary">
                Don't have an account?{' '}
                <Link
                  component={RouterLink}
                  to="/register"
                  variant="body2"
                  sx={{ textDecoration: 'none', color: 'primary.main' }}
                >
                  Sign Up
                </Link>
              </Typography>
            </Box>
          </Box>
        </ProfessionalCard>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            By signing in, you agree to our{' '}
            <Link href="#" sx={{ color: 'primary.main', textDecoration: 'none' }}>
              Terms of Service
            </Link>{' '}
            and{' '}
            <Link href="#" sx={{ color: 'primary.main', textDecoration: 'none' }}>
              Privacy Policy
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}

export default SignIn