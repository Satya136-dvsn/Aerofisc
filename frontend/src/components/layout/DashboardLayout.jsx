import { useState, useEffect } from 'react';
import { Outlet, useNavigate, useLocation } from 'react-router-dom';
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Divider,
  Avatar,
  Menu,
  MenuItem,
  Badge,
  Tooltip,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import {
  Menu as MenuIcon,
  ChevronLeft as ChevronLeftIcon,
  Dashboard as DashboardIcon,
  Receipt as ReceiptIcon,
  Category as CategoryIcon,
  AccountBalance as BudgetIcon,
  Savings as SavingsIcon,
  Assessment as AnalyticsIcon,
  Description as ReportsIcon,
  Forum as CommunityIcon,
  Settings as SettingsIcon,
  Notifications as NotificationsIcon,
  Logout as LogoutIcon,
  AccountBalanceWallet as BankingIcon,
  Receipt as BillsIcon,
  TrendingUp as InvestmentsIcon,
  SmartToy as AIIcon,
  Info as InfoIcon,
  Warning as WarningIcon,
  TrendingUp as TrendingUpIcon,
  AdminPanelSettings as AdminIcon,
  CreditCard as DebtIcon,
  MonitorHeart as HealthIcon,
  SavingsOutlined as RetirementIcon,
  AccountBalance as TaxIcon,
  Psychology as ScenarioIcon,
  Repeat as RepeatIcon,
} from '@mui/icons-material';
import { useAuth } from '../../context/AuthContext';

const DRAWER_WIDTH_EXPANDED = 240;
const DRAWER_WIDTH_COLLAPSED = 64;
const APP_NAME = 'Aerofisc';

const menuItems = [
  { text: 'Dashboard', icon: <DashboardIcon />, path: '/dashboard' },
  { text: 'Transactions', icon: <ReceiptIcon />, path: '/transactions' },
  { text: 'Recurring', icon: <RepeatIcon />, path: '/recurring' },
  { text: 'Categories', icon: <CategoryIcon />, path: '/categories' },
  { text: 'Budgets', icon: <BudgetIcon />, path: '/budgets' },
  { text: 'Savings Goals', icon: <SavingsIcon />, path: '/goals' },
  { text: 'Debt Management', icon: <DebtIcon />, path: '/debt-management' },
  { text: 'Financial Health', icon: <HealthIcon />, path: '/financial-health' },
  { text: 'Banking', icon: <BankingIcon />, path: '/banking' },
  { text: 'Bills', icon: <BillsIcon />, path: '/bills' },
  { text: 'Investments', icon: <InvestmentsIcon />, path: '/investments' },
  { text: 'Retirement', icon: <RetirementIcon />, path: '/retirement' },
  { text: 'Tax Planning', icon: <TaxIcon />, path: '/tax-planning' },
  { text: 'Scenario Analysis', icon: <ScenarioIcon />, path: '/scenario-analysis' },
  { text: 'AI Assistant', icon: <AIIcon />, path: '/ai-chat' },
  { text: 'Analytics', icon: <AnalyticsIcon />, path: '/analytics' },
  { text: 'Reports', icon: <ReportsIcon />, path: '/reports' },
  { text: 'Community', icon: <CommunityIcon />, path: '/community' },
  { text: 'Admin', icon: <AdminIcon />, path: '/admin', adminOnly: true },
];

import useKeyboardShortcut from '../../hooks/useKeyboardShortcut';
import TransactionDialog from '../TransactionDialog';
import OnboardingTour from '../OnboardingTour';
import VoiceCommandFloatingButton from '../VoiceCommandFloatingButton';

