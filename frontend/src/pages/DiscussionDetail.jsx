/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
    Container,
    Box,
    Typography,
    Paper,
    Avatar,
    Button,
    TextField,
    IconButton,
    Divider,
    Chip,
} from '@mui/material';
import { ArrowBack, ThumbUp, ThumbUpOutlined, Share, Delete, Edit } from '@mui/icons-material';

const DiscussionDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [liked, setLiked] = React.useState(false);
    const [likeCount, setLikeCount] = React.useState(45);
    const [commentText, setCommentText] = React.useState('');
    const [editingCommentId, setEditingCommentId] = React.useState(null);
    const [editCommentText, setEditCommentText] = React.useState('');
    const [comments, setComments] = React.useState([
        {
            id: 1,
            author: 'John D.',
            avatar: 'J',
            content: 'Great advice! I implemented this and already seeing results.',
            time: '1 hour ago',
            isOwn: false,
        },
        {
            id: 2,
            author: 'Test User',
            avatar: 'T',
            content: 'Testing comment feature!',
            time: 'Just now',
            isOwn: true,
        },
    ]);

    // Mock discussion data
    const discussion = {
        id,
        title: 'How I saved $10k in 6 months using the 50/30/20 rule',
        author: 'Sarah J.',
        avatar: 'S',
        time: '2 hours ago',
        category: 'Savings Tips',
        content: `I finally hit my savings goal! Here's a detailed breakdown of how I structured my budget and cut down on unnecessary expenses.

The 50/30/20 rule helped me:
• 50% for needs (rent, utilities, groceries)
• 30% for wants (entertainment, dining out)
• 20% for savings and debt repayment

Key tips that worked for me:
1. Track every single expense using Aerofisc
2. Automate savings transfers on payday
3. Cut subscription services I don't use
4. Cook at home 5 days a week
5. Use cashback and rewards programs

It's not about depriving yourself, but being intentional with your money!`,
    };

    const handleLike = () => {
        if (liked) {
            setLikeCount(likeCount - 1);
        } else {
            setLikeCount(likeCount + 1);
        }
        setLiked(!liked);
    };

    const handleAddComment = () => {
        if (!commentText.trim()) return;

        const newComment = {
            id: comments.length + 1,
            author: 'Test User',
            avatar: 'T',
            content: commentText,
            time: 'Just now',
            isOwn: true,
        };

        setComments([...comments, newComment]);
        setCommentText('');
    };

    const handleEditClick = (comment) => {
        setEditingCommentId(comment.id);
        setEditCommentText(comment.content);
    };

    const handleSaveEdit = (commentId) => {
        if (!editCommentText.trim()) return;

        setComments(comments.map((c) =>
            c.id === commentId ? { ...c, content: editCommentText } : c
        ));
        setEditingCommentId(null);
        setEditCommentText('');
    };

    const handleCancelEdit = () => {
        setEditingCommentId(null);
        setEditCommentText('');
    };

    const handleDeleteComment = (commentId) => {
        if (window.confirm('Delete this comment?')) {
            setComments(comments.filter((c) => c.id !== commentId));
        }
    };

    const handleShare = () => {
        navigator.clipboard.writeText(`Discussion: ${discussion.title}`);
    };

    return (
        <Container maxWidth="md" sx={{ py: 4 }}>
            <Button
                startIcon={<ArrowBack />}
                onClick={() => navigate('/community')}
                sx={{ mb: 3 }}
            >
                Back to Community
            </Button>

            {/* Discussion Post */}
            <Paper elevation={2} sx={{ p: 3, mb: 3 }}>
                {/* Header */}
                <Box display="flex" alignItems="center" gap={2} mb={2}>
                    <Avatar sx={{ bgcolor: 'primary.main' }}>{discussion.avatar}</Avatar>
                    <Box flex={1}>
                        <Typography variant="subtitle1" fontWeight="bold">
                            {discussion.author}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                            {discussion.time}
                        </Typography>
                    </Box>
                    <Chip label={discussion.category} size="small" />
                </Box>

                {/* Title */}
                <Typography variant="h5" fontWeight="bold" gutterBottom>
                    {discussion.title}
                </Typography>

                {/* Content */}
                <Typography variant="body1" paragraph sx={{ whiteSpace: 'pre-line' }}>
                    {discussion.content}
                </Typography>

                {/* Actions */}
                <Box display="flex" gap={2} mt={3}>
                    <Button
                        startIcon={liked ? <ThumbUp /> : <ThumbUpOutlined />}
                        onClick={handleLike}
                        color={liked ? 'primary' : 'inherit'}
                    >
                        {likeCount}
                    </Button>
                    <Button startIcon={<Share />} onClick={handleShare}>
                        Share
                    </Button>
                </Box>
            </Paper>

            {/* Comments Section */}
            <Paper elevation={2} sx={{ p: 3 }}>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                    Comments ({comments.length})
                </Typography>

                <Divider sx={{ my: 2 }} />

                {/* Add Comment */}
                <Box display="flex" gap={1} mb={3}>
                    <TextField
                        fullWidth
                        size="small"
                        placeholder="Write a comment..."
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        onKeyPress={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleAddComment();
                            }
                        }}
                    />
                    <Button variant="contained" onClick={handleAddComment}>
                        Post
                    </Button>
                </Box>

                {/* Comments List */}
                {comments.map((comment) => (
                    <Box key={comment.id} mb={2}>
                        <Box display="flex" gap={2} alignItems="flex-start">
                            <Avatar sx={{ bgcolor: 'secondary.main', width: 32, height: 32 }}>
                                {comment.avatar}
                            </Avatar>
                            <Box flex={1}>
                                <Box display="flex" justifyContent="space-between" alignItems="center">
                                    <Box>
                                        <Typography variant="subtitle2" fontWeight="bold">
                                            {comment.author}
                                            {comment.isOwn && (
                                                <Chip label="You" size="small" sx={{ ml: 1, height: 20 }} />
                                            )}
                                        </Typography>
                                        <Typography variant="caption" color="text.secondary">
                                            {comment.time}
                                        </Typography>
                                    </Box>
                                    {comment.isOwn && editingCommentId !== comment.id && (
                                        <Box>
                                            <IconButton
                                                size="small"
                                                color="primary"
                                                onClick={() => handleEditClick(comment)}
                                            >
                                                <Edit fontSize="small" />
                                            </IconButton>
                                            <IconButton
                                                size="small"
                                                color="error"
                                                onClick={() => handleDeleteComment(comment.id)}
                                            >
                                                <Delete fontSize="small" />
                                            </IconButton>
                                        </Box>
                                    )}
                                </Box>

                                {editingCommentId === comment.id ? (
                                    <Box mt={1}>
                                        <TextField
                                            fullWidth
                                            size="small"
                                            value={editCommentText}
                                            onChange={(e) => setEditCommentText(e.target.value)}
                                            autoFocus
                                        />
                                        <Box display="flex" gap={1} mt={1}>
                                            <Button
                                                size="small"
                                                variant="contained"
                                                onClick={() => handleSaveEdit(comment.id)}
                                            >
                                                Save
                                            </Button>
                                            <Button size="small" onClick={handleCancelEdit}>
                                                Cancel
                                            </Button>
                                        </Box>
                                    </Box>
                                ) : (
                                    <Typography variant="body2" mt={0.5}>
                                        {comment.content}
                                    </Typography>
                                )}
                            </Box>
                        </Box>
                        {comment.id !== comments[comments.length - 1].id && (
                            <Divider sx={{ my: 2 }} />
                        )}
                    </Box>
                ))}
            </Paper>
        </Container>
    );
};

export default DiscussionDetail;
