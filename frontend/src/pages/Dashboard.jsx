import { useState, useEffect, useRef } from 'react';
import html2canvas from 'html2canvas';
import { useNavigate } from 'react-router-dom';
import {
  Container, Grid, Typography, Box, Alert, Fade, Skeleton, List, ListItem, ListItemText, Button, Chip, Paper,
} from '@mui/material';
import {
  TrendingUp as IncomeIcon, TrendingDown as ExpenseIcon, AccountBalance as BalanceIcon, Savings as SavingsIcon,
  ShowChart as ChartIcon, PieChart as PieChartIcon, Receipt as TransactionsIcon, ArrowForward as ArrowForwardIcon,
  AutoAwesome as AutoAwesomeIcon,
} from '@mui/icons-material';
import { LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import StatCard from '../components/ui/StatCard';
import ProfessionalCard from '../components/ui/ProfessionalCard';
import ExportMenu from '../components/common/ExportMenu';
import dashboardService from '../services/dashboardService';
import exportService from '../services/exportService';
import { getCategoryColor } from '../utils/categoryColors';
import { formatCurrency, formatDate } from '../utils/formatters';

const Dashboard = () => {
  const navigate = useNavigate();
  const dashboardRef = useRef(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [summary, setSummary] = useState(null);
  const [monthlyTrends, setMonthlyTrends] = useState([]);
  const [categoryBreakdown, setCategoryBreakdown] = useState([]);
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [isExporting, setIsExporting] = useState(false);

  useEffect(() => {
    loadDashboardData();
    const handleUpdate = () => loadDashboardData();
    window.addEventListener('transaction-updated', handleUpdate);
    return () => window.removeEventListener('transaction-updated', handleUpdate);
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      const [summaryRes, trendsRes, categoryRes, transactionsRes] = await Promise.all([
        dashboardService.getSummary(), dashboardService.getMonthlyTrends(), dashboardService.getCategoryBreakdown(), dashboardService.getRecentTransactions(),
      ]);
      setSummary(summaryRes.data);
      setMonthlyTrends(trendsRes.data);
      setCategoryBreakdown(categoryRes.data);
      setRecentTransactions(transactionsRes.data);
      setError('');
    } catch (err) {
      console.error('Dashboard load error:', err);
      if (err.response?.status === 403 || err.response?.status === 401) return;
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  const handleExport = async (format) => {
    try {
      setIsExporting(true);
      await exportService.exportDashboard(format);
    } catch (err) {
      console.error('Export failed:', err);
    } finally {
      setIsExporting(false);
    }
  };


  if (loading && !isExporting) {
    return (
      <Container maxWidth="xl" sx={{ pb: 4 }}>
        <Skeleton variant="text" width={200} height={50} sx={{ mb: 3 }} />
        <Grid container spacing={3} sx={{ mb: 4 }}>
          {[1, 2, 3, 4].map((i) => (
            <Grid item xs={12} sm={6} md={3} key={i}>
              <Skeleton variant="rectangular" height={140} sx={{ borderRadius: 1 }} />
            </Grid>
          ))}
        </Grid>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ pb: 4 }} ref={dashboardRef}>
      <Fade in timeout={300}>
        <Box mb={4} display="flex" justifyContent="space-between" alignItems="center">
          <Box>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 0.5 }}>Dashboard</Typography>
            <Typography variant="body2" color="text.secondary">Your financial overview at a glance</Typography>
          </Box>
          <ExportMenu
            formats={['excel', 'pdf']}
            onExport={handleExport}
          />
        </Box>
      </Fade>

      {error && (
        <Fade in timeout={300}>
          <Alert severity="error" sx={{ mb: 3 }} onClose={() => setError('')}>{error}</Alert>
        </Fade>
      )}

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <Fade in timeout={400}>
            <Box><StatCard title="Total Income" value={summary?.totalIncome ?? 0} subtitle="This Month" icon={<IncomeIcon />} color="success" loading={loading} /></Box>
          </Fade>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Fade in timeout={500}>
            <Box><StatCard title="Total Expenses" value={summary?.totalExpenses ?? 0} subtitle="This Month" icon={<ExpenseIcon />} color="error" loading={loading} /></Box>
          </Fade>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Fade in timeout={600}>
            <Box><StatCard title="Current Balance" value={summary?.balance ?? 0} subtitle="Available Now" icon={<BalanceIcon />} color="primary" loading={loading} /></Box>
          </Fade>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Fade in timeout={700}>
            <Box><StatCard title="Savings Rate" value={summary?.savingsRate != null ? `${summary.savingsRate.toFixed(1)}%` : '--'} subtitle="Of Total Income" icon={<SavingsIcon />} color="secondary" loading={loading} /></Box>
          </Fade>
        </Grid>

      </Grid>

      {/* AI Insight Banner */}
      <Fade in timeout={750}>
        <Box sx={{ mb: 4 }}>
          <Paper
            elevation={0}
            sx={{
              p: 3,
              borderRadius: 2,
              background: 'linear-gradient(135deg, #1a237e 0%, #0d47a1 100%)',
              color: 'white',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: 2,
              position: 'relative',
              overflow: 'hidden',
              boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
            }}
          >
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, zIndex: 1 }}>
              <Box
                sx={{
                  p: 1.5,
                  borderRadius: '50%',
                  bgcolor: 'rgba(255,255,255,0.15)',
                  display: 'flex'
                }}
              >
                <AutoAwesomeIcon sx={{ fontSize: 32 }} />
              </Box>
              <Box>
                <Typography variant="overline" sx={{ opacity: 0.8, letterSpacing: 1, color: 'rgba(255,255,255,0.9)' }}>
                  AI Financial Insight
                </Typography>
                <Typography variant="h5" fontWeight="bold" sx={{ color: 'white' }}>
                  Predicted Expense: {formatCurrency(summary?.nextMonthPrediction ?? 0)}
                </Typography>
                <Typography variant="body1" sx={{ opacity: 0.9, mt: 0.5, color: 'rgba(255,255,255,0.9)' }}>
                  {summary?.aiRecommendation || "Analyzing your spending patterns..."}
                </Typography>
              </Box>
            </Box>
            {/* Decorative circle */}
            <Box
              sx={{
                position: 'absolute',
                right: -20,
                top: -20,
                width: 150,
                height: 150,
                borderRadius: '50%',
                bgcolor: 'rgba(255,255,255,0.05)',
                zIndex: 0
              }}
            />
          </Paper>
        </Box>
      </Fade>

      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} md={8}>
          <Fade in timeout={800}>
            <Box>
              <ProfessionalCard title="Monthly Trends" subheader="Income vs Expenses over the last 6 months" headerAction={<ChartIcon color="primary" />}>
                {monthlyTrends.length === 0 ? (
                  <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight={300}>
                    <ChartIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography color="text.secondary">Not enough data yet to show trends.</Typography>
                    <Typography variant="caption" color="text.secondary">Add some transactions to see your financial trends</Typography>
                  </Box>
                ) : (
                  <Box id="monthly-trends-chart" sx={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyTrends} margin={{ top: 10, right: 10, bottom: 0, left: 0 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" />
                        <XAxis dataKey="month" stroke="#888" style={{ fontSize: '0.875rem' }} />
                        <YAxis stroke="#888" style={{ fontSize: '0.875rem' }} />
                        <Tooltip formatter={(value) => formatCurrency(value)} contentStyle={{ backgroundColor: '#1e1e1e', border: '1px solid #333', borderRadius: 8 }} />
                        <Legend />
                        <Line type="monotone" dataKey="income" name="Income" stroke="#4CAF50" strokeWidth={3} dot={{ fill: '#4CAF50', r: 4 }} activeDot={{ r: 6 }} isAnimationActive={!isExporting} />
                        <Line type="monotone" dataKey="expenses" name="Expenses" stroke="#F44336" strokeWidth={3} dot={{ fill: '#F44336', r: 4 }} activeDot={{ r: 6 }} isAnimationActive={!isExporting} />
                      </LineChart>
                    </ResponsiveContainer>
                  </Box>
                )}
              </ProfessionalCard>
            </Box>
          </Fade>
        </Grid>

        <Grid item xs={12} md={4}>
          <Fade in timeout={900}>
            <Box>
              <ProfessionalCard title="Spending by Category" subheader="Current month breakdown" headerAction={<PieChartIcon color="primary" />}>
                {categoryBreakdown.length === 0 ? (
                  <Box display="flex" flexDirection="column" justifyContent="center" alignItems="center" minHeight={300}>
                    <PieChartIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography color="text.secondary">No spending data yet</Typography>
                    <Typography variant="caption" color="text.secondary">Start adding expenses to see breakdown</Typography>
                  </Box>
                ) : (
                  <Box id="category-breakdown-chart" sx={{ width: '100%', height: 300 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryBreakdown}
                          dataKey="amount"
                          nameKey="categoryName"
                          cx="50%"
                          cy="50%"
                          outerRadius={100}
                          paddingAngle={2}
                          isAnimationActive={!isExporting}
                        >
                          {categoryBreakdown.map((entry, index) => (
                            <Cell
                              key={entry.categoryId}
                              fill={getCategoryColor(entry.categoryId, index)}
                              stroke="#1a1a1a"
                              strokeWidth={2}
                            />
                          ))}
                        </Pie>
                        <Tooltip
                          content={({ active, payload }) => {
                            if (active && payload && payload.length) {
                              const data = payload[0].payload;
                              return (
                                <Box sx={{ bgcolor: 'background.paper', p: 1.5, border: '1px solid', borderColor: 'divider', borderRadius: 1, boxShadow: 3 }}>
                                  <Typography variant="subtitle2" sx={{ fontWeight: 600, color: 'text.primary' }}>
                                    {data.categoryName}
                                  </Typography>
                                  <Typography variant="body2" sx={{ color: 'text.secondary' }}>
                                    {formatCurrency(data.amount)}
                                  </Typography>
                                  <Typography variant="caption" sx={{ color: 'primary.main', fontWeight: 500 }}>
                                    {data.percentage ? `${data.percentage.toFixed(1)}%` : ''} of total
                                  </Typography>
                                </Box>
                              );
                            }
                            return null;
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </Box>
                )}
              </ProfessionalCard>
            </Box>
          </Fade>
        </Grid>
      </Grid >

      <Grid container spacing={3}>
        <Grid item xs={12} md={8}>
          <Fade in timeout={1000}>
            <Box>
              <ProfessionalCard
                title="Recent Transactions"
                subheader="Latest financial activity"
                headerAction={summary && <Chip label={`${summary.transactionCount ?? 0} this month`} size="small" color="primary" variant="outlined" />}
                actions={<Button size="small" endIcon={<ArrowForwardIcon />} onClick={() => navigate('/transactions')}>View All Transactions</Button>}
              >
                {recentTransactions.length === 0 ? (
                  <Box py={4} textAlign="center">
                    <TransactionsIcon sx={{ fontSize: 48, color: 'text.disabled', mb: 2 }} />
                    <Typography color="text.secondary">No recent transactions found</Typography>
                    <Typography variant="caption" color="text.secondary">Start tracking your finances by adding transactions</Typography>
                  </Box>
                ) : (
                  <List sx={{ py: 0 }}>
                    {recentTransactions.map((tx, index) => (
                      <ListItem key={tx.id} divider={index < recentTransactions.length - 1} sx={{ px: 0, '&:hover': { backgroundColor: 'rgba(255, 255, 255, 0.03)', borderRadius: 1 } }}>
                        <ListItemText
                          primary={<Typography variant="body1" sx={{ fontWeight: 500 }}>{tx.description}</Typography>}
                          secondary={<Typography variant="body2" color="text.secondary">{formatDate(tx.transactionDate)} · {tx.categoryName || 'Uncategorized'}</Typography>}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 600, color: tx.type === 'INCOME' ? 'success.main' : 'error.main' }}>
                          {tx.type === 'INCOME' ? '+' : '-'}{formatCurrency(tx.amount)}
                        </Typography>
                      </ListItem>
                    ))}
                  </List>
                )}
              </ProfessionalCard>
            </Box>
          </Fade>
        </Grid>

        <Grid item xs={12} md={4}>
          <Fade in timeout={1100}>
            <Box>
              <ProfessionalCard title="Quick Stats" subheader="Your financial snapshot">
                <Box display="flex" flexDirection="column" gap={3}>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Active Budgets</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: 'primary.main' }}>{summary?.budgetCount ?? 0}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Savings Goals</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700, color: 'secondary.main' }}>{summary?.goalCount ?? 0}</Typography>
                  </Box>
                  <Box>
                    <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>Transactions (This Month)</Typography>
                    <Typography variant="h3" sx={{ fontWeight: 700 }}>{summary?.transactionCount ?? 0}</Typography>
                  </Box>
                </Box>
                <Box mt={3}>
                  <Button variant="outlined" fullWidth onClick={() => navigate('/budgets')} sx={{ mb: 1 }}>Manage Budgets</Button>
                  <Button variant="outlined" fullWidth onClick={() => navigate('/goals')}>Track Goals</Button>
                </Box>
              </ProfessionalCard>
            </Box>
          </Fade>
        </Grid>
      </Grid>
    </Container >
  );
};

export default Dashboard;
