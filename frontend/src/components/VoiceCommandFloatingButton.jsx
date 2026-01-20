import React, { useState, useEffect } from 'react';
import { Fab, Tooltip, Zoom, CircularProgress, Snackbar, Alert } from '@mui/material';
import { Mic as MicIcon, MicOff as MicOffIcon } from '@mui/icons-material';

const VoiceCommandFloatingButton = ({ onCommand }) => {
    const [isListening, setIsListening] = useState(false);
    const [recognition, setRecognition] = useState(null);
    const [feedback, setFeedback] = useState({ open: false, message: '', severity: 'info' });

    useEffect(() => {
        if ('webkitSpeechRecognition' in window) {
            const speechRecognition = new window.webkitSpeechRecognition();
            speechRecognition.continuous = false;
            speechRecognition.interimResults = false;
            speechRecognition.lang = 'en-US';

            speechRecognition.onstart = () => setIsListening(true);

            speechRecognition.onend = () => setIsListening(false);

            speechRecognition.onerror = (event) => {
                setIsListening(false);
                setFeedback({ open: true, message: 'Voice recognition error: ' + event.error, severity: 'error' });
            };

            speechRecognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                console.log('Voice Command:', transcript);
                processCommand(transcript);
            };

            setRecognition(speechRecognition);
        } else {
            console.warn('Web Speech API not supported in this browser.');
        }
    }, []);

    const processCommand = (transcript) => {
        const text = transcript.toLowerCase();

        // Pattern: "add [income/expense] [amount] for [description]"
        // Example: "add expense 500 for lunch"

        // Regex to capture type, amount, and description
        const expenseRegex = /(?:add|create)\s+(expense|income)\s+(?:of\s+)?(\d+(?:\.\d{1,2})?)\s+(?:for|on)\s+(.+)/i;

        // Simplified pattern: "lunch 500" (defaults to expense)
        const simpleRegex = /^(.+?)\s+(\d+(?:\.\d{1,2})?)$/i;

        const match = text.match(expenseRegex);
        const simpleMatch = text.match(simpleRegex);

        if (match) {
            const type = match[1].toUpperCase();
            const amount = parseFloat(match[2]);
            const description = match[3];

            onCommand({
                type,
                amount,
                description,
                transactionDate: new Date().toISOString().split('T')[0]
            });
            setFeedback({ open: true, message: `Understood: ${type} ${amount} for ${description}`, severity: 'success' });
        } else if (simpleMatch) {
            // Assume expense if just "Lunch 500"
            const description = simpleMatch[1];
            const amount = parseFloat(simpleMatch[2]);

            onCommand({
                type: 'EXPENSE',
                amount,
                description,
                transactionDate: new Date().toISOString().split('T')[0]
            });
            setFeedback({ open: true, message: `Understood: Expense ${amount} for ${description}`, severity: 'success' });
        } else {
            setFeedback({ open: true, message: 'Could not understand command. Try: "Add expense 500 for lunch"', severity: 'warning' });
        }
    };

    const toggleListening = () => {
        if (!recognition) return;

        if (isListening) {
            recognition.stop();
        } else {
            recognition.start();
        }
    };

    if (!recognition) return null; // Don't render if not supported

    return (
        <>
            <Zoom in={true} unmountOnExit>
                <Tooltip title="Voice Command (Click to Speak)" placement="left">
                    <Fab
                        color={isListening ? "error" : "primary"}
                        aria-label="voice command"
                        onClick={toggleListening}
                        sx={{
                            position: 'fixed',
                            bottom: 24,
                            right: 24,
                            zIndex: 2000, // Above other floating items typically
                            boxShadow: 6
                        }}
                    >
                        {isListening ? <MicOffIcon /> : <MicIcon />}
                        {isListening && (
                            <CircularProgress
                                size={68}
                                sx={{
                                    color: 'error.main',
                                    position: 'absolute',
                                    top: -6,
                                    left: -6,
                                    zIndex: 1,
                                }}
                            />
                        )}
                    </Fab>
                </Tooltip>
            </Zoom>

            <Snackbar
                open={feedback.open}
                autoHideDuration={4000}
                onClose={() => setFeedback({ ...feedback, open: false })}
                anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
            >
                <Alert severity={feedback.severity} variant="filled">
                    {feedback.message}
                </Alert>
            </Snackbar>
        </>
    );
};

export default VoiceCommandFloatingButton;
