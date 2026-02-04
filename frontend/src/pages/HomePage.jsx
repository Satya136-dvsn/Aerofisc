import React from 'react'
import { Container, Box, Typography, Grid, Card, CardContent } from '@mui/material'
import { Link as RouterLink } from 'react-router-dom'
import { ProfessionalButton } from '../components/ui'
import SEO from '../components/SEO'
import { TrendingUp, AttachMoney, Assessment, Security, Speed, Group } from '@mui/icons-material'

const HomePage = () => {
  const features = [
    {
      icon: <TrendingUp sx={{ fontSize: 40, color: 'primary.main' }} />,
      title: 'Smart Budgeting',
      description: 'Track income and expenses with intelligent categorization and insights.',
    },
    {
      icon: <Assessment sx={{ fontSize: 40, color: 'success.main' }} />,
      title: 'AI-Powered Analytics',
      description: 'Get personalized financial advice and spending predictions.',
    },
    {
      icon: <AttachMoney sx={{ fontSize: 40, color: 'warning.main' }} />,
      title: 'Savings Goals',
      description: 'Set and track savings goals with visual progress indicators.',
    },
    {
      icon: <Security sx={{ fontSize: 40, color: 'info.main' }} />,
      title: 'Bank-Level Security',
      description: 'Your financial data is encrypted and protected with enterprise-grade security.',
    },
    {
      icon: <Speed sx={{ fontSize: 40, color: 'secondary.main' }} />,
      title: 'Real-Time Updates',
      description: 'Get instant notifications and live updates on your financial activities.',
    },
    {
      icon: <Group sx={{ fontSize: 40, color: 'primary.light' }} />,
      title: 'Community Support',
      description: 'Connect with other users and share financial tips and experiences.',
    },
  ]

  return (
    <Box sx={{ minHeight: '100vh', backgroundColor: 'background.default' }}>
      <SEO
        title="Best Free AI Expense Tracker & Budget Planner 2024"
        description="Take control of your finances with BudgetWise. The #1 Free AI-powered expense tracker, budgeting app, and recurring bill manager for 2024."
      />
      {/* Hero Section */}
      <Box
        sx={{
          background: 'linear-gradient(135deg, #0066CC 0%, #004d99 100%)',
          color: 'white',
          py: 8,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="lg">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            sx={{ fontWeight: 700, mb: 2 }}
          >
            Take Control with the Best Personal Finance Tracker
          </Typography>
          <Typography
            variant="h5"
            component="p"
            sx={{ mb: 4, opacity: 0.9, maxWidth: 600, mx: 'auto' }}
          >
            PennyPilot is your all-in-one financial autopilot. Track daily spending, set secure budgets, and automate your wealth with AI-powered insights.
          </Typography>
          <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', flexWrap: 'wrap' }}>
            <ProfessionalButton
              component={RouterLink}
              to="/register"
              variant="contained"
              size="large"
              sx={{
                backgroundColor: 'white',
                color: 'primary.main',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.9)' }
              }}
            >
              Get Started Free
            </ProfessionalButton>
            <ProfessionalButton
              component={RouterLink}
              to="/login"
              variant="outlined"
              size="large"
              sx={{
                borderColor: 'white',
                color: 'white',
                '&:hover': { backgroundColor: 'rgba(255,255,255,0.1)' }
              }}
            >
              Sign In
            </ProfessionalButton>
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography
          variant="h3"
          component="h2"
          textAlign="center"
          gutterBottom
          sx={{ fontWeight: 600, mb: 6 }}
        >
          Everything You Need to Succeed
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid item xs={12} sm={6} md={4} key={index}>
              <Card
                sx={{
                  height: '100%',
                  textAlign: 'center',
                  p: 3,
                  backgroundColor: 'background.paper',
                  border: '1px solid #2d2d2d',
                  transition: 'transform 0.2s ease-in-out',
                  '&:hover': {
                    transform: 'translateY(-4px)',
                    boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
                  },
                }}
              >
                <CardContent>
                  <Box sx={{ mb: 2 }}>
                    {feature.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    component="h3"
                    gutterBottom
                    sx={{ fontWeight: 600 }}
                  >
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          backgroundColor: 'background.paper',
          borderTop: '1px solid #2d2d2d',
          py: 6,
          textAlign: 'center',
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h4"
            component="h2"
            gutterBottom
            sx={{ fontWeight: 600 }}
          >
            Ready to Transform Your Finances?
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
            sx={{ mb: 4, fontSize: '1.125rem' }}
          >
            Join thousands of users who are already managing their money smarter with BudgetWise.
          </Typography>
          <ProfessionalButton
            component={RouterLink}
            to="/register"
            variant="contained"
            size="large"
          >
            Start Your Free Trial
          </ProfessionalButton>
        </Container>
      </Box>
    </Box>
  )
}

export default HomePage