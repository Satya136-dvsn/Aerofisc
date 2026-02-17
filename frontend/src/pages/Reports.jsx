/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { useState } from 'react';
import { Container, Grid, Typography, Box, Fade, Tabs, Tab } from '@mui/material';
import ProfessionalCard from '../components/ui/ProfessionalCard';
import ReportTemplates from '../components/reports/ReportTemplates';
import CustomReportBuilder from '../components/reports/CustomReportBuilder';
import ScheduledReports from '../components/reports/ScheduledReports';

const Reports = () => {
    const [activeTab, setActiveTab] = useState(0);

    const handleTabChange = (event, newValue) => {
        setActiveTab(newValue);
    };

    return (
        <Container maxWidth="xl" sx={{ pb: 4 }}>
            <Fade in timeout={300}>
                <Box mb={4}>
                    <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 0.5 }}>
                        Reports
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                        Generate, customize, and schedule financial reports
                    </Typography>
                </Box>
            </Fade>

            <Box sx={{ borderBottom: 1, borderColor: 'divider', mb: 3 }}>
                <Tabs value={activeTab} onChange={handleTabChange} aria-label="reports tabs">
                    <Tab label="Templates" />
                    <Tab label="Custom Builder" />
                    <Tab label="Scheduled Reports" />
                </Tabs>
            </Box>

            <Fade in timeout={400} key={activeTab}>
                <Box>
                    {activeTab === 0 && <ReportTemplates />}
                    {activeTab === 1 && <CustomReportBuilder />}
                    {activeTab === 2 && <ScheduledReports />}
                </Box>
            </Fade>
        </Container>
    );
};

export default Reports;
