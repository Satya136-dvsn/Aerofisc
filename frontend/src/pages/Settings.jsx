import { useState } from 'react';
import { Container, Grid, Typography, Box, Fade, Tabs, Tab, Paper } from '@mui/material';
import { Person, Security, Notifications, Tune, ManageAccounts } from '@mui/icons-material';
import ProfileSettings from '../components/settings/ProfileSettings';
import SecuritySettings from '../components/settings/SecuritySettings';
import NotificationSettings from '../components/settings/NotificationSettings';
import AppSettings from '../components/settings/AppSettings';
import AccountSettings from '../components/settings/AccountSettings';

const Settings = () => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Container maxWidth="lg" sx={{ pb: 4 }}>
            <Fade in timeout={300}>
                <Box mb={4}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 0.5 }}>
                        Settings
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Manage your account, preferences, and security
                    </Typography>
                </Box>
            </Fade>

            <Grid container spacing={3}>
                <Grid item xs={12} md={3}>
                    <Paper sx={{ borderRadius: 2, overflow: 'hidden' }}>
                        <Tabs
                            orientation="vertical"
                            variant="scrollable"
                            value={activeTab}
                            onChange={handleTabChange}
                            aria-label="settings tabs"
                            sx={{ borderRight: 1, borderColor: 'divider', minHeight: 400 }}
                        >
                            <Tab icon={<Person />} iconPosition="start" label="Profile" sx={{ justifyContent: 'flex-start', minHeight: 60 }} />
                            <Tab icon={<Security />} iconPosition="start" label="Security" sx={{ justifyContent: 'flex-start', minHeight: 60 }} />
                            <Tab icon={<Notifications />} iconPosition="start" label="Notifications" sx={{ justifyContent: 'flex-start', minHeight: 60 }} />
                            <Tab icon={<Tune />} iconPosition="start" label="Preferences" sx={{ justifyContent: 'flex-start', minHeight: 60 }} />
                            <Tab icon={<ManageAccounts />} iconPosition="start" label="Account" sx={{ justifyContent: 'flex-start', minHeight: 60 }} />
                        </Tabs>
                    </Paper>
                </Grid>

                <Grid item xs={12} md={9}>
                    <Fade in timeout={400} key={activeTab}>
                        <Box>
                            {activeTab === 0 && <ProfileSettings />}
                            {activeTab === 1 && <SecuritySettings />}
                            {activeTab === 2 && <NotificationSettings />}
                            {activeTab === 3 && <AppSettings />}
                            {activeTab === 4 && <AccountSettings />}
                        </Box>
                    </Fade>
                </Grid>
            </Grid>
        </Container>
    );
};

export default Settings;
