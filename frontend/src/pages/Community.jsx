/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { useState, useEffect } from 'react';
import { Container, Grid, Typography, Box, Fade, Button, TextField, InputAdornment, Snackbar, Alert } from '@mui/material';
import forumService from '../services/forumService';
import { Add, Search } from '@mui/icons-material';
import ForumList from '../components/community/ForumList';
import CreatePostDialog from '../components/community/CreatePostDialog';

const Community = () => {
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
    const [posts, setPosts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [snackbar, setSnackbar] = useState({ open: false, message: '', severity: 'success' });

    useEffect(() => {
        fetchPosts();
    }, []);

    const fetchPosts = async () => {
        try {
            setLoading(true);
            const response = await forumService.getPosts();
            setPosts(response.data);
        } catch (error) {
            console.error('Failed to fetch posts:', error);
            setSnackbar({ open: true, message: 'Failed to load posts', severity: 'error' });
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (event) => {
        setSearchQuery(event.target.value);
    };

    const handleCreatePost = () => {
        setIsCreateDialogOpen(true);
    };

    const handleCloseCreateDialog = () => {
        setIsCreateDialogOpen(false);
    };

    const handlePostCreated = async (newPostData) => {
        try {
            await forumService.createPost(newPostData);
            setSnackbar({ open: true, message: 'Post created successfully', severity: 'success' });
            fetchPosts(); // Refresh list
            handleCloseCreateDialog();
        } catch (error) {
            console.error('Failed to create post:', error);
            setSnackbar({ open: true, message: 'Failed to create post', severity: 'error' });
        }
    };

    const handleCloseSnackbar = () => {
        setSnackbar({ ...snackbar, open: false });
    };

    return (
        <Container maxWidth="lg" sx={{ pb: 4 }}>
            <Fade in timeout={300}>
                <Box mb={4} display="flex" justifyContent="space-between" alignItems="center" flexWrap="wrap" gap={2}>
                    <Box>
                        <Typography variant="h4" gutterBottom sx={{ fontWeight: 700, mb: 0.5 }}>
                            Community
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                            Connect, share tips, and learn from other Aerofisc users
                        </Typography>
                    </Box>
                    <Button
                        variant="contained"
                        startIcon={<Add />}
                        onClick={handleCreatePost}
                        sx={{ borderRadius: 2, px: 3 }}
                    >
                        New Post
                    </Button>
                </Box>
            </Fade>

            <Box mb={4}>
                <TextField
                    fullWidth
                    placeholder="Search discussions..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <Search color="action" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        '& .MuiOutlinedInput-root': {
                            bgcolor: 'background.paper',
                            borderRadius: 2,
                        },
                    }}
                />
            </Box>

            <ForumList posts={posts} loading={loading} searchQuery={searchQuery} />

            <CreatePostDialog
                open={isCreateDialogOpen}
                onClose={handleCloseCreateDialog}
                onSubmit={handlePostCreated}
            />

            <Snackbar open={snackbar.open} autoHideDuration={6000} onClose={handleCloseSnackbar}>
                <Alert onClose={handleCloseSnackbar} severity={snackbar.severity} sx={{ width: '100%' }}>
                    {snackbar.message}
                </Alert>
            </Snackbar>
        </Container>
    );
};

export default Community;
