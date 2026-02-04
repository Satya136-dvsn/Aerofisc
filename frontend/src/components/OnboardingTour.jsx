import React, { useState, useEffect } from 'react';
import Joyride, { STATUS } from 'react-joyride';
import { useTheme } from '@mui/material/styles';

const OnboardingTour = () => {
    const theme = useTheme();
    const [run, setRun] = useState(false);

    useEffect(() => {
        // Check if tour has been completed
        const tourCompleted = localStorage.getItem('onboardingTourCompleted');
        if (!tourCompleted) {
            setRun(true);
        }
    }, []);

    const handleJoyrideCallback = (data) => {
        const { status } = data;
        const finishedStatuses = [STATUS.FINISHED, STATUS.SKIPPED];

        if (finishedStatuses.includes(status)) {
            setRun(false);
            localStorage.setItem('onboardingTourCompleted', 'true');
        }
    };

    const steps = [
        {
            target: 'body',
            content: (
                <div>
                    <h3>Welcome to PennyPilot! 🚀</h3>
                    <p>Let's take a quick tour to help you get started with your financial journey.</p>
                </div>
            ),
            placement: 'center',
            disableBeacon: true,
        },
        {
            target: '[aria-label="New Transaction"]', // We'll need to add this ID/Label to the add button if not present, or use a specific selector
            // Actually, let's use a class or id selectors that we will add to the components.
            // For now, I will assume we will add className="tour-add-transaction" to the add button in Transactions/Dashboard.
            // Wait, the Dashboard layout has navigation items.
            content: 'Click here to access your Dashboard overview.',
            target: 'a[href="/dashboard"]', // Sidebar link
        },
        {
            target: 'a[href="/transactions"]',
            content: 'View, filter, and manage all your daily transactions here.',
        },
        {
            target: '.tour-add-transaction-btn', // Will add this class to the global Add button or the one in Transactions page
            content: 'Quickly add income or expenses with this button. Use Ctrl+N as a shortcut!',
        },
        {
            target: 'a[href="/recurring"]',
            content: 'Set up automated bills like Rent or Netflix here ("Set and Forget").',
        },
        {
            target: 'a[href="/goals"]',
            content: 'Dream big! Create and track savings goals for vacations or gadgets.',
        }
    ];

    return (
        <Joyride
            steps={steps}
            run={run}
            continuous
            showProgress
            showSkipButton
            callback={handleJoyrideCallback}
            styles={{
                options: {
                    zIndex: 10000,
                    primaryColor: theme.palette.primary.main,
                    backgroundColor: theme.palette.background.paper,
                    textColor: theme.palette.text.primary,
                    arrowColor: theme.palette.background.paper,
                },
            }}
        />
    );
};

export default OnboardingTour;
