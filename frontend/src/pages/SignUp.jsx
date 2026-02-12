import React, { useState } from 'react'
import { Container, Box, Typography, Stepper, Step, StepLabel, Alert, Link, FormControl, InputLabel, Select, MenuItem } from '@mui/material'
import { useNavigate, Link as RouterLink } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { ProfessionalCard, ProfessionalInput, ProfessionalButton } from '../components/ui'
import { Person, Email, Lock, Business, AttachMoney, Work, ArrowBack } from '@mui/icons-material'
import { useAuth } from '../context/AuthContext'

const steps = ['Basic Info', 'Account Setup', 'Financial Profile']

const SignUp = () => {
  const navigate = useNavigate()
  const { register: registerUser } = useAuth()
  const [activeStep, setActiveStep] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const {
    register,
    handleSubmit,
    watch,
    control,
    formState: { errors },
    trigger,
  } = useForm({
    defaultValues: {
      username: '',
      firstName: '',
      lastName: '',
      role: 'USER',
      email: '',
      password: '',
      confirmPassword: '',
      monthlyIncome: '',
      savingsTarget: '',
    },
    mode: 'onBlur',
  })

  const watchPassword = watch('password')

  const handleNext = async () => {
    let fieldsToValidate = []

    switch (activeStep) {
      case 0:
        fieldsToValidate = ['firstName', 'lastName', 'role']
        break
      case 1:
        fieldsToValidate = ['username', 'email', 'password', 'confirmPassword']
        break
      case 2:
        fieldsToValidate = ['monthlyIncome', 'savingsTarget']
        break
      default:
        break
    }

    const isValid = await trigger(fieldsToValidate)
    if (isValid) {
      setActiveStep((prevStep) => prevStep + 1)
    }
  }

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1)
  }

  const onSubmit = async (data) => {
    setLoading(true)
    setError('')

    try {
      const userData = {
        username: data.username,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
        email: data.email,
        password: data.password,
        monthlyIncome: parseFloat(data.monthlyIncome),
        savingsTarget: parseFloat(data.savingsTarget),
      }

      await registerUser(userData)
      navigate('/dashboard')
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const getStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Box>
            <Box sx={{ mb: 3 }}>
              <ProfessionalInput
                key="firstName"
                label="First Name"
                placeholder="Enter your first name"
                fullWidth
                required
                startAdornment={<Person sx={{ color: 'text.secondary', mr: 1 }} />}
                error={!!errors.firstName}
                helperText={errors.firstName?.message}
                {...register('firstName', {
                  required: 'First name is required',
                  minLength: {
                    value: 2,
                    message: 'First name must be at least 2 characters',
                  },
                })}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <ProfessionalInput
                key="lastName"
                label="Last Name"
                placeholder="Enter your last name"
                fullWidth
                required
                startAdornment={<Person sx={{ color: 'text.secondary', mr: 1 }} />}
                error={!!errors.lastName}
                helperText={errors.lastName?.message}
                {...register('lastName', {
                  required: 'Last name is required',
                  minLength: {
                    value: 2,
                    message: 'Last name must be at least 2 characters',
                  },
                })}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <Controller
                name="role"
                control={control}
                rules={{ required: 'Role is required' }}
                render={({ field }) => (
                  <FormControl fullWidth error={!!errors.role}>
                    <InputLabel>Role</InputLabel>
                    <Select
                      {...field}
                      label="Role"
                    >
                      <MenuItem value="USER">User</MenuItem>
                      <MenuItem value="PROFESSIONAL">Professional</MenuItem>
                    </Select>
                    {errors.role && (
                      <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 1.75 }}>
                        {errors.role.message}
                      </Typography>
                    )}
                  </FormControl>
                )}
              />
            </Box>
          </Box>
        )

      case 1:
        return (
          <Box>
            <Box sx={{ mb: 3 }}>
              <ProfessionalInput
                key="username"
                label="Username"
                placeholder="Choose a username"
                fullWidth
                required
                startAdornment={<Person sx={{ color: 'text.secondary', mr: 1 }} />}
                error={!!errors.username}
                helperText={errors.username?.message}
                {...register('username', {
                  required: 'Username is required',
                  minLength: {
                    value: 3,
                    message: 'Username must be at least 3 characters',
                  },
                  maxLength: {
                    value: 20,
                    message: 'Username must be less than 20 characters',
                  },
                })}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <ProfessionalInput
                key="email"
                label="Email Address"
                type="email"
                placeholder="Enter your email"
                fullWidth
                required
                startAdornment={<Email sx={{ color: 'text.secondary', mr: 1 }} />}
                error={!!errors.email}
                helperText={errors.email?.message}
                {...register('email', {
                  required: 'Email is required',
                  pattern: {
                    value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                    message: 'Invalid email address',
                  },
                })}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <ProfessionalInput
                key="password"
                label="Password"
                type="password"
                placeholder="Create a strong password"
                fullWidth
                required
                startAdornment={<Lock sx={{ color: 'text.secondary', mr: 1 }} />}
                error={!!errors.password}
                helperText={errors.password?.message}
                {...register('password', {
                  required: 'Password is required',
                  minLength: {
                    value: 8,
                    message: 'Password must be at least 8 characters',
                  },
                  pattern: {
                    value: /^(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[@#$%^&+=!]).*$/,
                    message: 'Password must contain uppercase, lowercase, number and special char',
                  },
                })}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <ProfessionalInput
                key="confirmPassword"
                label="Confirm Password"
                type="password"
                placeholder="Confirm your password"
                fullWidth
                required
                startAdornment={<Lock sx={{ color: 'text.secondary', mr: 1 }} />}
                error={!!errors.confirmPassword}
                helperText={errors.confirmPassword?.message}
                {...register('confirmPassword', {
                  required: 'Please confirm your password',
                  validate: value => value === watchPassword || 'Passwords do not match',
                })}
              />
            </Box>
          </Box>
        )

      case 2:
        return (
          <Box>
            <Box sx={{ mb: 3 }}>
              <ProfessionalInput
                key="monthlyIncome"
                label="Monthly Income"
                type="number"
                placeholder="Enter your monthly income"
                fullWidth
                required
                startAdornment={<AttachMoney sx={{ color: 'text.secondary', mr: 1 }} />}
                error={!!errors.monthlyIncome}
                helperText={errors.monthlyIncome?.message}
                {...register('monthlyIncome', {
                  required: 'Monthly income is required',
                  min: {
                    value: 0,
                    message: 'Income must be positive',
                  },
                })}
              />
            </Box>

            <Box sx={{ mb: 3 }}>
              <ProfessionalInput
                key="savingsTarget"
                label="Monthly Savings Target"
                type="number"
                placeholder="Enter your savings target"
                fullWidth
                required
                startAdornment={<AttachMoney sx={{ color: 'text.secondary', mr: 1 }} />}
                error={!!errors.savingsTarget}
                helperText={errors.savingsTarget?.message}
                {...register('savingsTarget', {
                  required: 'Savings target is required',
                  min: {
                    value: 0,
                    message: 'Savings target must be positive',
                  },
                })}
              />
            </Box>

            <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
              This information helps us provide personalized budget recommendations and track your financial goals.
            </Typography>
          </Box>
        )

      default:
        return 'Unknown step'
    }
  }

  return (
    <Container component="main" maxWidth="sm" sx={{ minHeight: '100vh', display: 'flex', alignItems: 'center' }}>
      <Box sx={{ width: '100%', py: 4 }}>
        <ProfessionalCard
          title="Create Your Account"
          subheader="Join Aerofisc to manage your finances smarter"
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

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Box component="form" onSubmit={handleSubmit(onSubmit)}>
            {getStepContent(activeStep)}

            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <ProfessionalButton
                variant="outlined"
                onClick={handleBack}
                disabled={activeStep === 0}
              >
                Back
              </ProfessionalButton>

              {activeStep === steps.length - 1 ? (
                <ProfessionalButton
                  type="submit"
                  variant="contained"
                  loading={loading}
                >
                  Create Account
                </ProfessionalButton>
              ) : (
                <ProfessionalButton
                  variant="contained"
                  onClick={handleNext}
                >
                  Next
                </ProfessionalButton>
              )}
            </Box>
          </Box>
        </ProfessionalCard>

        <Box sx={{ mt: 4, textAlign: 'center' }}>
          <Typography variant="body2" color="text.secondary">
            Already have an account?{' '}
            <Link
              component={RouterLink}
              to="/login"
              variant="body2"
              sx={{ textDecoration: 'none', color: 'primary.main' }}
            >
              Sign In
            </Link>
          </Typography>
        </Box>
      </Box>
    </Container>
  )
}

export default SignUp