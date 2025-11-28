import { useState, useEffect } from 'react';
import {
    Container,
    Box,
    Typography,
    List,
    ListItem,
    ListItemText,
    ListItemIcon,
    Paper,
    IconButton,
    Chip,
    Fade,
    Button,
    CircularProgress,
} from '@mui/material';
import {
    Notifications as NotificationsIcon,
    TrendingUp as TrendingUpIcon,
    Warning as WarningIcon,
    Info as InfoIcon,
    CheckCircle as CheckCircleIcon,
    Delete as DeleteIcon,
    DoneAll as DoneAllIcon,
} from '@mui/icons-material';
import notificationService from '../services/notificationService';

const Notifications = () => {
    const [notifications, setNotifications] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchNotifications();
    }, []);

    const fetchNotifications = async () => {
        try {
            const response = await notificationService.getAll();
            setNotifications(response.data);
        } catch (error) {
            console.error('Error fetching notifications:', error);
        } finally {
            setLoading(false);
        }
    };

    const getIcon = (type) => {
        switch (type) {
            case 'SUCCESS':
                return <CheckCircleIcon color="success" />;
            case 'WARNING':
                return <WarningIcon color="warning" />;
            case 'ERROR':
                return <WarningIcon color="error" />;
            case 'INFO':
            default:
                return <InfoIcon color="info" />;
        }
    };

    const handleDelete = async (id) => {
        try {
            await notificationService.delete(id);
            setNotifications(notifications.filter((n) => n.id !== id));
        } catch (error) {
            console.error('Error deleting notification:', error);
        }
    };

    const handleMarkAsRead = async (id) => {
        try {
            await notificationService.markAsRead(id);
            setNotifications(
                notifications.map((n) =>
                    n.id === id ? { ...n, isRead: true } : n
                )
            );
        } catch (error) {
            console.error('Error marking notification as read:', error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationService.markAllAsRead();
            setNotifications(
                notifications.map((n) => ({ ...n, isRead: true }))
            );
        } catch (error) {
            console.error('Error marking all as read:', error);
        }
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-IN', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" alignItems="center" minHeight="60vh">
                <CircularProgress />
            </Box>
        );
    }

    return (
        <Container maxWidth="lg" sx={{ pb: 4 }}>
            <Fade in timeout={300}>
                <Box>
                    <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
                        <Box>
                            <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 0.5 }}>
                                Notifications
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                                Stay updated with your financial activities
                            </Typography>
                        </Box>
                        <Box display="flex" gap={2}>
                            {notifications.some((n) => !n.isRead) && (
                                <Button
                                    startIcon={<DoneAllIcon />}
                                    onClick={handleMarkAllAsRead}
                                    variant="outlined"
                                    size="small"
                                >
                                    Mark all read
                                </Button>
                            )}
                            <Chip
                                label={`${notifications.filter((n) => !n.isRead).length} unread`}
                                color="primary"
                                variant="outlined"
                            />
                        </Box>
                    </Box>

                    <Paper>
                        {notifications.length === 0 ? (
                            <Box p={6} textAlign="center">
                                <NotificationsIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
                                <Typography variant="h6" color="text.secondary">
                                    No notifications
                                </Typography>
                                <Typography variant="body2" color="text.secondary">
                                    You're all caught up!
                                </Typography>
                            </Box>
                        ) : (
                            <List>
                                {notifications.map((notification, index) => (
                                    <ListItem
                                        key={notification.id}
                                        divider={index < notifications.length - 1}
                                        sx={{
                                            bgcolor: notification.isRead ? 'inherit' : 'action.hover',
                                            '&:hover': {
                                                bgcolor: 'action.selected',
                                            },
                                            cursor: 'pointer',
                                        }}
                                        onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                                        secondaryAction={
                                            <IconButton
                                                edge="end"
                                                onClick={(e) => {
                                                    e.stopPropagation();
                                                    handleDelete(notification.id);
                                                }}
                                                size="small"
                                            >
                                                <DeleteIcon />
                                            </IconButton>
                                        }
                                    >
                                        <ListItemIcon>{getIcon(notification.type)}</ListItemIcon>
                                        <ListItemText
                                            primary={
                                                <Typography
                                                    variant="subtitle1"
                                                    sx={{
                                                        fontWeight: notification.isRead ? 400 : 600,
                                                    }}
                                                >
                                                    {notification.title}
                                                </Typography>
                                            }
                                            secondary={
                                                <>
                                                    <Typography component="span" variant="body2" color="text.primary">
                                                        {notification.message}
                                                    </Typography>
                                                    <br />
                                                    <Typography component="span" variant="caption" color="text.secondary">
                                                        {formatDate(notification.createdAt)}
                                                    </Typography>
                                                </>
                                            }
                                        />
                                    </ListItem>
                                ))}
                            </List>
                        )}
                    </Paper>
                </Box>
            </Fade>
        </Container>
    );
};

export default Notifications;
