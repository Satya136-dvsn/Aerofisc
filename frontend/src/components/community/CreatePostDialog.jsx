/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { useState } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Button,
    MenuItem,
    Box,
    IconButton,
    Typography,
} from '@mui/material';
import { Close } from '@mui/icons-material';

const categories = [
    'Savings Tips',
    'Investing',
    'Debt Management',
    'Budgeting Help',
    'Frugal Living',
    'Financial News',
];

const CreatePostDialog = ({ open, onClose, onSubmit }) => {
    const [postData, setPostData] = useState({
        title: '',
        category: '',
        content: '',
    });

    const handleChange = (e) => {
        setPostData({
            ...postData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = () => {
        if (postData.title && postData.content) {
            onSubmit(postData);
            setPostData({ title: '', category: '', content: '' });
        }
    };

    return (
        <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ m: 0, p: 2, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant="h6" component="div" fontWeight="bold">
                    Create New Post
                </Typography>
                <IconButton
                    aria-label="close"
                    onClick={onClose}
                    sx={{
                        color: (theme) => theme.palette.grey[500],
                    }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <DialogContent dividers>
                <Box display="flex" flexDirection="column" gap={3} pt={1}>
                    <TextField
                        fullWidth
                        label="Title"
                        name="title"
                        value={postData.title}
                        onChange={handleChange}
                        placeholder="What's on your mind?"
                    />
                    <TextField
                        select
                        fullWidth
                        label="Category"
                        name="category"
                        value={postData.category}
                        onChange={handleChange}
                    >
                        {categories.map((option) => (
                            <MenuItem key={option} value={option}>
                                {option}
                            </MenuItem>
                        ))}
                    </TextField>
                    <TextField
                        fullWidth
                        multiline
                        rows={6}
                        label="Content"
                        name="content"
                        value={postData.content}
                        onChange={handleChange}
                        placeholder="Share your thoughts, questions, or tips..."
                    />
                </Box>
            </DialogContent>
            <DialogActions sx={{ p: 2 }}>
                <Button onClick={onClose} color="inherit">
                    Cancel
                </Button>
                <Button onClick={handleSubmit} variant="contained" disabled={!postData.title || !postData.content}>
                    Post
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default CreatePostDialog;
