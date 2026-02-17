/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Typography, Chip, Avatar, Paper, IconButton, Stack, CircularProgress, Button } from '@mui/material';
import { ThumbUp, ThumbUpOutlined, Comment, Share, MoreVert } from '@mui/icons-material';
import forumService from '../../services/forumService';

const ForumList = ({ posts, loading, searchQuery }) => {
    const navigate = useNavigate();
    const [localPosts, setLocalPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState(new Set());

    // Initialize local posts when props change
    useEffect(() => {
        if (posts && posts.length > 0) {
            setLocalPosts(posts);
        }
    }, [posts]);

    const filteredPosts = localPosts.filter((post) =>
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.content.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleLike = async (e, postId) => {
        e.stopPropagation();
        try {
            await forumService.likePost(postId);

            setLocalPosts(prevPosts =>
                prevPosts.map(post => {
                    if (post.id === postId) {
                        const isLiked = likedPosts.has(postId);
                        return {
                            ...post,
                            likes: isLiked ? post.likes - 1 : post.likes + 1
                        };
                    }
                    return post;
                })
            );

            setLikedPosts(prev => {
                const newSet = new Set(prev);
                if (newSet.has(postId)) {
                    newSet.delete(postId);
                } else {
                    newSet.add(postId);
                }
                return newSet;
            });
        } catch (error) {
            console.error('Failed to like post:', error);
        }
    };

    const handlePostClick = (postId) => {
        navigate(`/community/${postId}`);
    };

    if (loading) {
        return (
            <Box display="flex" justifyContent="center" p={4}>
                <CircularProgress />
            </Box>
        );
    }

    if (filteredPosts.length === 0) {
        return (
            <Box textAlign="center" p={4}>
                <Typography color="text.secondary">No posts found.</Typography>
            </Box>
        );
    }

    return (
        <Stack spacing={3}>
            {filteredPosts.map((post) => {
                const isLiked = likedPosts.has(post.id);

                return (
                    <Paper
                        key={post.id}
                        elevation={0}
                        sx={{
                            p: 3,
                            borderRadius: 2,
                            border: '1px solid',
                            borderColor: 'divider',
                            cursor: 'pointer',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            '&:hover': {
                                transform: 'translateY(-2px)',
                                boxShadow: 4,
                            },
                        }}
                        onClick={() => handlePostClick(post.id)}
                    >
                        <Box display="flex" justifyContent="space-between" alignItems="flex-start" mb={2}>
                            <Box display="flex" alignItems="center" gap={2}>
                                <Avatar sx={{ bgcolor: 'primary.main' }}>{post.avatar}</Avatar>
                                <Box>
                                    <Typography variant="subtitle2" fontWeight="bold">
                                        {post.author}
                                    </Typography>
                                    <Typography variant="caption" color="text.secondary">
                                        {post.time}
                                    </Typography>
                                </Box>
                            </Box>
                            <IconButton size="small" onClick={(e) => e.stopPropagation()}>
                                <MoreVert />
                            </IconButton>
                        </Box>

                        <Typography variant="h6" gutterBottom fontWeight="bold">
                            {post.title}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" paragraph>
                            {post.content}
                        </Typography>

                        <Box display="flex" alignItems="center" justifyContent="space-between" mt={2}>
                            <Chip label={post.category} size="small" sx={{ bgcolor: 'action.hover' }} />

                            <Box display="flex" gap={2}>
                                <Button
                                    startIcon={isLiked ? <ThumbUp fontSize="small" /> : <ThumbUpOutlined fontSize="small" />}
                                    size="small"
                                    color={isLiked ? "primary" : "inherit"}
                                    onClick={(e) => handleLike(e, post.id)}
                                >
                                    {post.likes}
                                </Button>
                                <Button
                                    startIcon={<Comment fontSize="small" />}
                                    size="small"
                                    color="inherit"
                                >
                                    {post.comments}
                                </Button>
                                <Button
                                    startIcon={<Share fontSize="small" />}
                                    size="small"
                                    color="inherit"
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        navigator.clipboard.writeText(`Post: ${post.title}`);
                                    }}
                                >
                                    Share
                                </Button>
                            </Box>
                        </Box>
                    </Paper>
                );
            })}
        </Stack>
    );
};

export default ForumList;