const DashboardLayout = () => {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [sidebarOpen, setSidebarOpen] = useState(() => {
    const saved = localStorage.getItem('sidebarOpen');
    return saved !== null ? JSON.parse(saved) : true;
  });
  const [mobileOpen, setMobileOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [notificationAnchorEl, setNotificationAnchorEl] = useState(null);
  const [userAvatar, setUserAvatar] = useState('');

  // Clean string state for shortcuts (prevents re-renders)
  const [transactionDialogOpen, setTransactionDialogOpen] = useState(false);
  const [initialTransactionData, setInitialTransactionData] = useState(null);

  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Keyboard Shortcuts
  useKeyboardShortcut('n', () => {
    setInitialTransactionData(null);
    setTransactionDialogOpen(true);
  }, { ctrlKey: true });
  useKeyboardShortcut('d', () => navigate('/dashboard'), { ctrlKey: true });
  useKeyboardShortcut('t', () => navigate('/transactions'), { ctrlKey: true });
  useKeyboardShortcut('b', () => navigate('/budgets'), { ctrlKey: true });

  const handleVoiceCommand = (data) => {
    setInitialTransactionData(data);
    setTransactionDialogOpen(true);
  };

  const handleDialogClose = (shouldRefresh) => {
    setTransactionDialogOpen(false);
    setTimeout(() => setInitialTransactionData(null), 300);
    if (shouldRefresh) {
      // Dispatch event for child components to refresh data
      window.dispatchEvent(new Event('transaction-updated'));
    }
  };

  // Persist sidebar state
  useEffect(() => {
    localStorage.setItem('sidebarOpen', JSON.stringify(sidebarOpen));
  }, [sidebarOpen]);

  // Load user avatar from API
  useEffect(() => {
    const loadAvatar = async () => {
      try {
        // Import userService
        const userService = await import('../../services/userService');
        const response = await userService.default.getProfile();
        if (response.data?.avatar) {
          setUserAvatar(response.data.avatar);
        }
      } catch (error) {
        console.error('Failed to load avatar:', error);
      }
    };

    loadAvatar();

    // Listen for avatar changes from ProfileSettings
    const handleAvatarChange = (event) => {
      setUserAvatar(event.detail);
    };

    window.addEventListener('avatarChanged', handleAvatarChange);

    return () => {
      window.removeEventListener('avatarChanged', handleAvatarChange);
    };
  }, []);

  const handleDrawerToggle = () => {
    if (isMobile) {
      setMobileOpen(!mobileOpen);
    } else {
      setSidebarOpen(!sidebarOpen);
    }
  };

  const handleNavigation = (path) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleProfileMenuOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileMenuClose = () => {
    setAnchorEl(null);
  };

  const handleLogout = () => {
    handleProfileMenuClose();
    logout();
    navigate('/login');
  };

  const getCurrentPageTitle = () => {
    const currentItem = menuItems.find((item) => item.path === location.pathname);
    return currentItem?.text || 'BudgetWise';
  };

  const drawerWidth = isMobile ? DRAWER_WIDTH_EXPANDED : (sidebarOpen ? DRAWER_WIDTH_EXPANDED : DRAWER_WIDTH_COLLAPSED);

  const drawer = (
    <Box sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
      {/* Sidebar Header */}
      <Box
        sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: sidebarOpen ? 'space-between' : 'center',
          padding: theme.spacing(2),
          minHeight: 64,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
      >
        {sidebarOpen && (
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
            <img
              src="/logo.png"
              alt="BudgetWise Logo"
              style={{ width: 32, height: 32, objectFit: 'contain' }}
            />
            <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700 }}>
              BudgetWise
            </Typography>
          </Box>
        )}
        {!sidebarOpen && (
          <img
            src="/logo.png"
            alt="BudgetWise Logo"
            style={{ width: 32, height: 32, objectFit: 'contain' }}
          />
        )}
        {!isMobile && (
          <IconButton onClick={handleDrawerToggle} size="small" aria-label={sidebarOpen ? "Collapse sidebar" : "Expand sidebar"}>
            <ChevronLeftIcon
              sx={{
                transform: sidebarOpen ? 'rotate(0deg)' : 'rotate(180deg)',
                transition: 'transform 0.3s',
              }}
            />
          </IconButton>
        )}
      </Box>

      {/* Navigation Menu */}
      <List sx={{ flexGrow: 1, py: 2 }}>
        {menuItems
          .filter((item) => !item.adminOnly || (item.adminOnly && user?.role === 'ADMIN'))
          .map((item) => {
            const isSelected = location.pathname === item.path;
            return (
              <ListItem key={item.text} disablePadding sx={{ px: 1, mb: 0.5 }}>
                <Tooltip title={!sidebarOpen ? item.text : ''} placement="right">
                  <ListItemButton
                    selected={isSelected}
                    onClick={() => handleNavigation(item.path)}
                    data-tour={`nav-${item.path.replace('/', '')}`}
                    sx={{
                      borderRadius: 1,
                      minHeight: 48,
                      justifyContent: sidebarOpen ? 'initial' : 'center',
                      px: 2.5,
                      '&.Mui-selected': {
                        backgroundColor: theme.palette.primary.main + '20',
                        borderLeft: `3px solid ${theme.palette.primary.main}`,
                        '&:hover': {
                          backgroundColor: theme.palette.primary.main + '30',
                        },
                      },
                      '&:hover': {
                        backgroundColor: theme.palette.action.hover,
                      },
                    }}
                  >
                    <ListItemIcon
                      sx={{
                        minWidth: 0,
                        mr: sidebarOpen ? 3 : 'auto',
                        justifyContent: 'center',
                        color: isSelected ? theme.palette.primary.main : 'inherit',
                      }}
                    >
                      {item.icon}
                    </ListItemIcon>
                    {sidebarOpen && (
                      <ListItemText
                        primary={item.text}
                        primaryTypographyProps={{
                          fontSize: '0.875rem',
                          fontWeight: isSelected ? 600 : 400,
                        }}
                      />
                    )}
                  </ListItemButton>
                </Tooltip>
              </ListItem>
            );
          })}
      </List>

      <Divider />

      {/* Logout Button */}
      <List sx={{ py: 1 }}>
        <ListItem disablePadding sx={{ px: 1 }}>
          <Tooltip title={!sidebarOpen ? 'Logout' : ''} placement="right">
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: 1,
                minHeight: 48,
                justifyContent: sidebarOpen ? 'initial' : 'center',
                px: 2.5,
                '&:hover': {
                  backgroundColor: theme.palette.error.main + '20',
                  color: theme.palette.error.main,
                },
              }}
            >
              <ListItemIcon
                sx={{
                  minWidth: 0,
                  mr: sidebarOpen ? 3 : 'auto',
                  justifyContent: 'center',
                }}
              >
                <LogoutIcon />
              </ListItemIcon>
              {sidebarOpen && <ListItemText primary="Logout" />}
            </ListItemButton>
          </Tooltip>
        </ListItem>
      </List>
    </Box>
  );

  return (
    <Box sx={{ display: 'flex', minHeight: '100vh' }}>
      {/* Top AppBar */}
      <AppBar
        position="fixed"
        sx={{
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          ml: { sm: `${drawerWidth}px` },
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
          backgroundColor: theme.palette.background.paper,
          borderBottom: `1px solid ${theme.palette.divider}`,
        }}
        elevation={0}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { sm: isMobile ? 'block' : 'none' } }}
            aria-label="Open navigation menu"
          >
            <MenuIcon />
          </IconButton>

          <Typography variant="h6" noWrap component="div" sx={{ flexGrow: 1, fontWeight: 600 }}>
            {getCurrentPageTitle()}
          </Typography>

          {/* Notification Bell */}
          <Tooltip title="Notifications">
            <IconButton
              color="inherit"
              sx={{ mr: 1 }}
              onClick={(e) => setNotificationAnchorEl(e.currentTarget)}
              aria-label="Show notifications"
            >
              <Badge badgeContent={3} color="error">
                <NotificationsIcon />
              </Badge>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={notificationAnchorEl}
            open={Boolean(notificationAnchorEl)}
            onClose={() => setNotificationAnchorEl(null)}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
            PaperProps={{
              sx: { width: 320, maxHeight: 400 }
            }}
          >
            <Box sx={{ p: 2, borderBottom: `1px solid ${theme.palette.divider}` }}>
              <Typography variant="subtitle1" fontWeight="bold">Notifications</Typography>
            </Box>
            <MenuItem onClick={() => { setNotificationAnchorEl(null); navigate('/notifications'); }}>
              <ListItemIcon>
                <InfoIcon fontSize="small" color="info" />
              </ListItemIcon>
              <ListItemText
                primary="Welcome to BudgetWise!"
                secondary="Start tracking your finances today."
                primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                secondaryTypographyProps={{ variant: 'caption', noWrap: true }}
              />
            </MenuItem>
            <MenuItem onClick={() => { setNotificationAnchorEl(null); navigate('/notifications'); }}>
              <ListItemIcon>
                <WarningIcon fontSize="small" color="warning" />
              </ListItemIcon>
              <ListItemText
                primary="Budget Alert"
                secondary="You've reached 80% of your Dining budget."
                primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                secondaryTypographyProps={{ variant: 'caption', noWrap: true }}
              />
            </MenuItem>
            <MenuItem onClick={() => { setNotificationAnchorEl(null); navigate('/notifications'); }}>
              <ListItemIcon>
                <TrendingUpIcon fontSize="small" color="success" />
              </ListItemIcon>
              <ListItemText
                primary="Investment Update"
                secondary="Apple stock is up by 5% today."
                primaryTypographyProps={{ variant: 'body2', fontWeight: 600 }}
                secondaryTypographyProps={{ variant: 'caption', noWrap: true }}
              />
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { setNotificationAnchorEl(null); navigate('/notifications'); }} sx={{ justifyContent: 'center' }}>
              <Typography variant="body2" color="primary" fontWeight="bold">
                View All Notifications
              </Typography>
            </MenuItem>
          </Menu>

          {/* User Profile Menu */}
          <Tooltip title="Account">
            <IconButton onClick={handleProfileMenuOpen} sx={{ p: 0 }} aria-label="Account settings">
              <Avatar
                src={userAvatar}
                sx={{
                  width: 36,
                  height: 36,
                  bgcolor: theme.palette.primary.main,
                  fontSize: '1rem',
                }}
              >
                {!userAvatar && (user?.username?.[0]?.toUpperCase() || 'U')}
              </Avatar>
            </IconButton>
          </Tooltip>

          <Menu
            anchorEl={anchorEl}
            open={Boolean(anchorEl)}
            onClose={handleProfileMenuClose}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'top',
              horizontal: 'right',
            }}
          >
            <MenuItem disabled>
              <Typography variant="body2" color="text.secondary">
                {user?.email || user?.username}
              </Typography>
            </MenuItem>
            <Divider />
            <MenuItem onClick={() => { handleProfileMenuClose(); navigate('/settings'); }}>
              <ListItemIcon>
                <SettingsIcon fontSize="small" />
              </ListItemIcon>
              Settings
            </MenuItem>
            <MenuItem onClick={handleLogout}>
              <ListItemIcon>
                <LogoutIcon fontSize="small" />
              </ListItemIcon>
              Logout
            </MenuItem>
          </Menu>
        </Toolbar>
      </AppBar>

      {/* Sidebar Drawer */}
      <Box component="nav" sx={{ width: { sm: drawerWidth }, flexShrink: { sm: 0 } }}>
        {/* Mobile Drawer */}
        <Drawer
          variant="temporary"
          open={mobileOpen}
          onClose={handleDrawerToggle}
          ModalProps={{ keepMounted: true }}
          sx={{
            display: { xs: 'block', sm: 'none' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: DRAWER_WIDTH_EXPANDED,
              backgroundColor: theme.palette.background.paper,
            },
          }}
        >
          {drawer}
        </Drawer>

        {/* Desktop Drawer */}
        <Drawer
          variant="permanent"
          sx={{
            display: { xs: 'none', sm: 'block' },
            '& .MuiDrawer-paper': {
              boxSizing: 'border-box',
              width: drawerWidth,
              backgroundColor: theme.palette.background.paper,
              transition: theme.transitions.create('width', {
                easing: theme.transitions.easing.sharp,
                duration: theme.transitions.duration.enteringScreen,
              }),
              overflowX: 'hidden',
            },
          }}
          open
        >
          {drawer}
        </Drawer>
      </Box>

      {/* Main Content Area */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          backgroundColor: theme.palette.background.default,
          minHeight: '100vh',
          transition: theme.transitions.create(['width', 'margin'], {
            easing: theme.transitions.easing.sharp,
            duration: theme.transitions.duration.leavingScreen,
          }),
        }}
      >
        <Toolbar /> {/* Spacer for fixed AppBar */}
        <Outlet />
      </Box>

      {/* Global Transaction Dialog */}
      <TransactionDialog
        open={transactionDialogOpen}
        transaction={initialTransactionData}
        onClose={handleDialogClose}
      />

      {/* Voice Command Button */}
      <VoiceCommandFloatingButton onCommand={handleVoiceCommand} />

      {/* Onboarding Tour */}
      <OnboardingTour />
    </Box>
  );
};

export default DashboardLayout;
