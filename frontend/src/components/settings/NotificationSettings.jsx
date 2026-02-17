/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { useState } from 'react';
import { Grid, Switch, FormControlLabel, Typography, Divider, Box } from '@mui/material';
import ProfessionalCard from '../ui/ProfessionalCard';

const NotificationSettings = () => {
    const [notifications, setNotifications] = useState({
        email: {
            marketing: false,
            security: true,
            updates: true,
        },
        push: {
            transactions: true,
            budgets: true,
            goals: false,
        },
    });

    const handleEmailChange = (e) => {
        setNotifications({
            ...notifications,
            email: { ...notifications.email, [e.target.name]: e.target.checked },
        });
    };

    const handlePushChange = (e) => {
        setNotifications({
            ...notifications,
            push: { ...notifications.push, [e.target.name]: e.target.checked },
        });
    };

    return (
        <Grid container spacing={3}>
            <Grid item xs={12}>
                <ProfessionalCard title="Email Notifications" subheader="Manage what emails you receive">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Switch checked={notifications.email.security} onChange={handleEmailChange} name="security" />}
                                label={
                                    <Box>
                                        <Typography variant="subtitle2">Security Alerts</Typography>
                                        <Typography variant="caption" color="text.secondary">Get notified about logins and password changes</Typography>
                                    </Box>
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Switch checked={notifications.email.updates} onChange={handleEmailChange} name="updates" />}
                                label={
                                    <Box>
                                        <Typography variant="subtitle2">Product Updates</Typography>
                                        <Typography variant="caption" color="text.secondary">Stay up to date with new features</Typography>
                                    </Box>
                                }
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Switch checked={notifications.email.marketing} onChange={handleEmailChange} name="marketing" />}
                                label={
                                    <Box>
                                        <Typography variant="subtitle2">Marketing & Offers</Typography>
                                        <Typography variant="caption" color="text.secondary">Receive special offers and promotions</Typography>
                                    </Box>
                                }
                            />
                        </Grid>
                    </Grid>
                </ProfessionalCard>
            </Grid>

            <Grid item xs={12}>
                <ProfessionalCard title="Push Notifications" subheader="Manage mobile and web alerts">
                    <Grid container spacing={2}>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Switch checked={notifications.push.transactions} onChange={handlePushChange} name="transactions" />}
                                label="New Transactions"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Switch checked={notifications.push.budgets} onChange={handlePushChange} name="budgets" />}
                                label="Budget Alerts (Overspending)"
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <FormControlLabel
                                control={<Switch checked={notifications.push.goals} onChange={handlePushChange} name="goals" />}
                                label="Goal Milestones"
                            />
                        </Grid>
                    </Grid>
                </ProfessionalCard>
            </Grid>
        </Grid>
    );
};

export default NotificationSettings;
