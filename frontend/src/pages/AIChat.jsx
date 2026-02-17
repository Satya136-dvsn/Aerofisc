/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { useState, useRef, useEffect } from 'react';
import {
    Container,
    Box,
    Paper,
    TextField,
    IconButton,
    Typography,
    Avatar,
    CircularProgress,
    Chip,
    Fade,
} from '@mui/material';
import {
    Send as SendIcon,
    SmartToy as BotIcon,
    Person as PersonIcon,
    AutoAwesome as SparkleIcon,
} from '@mui/icons-material';
import chatService from '../services/chatService';
import { useAuth } from '../context/AuthContext';

const AIChat = () => {
    const { user } = useAuth();
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const [conversationId, setConversationId] = useState(null);
    const messagesEndRef = useRef(null);

    const suggestions = [
        'How can I reduce my expenses?',
        'Analyze my spending patterns',
        'Suggest a budget for food',
        'What should I save this month?',
    ];

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSend = async () => {
        if (!input.trim() || loading) return;

        const userMessage = {
            role: 'user',
            content: input,
            timestamp: new Date(),
        };

        setMessages((prev) => [...prev, userMessage]);
        setInput('');
        setLoading(true);

        try {
            const response = await chatService.sendMessage(input, conversationId);

            if (response.data.conversationId && !conversationId) {
                setConversationId(response.data.conversationId);
            }

            const assistantMessage = {
                role: 'assistant',
                content: response.data.message || response.data.response,
                timestamp: new Date(),
            };

            setMessages((prev) => [...prev, assistantMessage]);
        } catch (error) {
            console.error('Chat error:', error);
            const errorMessage = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date(),
                error: true,
            };
            setMessages((prev) => [...prev, errorMessage]);
        } finally {
            setLoading(false);
        }
    };

    const handleSuggestionClick = (suggestion) => {
        setInput(suggestion);
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            handleSend();
        }
    };

    return (
        <Container maxWidth="lg" sx={{ py: 4, height: 'calc(100vh - 100px)', display: 'flex', flexDirection: 'column' }}>
            {/* Header */}
            <Fade in timeout={300}>
                <Box mb={3}>
                    <Box display="flex" alignItems="center" gap={2} mb={1}>
                        <Avatar sx={{ bgcolor: 'primary.main', width: 48, height: 48 }}>
                            <BotIcon />
                        </Avatar>
                        <Box>
                            <Typography variant="h4" sx={{ fontWeight: 700 }}>
                                AI Financial Assistant
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Ask me anything about your finances
                            </Typography>
                        </Box>
                    </Box>
                </Box>
            </Fade>

            {/* Suggestions (only show when no messages) */}
            {messages.length === 0 && (
                <Fade in timeout={500}>
                    <Box mb={3}>
                        <Typography variant="body2" color="text.secondary" mb={2}>
                            Try asking:
                        </Typography>
                        <Box display="flex" gap={1} flexWrap="wrap">
                            {suggestions.map((suggestion, index) => (
                                <Chip
                                    key={index}
                                    label={suggestion}
                                    onClick={() => handleSuggestionClick(suggestion)}
                                    icon={<SparkleIcon />}
                                    variant="outlined"
                                    clickable
                                    sx={{
                                        '&:hover': {
                                            bgcolor: 'primary.light',
                                            color: 'primary.contrastText',
                                        },
                                    }}
                                />
                            ))}
                        </Box>
                    </Box>
                </Fade>
            )}

            {/* Messages Container */}
            <Paper
                elevation={2}
                sx={{
                    flex: 1,
                    overflow: 'auto',
                    p: 3,
                    bgcolor: 'background.default',
                    borderRadius: 2,
                    mb: 2,
                }}
            >
                {messages.length === 0 ? (
                    <Box
                        display="flex"
                        flexDirection="column"
                        alignItems="center"
                        justifyContent="center"
                        height="100%"
                        color="text.secondary"
                    >
                        <BotIcon sx={{ fontSize: 80, mb: 2, opacity: 0.3 }} />
                        <Typography variant="h6" gutterBottom>
                            Start a conversation
                        </Typography>
                        <Typography variant="body2">
                            I'm here to help you manage your finances better
                        </Typography>
                    </Box>
                ) : (
                    <Box>
                        {messages.map((message, index) => (
                            <Fade in timeout={300} key={index}>
                                <Box
                                    display="flex"
                                    gap={2}
                                    mb={3}
                                    flexDirection={message.role === 'user' ? 'row-reverse' : 'row'}
                                >
                                    <Avatar
                                        sx={{
                                            bgcolor: message.role === 'user' ? 'secondary.main' : 'primary.main',
                                            width: 36,
                                            height: 36,
                                        }}
                                    >
                                        {message.role === 'user' ? (
                                            <PersonIcon fontSize="small" />
                                        ) : (
                                            <BotIcon fontSize="small" />
                                        )}
                                    </Avatar>
                                    <Paper
                                        elevation={1}
                                        sx={{
                                            p: 2,
                                            maxWidth: '70%',
                                            bgcolor: message.role === 'user' ? 'secondary.light' : 'background.paper',
                                            borderRadius: 2,
                                            ...(message.error && {
                                                bgcolor: 'error.light',
                                                color: 'error.contrastText',
                                            }),
                                        }}
                                    >
                                        <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                            {message.content}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary" sx={{ mt: 1, display: 'block' }}>
                                            {new Date(message.timestamp).toLocaleTimeString()}
                                        </Typography>
                                    </Paper>
                                </Box>
                            </Fade>
                        ))}
                        {loading && (
                            <Box display="flex" gap={2} mb={3}>
                                <Avatar sx={{ bgcolor: 'primary.main', width: 36, height: 36 }}>
                                    <BotIcon fontSize="small" />
                                </Avatar>
                                <Paper elevation={1} sx={{ p: 2, borderRadius: 2 }}>
                                    <Box display="flex" alignItems="center" gap={1}>
                                        <CircularProgress size={20} />
                                        <Typography variant="body2" color="text.secondary">
                                            Thinking...
                                        </Typography>
                                    </Box>
                                </Paper>
                            </Box>
                        )}
                        <div ref={messagesEndRef} />
                    </Box>
                )}
            </Paper>

            {/* Input Box */}
            <Paper
                elevation={3}
                sx={{
                    p: '10px 16px',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 1,
                    borderRadius: 4,
                    bgcolor: 'background.paper',
                }}
            >
                <TextField
                    fullWidth
                    multiline
                    maxRows={4}
                    placeholder="Ask me anything about your finances..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyPress={handleKeyPress}
                    disabled={loading}
                    variant="standard"
                    InputProps={{
                        disableUnderline: true,
                    }}
                    sx={{
                        '& .MuiInputBase-root': {
                            padding: '8px 0',
                        },
                    }}
                />
                <IconButton
                    color="primary"
                    onClick={handleSend}
                    disabled={!input.trim() || loading}
                    sx={{
                        width: 40,
                        height: 40,
                        bgcolor: input.trim() ? 'primary.main' : 'action.disabledBackground',
                        color: input.trim() ? 'white' : 'text.disabled',
                        transition: 'all 0.2s',
                        '&:hover': {
                            bgcolor: input.trim() ? 'primary.dark' : 'action.disabledBackground',
                            transform: input.trim() ? 'scale(1.05)' : 'none',
                        },
                    }}
                >
                    <SendIcon fontSize="small" />
                </IconButton>
            </Paper>
        </Container>
    );
};

export default AIChat;
