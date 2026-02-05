import React from 'react'
import { Container, Typography, Box, Grid } from '@mui/material'
import { ProfessionalButton, ProfessionalCard, ProfessionalInput, StatCard } from '../components/ui'
import { AttachMoney, TrendingUp, AccountBalance, Savings } from '@mui/icons-material'

const DesignSystemDemo = () => {
  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom color="text.primary">
        Aerofisc Design System
      </Typography>

      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom color="text.secondary">
          Professional Dark Mode Theme
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Background: #121212 | Paper: #1E1E1E | Primary: #0066CC
        </Typography>
      </Box>

      {/* Buttons Section */}
      <ProfessionalCard title="Professional Buttons" sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
          <ProfessionalButton variant="contained">
            Primary Button
          </ProfessionalButton>
          <ProfessionalButton variant="outlined">
            Outlined Button
          </ProfessionalButton>
          <ProfessionalButton variant="text">
            Text Button
          </ProfessionalButton>
          <ProfessionalButton variant="contained" disabled>
            Disabled Button
          </ProfessionalButton>
        </Box>
      </ProfessionalCard>

      {/* Input Section */}
      <ProfessionalCard title="Professional Input" sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          <ProfessionalInput
            label="Email Address"
            placeholder="Enter your email"
            type="email"
          />
          <ProfessionalInput
            label="Amount"
            placeholder="0.00"
            type="number"
            startAdornment={<AttachMoney />}
          />
          <ProfessionalInput
            label="Description"
            placeholder="Enter description"
            multiline
            rows={3}
          />
          <ProfessionalInput
            label="Error Example"
            placeholder="This field has an error"
            error
            helperText="This field is required"
          />
        </Box>
      </ProfessionalCard>

      {/* Stat Cards Section */}
      <ProfessionalCard title="Stat Cards" sx={{ mb: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Income"
              value={5420}
              icon={<TrendingUp />}
              color="success"
              trend="up"
              trendValue="+12%"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Total Expenses"
              value={3280}
              icon={<AttachMoney />}
              color="error"
              trend="down"
              trendValue="-5%"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Balance"
              value={2140}
              icon={<AccountBalance />}
              color="primary"
              trend="up"
              trendValue="+8%"
            />
          </Grid>
          <Grid item xs={12} sm={6} md={3}>
            <StatCard
              title="Savings Goal"
              value={15000}
              subtitle="Target: $20,000"
              icon={<Savings />}
              color="info"
              trend="up"
              trendValue="75%"
            />
          </Grid>
        </Grid>
      </ProfessionalCard>

      {/* Color Palette */}
      <ProfessionalCard title="Color Palette">
        <Grid container spacing={2}>
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                backgroundColor: '#0066CC',
                height: 60,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            >
              Primary #0066CC
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                backgroundColor: '#1E1E1E',
                height: 60,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 500,
                border: '1px solid #2d2d2d',
              }}
            >
              Paper #1E1E1E
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                backgroundColor: '#121212',
                height: 60,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 500,
                border: '1px solid #2d2d2d',
              }}
            >
              Background #121212
            </Box>
          </Grid>
          <Grid item xs={6} sm={3}>
            <Box
              sx={{
                backgroundColor: '#4caf50',
                height: 60,
                borderRadius: 1,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontSize: '0.75rem',
                fontWeight: 500,
              }}
            >
              Success #4caf50
            </Box>
          </Grid>
        </Grid>
      </ProfessionalCard>
    </Container>
  )
}

export default DesignSystemDemo