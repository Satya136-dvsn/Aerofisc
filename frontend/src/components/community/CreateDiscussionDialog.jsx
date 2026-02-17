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
    Button,
    TextField,
    Box,
    Alert,
    Chip,
    IconButton,
} from '@mui/material';
import { Add as AddIcon, Close as CloseIcon } from '@mui/icons-material';
import forumService from '../../services/forumService';

const CreateDiscussionDialog = ({ open, onClose }) => {
    const [formData, setFormData] = useState({
        title: '',
        content: '',
        tags: [],
    });
    const [tagInput, setTagInput] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleAddTag = () => {
        if (tagInput.trim() && formData.tags.length < 5) {
            setFormData({
                ...formData,
                tags: [...formData.tags, tagInput.trim()],
            });
            setTagInput('');
        }
    };

    const handleDeleteTag = (tagToDelete) => {
        setFormData({
            ...formData,
            tags: formData.tags.filter((tag) => tag !== tagToDelete),
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const data = {
                title: formData.title,
                content: formData.content,
                tags: formData.tags.join(','),
            };

            await forumService.createPost(data);
            onClose(true);
            setFormData({ title: '', content: '', tags: [] });
        } catch (err) {
            setError(err.response?.data?.message || 'Failed to create discussion');
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog open={open} onClose={() => onClose(false)} maxWidth="md" fullWidth>
            <DialogTitle>Start a New Discussion</DialogTitle>
            <form onSubmit={handleSubmit}>
                <DialogContent>
                    {error && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            {error}
                        </Alert>
                    )}

                    <TextField
                        fullWidth
                        label="Discussion Title"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        required
                        sx={{ mb: 2 }}
                        placeholder="What would you like to discuss?"
                    />

                    <TextField
                        fullWidth
                        label="Content"
                        name="content"
                        value={formData.content}
                        onChange={handleChange}
                        required
                        multiline
                        rows={6}
                        sx={{ mb: 2 }}
                        placeholder="Share your thoughts, questions, or experiences..."
                    />

                    <Box sx={{ mb: 2 }}>
                        <Box display="flex" gap={1} mb={1}>
                            <TextField
                                size="small"
                                label="Add tags (max 5)"
                                value={tagInput}
                                onChange={(e) => setTagInput(e.target.value)}
                                onKeyPress={(e) => {
                                    if (e.key === 'Enter') {
                                        e.preventDefault();
                                        handleAddTag();
                                    }
                                }}
                                disabled={formData.tags.length >= 5}
                            />
                            <IconButton
                                onClick={handleAddTag}
                                disabled={!tagInput.trim() || formData.tags.length >= 5}
                                color="primary"
                            >
                                <AddIcon />
                            </IconButton>
                        </Box>
                        <Box display="flex" gap={0.5} flexWrap="wrap">
                            {formData.tags.map((tag, index) => (
                                <Chip
                                    key={index}
                                    label={tag}
                                    onDelete={() => handleDeleteTag(tag)}
                                    deleteIcon={<CloseIcon />}
                                    size="small"
                                    color="primary"
                                    variant="outlined"
                                />
                            ))}
                        </Box>
                    </Box>
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => onClose(false)}>Cancel</Button>
                    <Button type="submit" variant="contained" disabled={loading}>
                        {loading ? 'Posting...' : 'Post Discussion'}
                    </Button>
                </DialogActions>
            </form>
        </Dialog>
    );
};

export default CreateDiscussionDialog;
