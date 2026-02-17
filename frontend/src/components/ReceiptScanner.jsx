/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import React, { useState, useRef } from 'react';
import {
    Box,
    Button,
    Card,
    CardContent,
    Typography,
    CircularProgress,
    Alert,
    TextField,
    Grid,
    IconButton,
    Chip,
} from '@mui/material';
import {
    CloudUpload as UploadIcon,
    Receipt as ReceiptIcon,
    Close as CloseIcon,
    AutoAwesome as MagicIcon,
} from '@mui/icons-material';
import { createWorker } from 'tesseract.js';

const ReceiptScanner = ({ onDataExtracted, onClose }) => {
    const [image, setImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const [processing, setProcessing] = useState(false);
    const [progress, setProgress] = useState(0);
    const [error, setError] = useState('');
    const [extractedText, setExtractedText] = useState('');
    const [extractedData, setExtractedData] = useState({
        amount: '',
        description: '',
        date: '',
    });
    const fileInputRef = useRef(null);

    const handleFileSelect = (event) => {
        const file = event.target.files[0];
        if (file) {
            if (!file.type.startsWith('image/')) {
                setError('Please select an image file');
                return;
            }
            if (file.size > 10 * 1024 * 1024) {
                setError('Image size should be less than 10MB');
                return;
            }
            setImage(file);
            setError('');

            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreview(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    const processReceipt = async () => {
        if (!image) return;

        setProcessing(true);
        setProgress(0);
        setError('');

        try {
            const worker = await createWorker('eng', 1, {
                logger: (m) => {
                    if (m.status === 'recognizing text') {
                        setProgress(Math.round(m.progress * 100));
                    }
                },
            });

            const { data: { text } } = await worker.recognize(image);
            setExtractedText(text);

            // Parse the extracted text for common receipt patterns
            const parsedData = parseReceiptText(text);
            setExtractedData(parsedData);

            await worker.terminate();
        } catch (err) {
            console.error('OCR Error:', err);
            setError('Failed to process receipt. Please try again or enter details manually.');
        } finally {
            setProcessing(false);
        }
    };

    // Parse receipt text to extract amount, description, and date
    const parseReceiptText = (text) => {
        const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

        // Patterns for amount detection
        const amountPatterns = [
            /(?:total|amount|grand total|subtotal|sum)[\s:]*[\$€£₹]?\s*([\d,]+\.?\d*)/i,
            /[\$€£₹]\s*([\d,]+\.?\d*)/,
            /(\d{1,3}(?:,\d{3})*(?:\.\d{2})?)\s*(?:total|amount)?/i,
        ];

        // Patterns for date detection
        const datePatterns = [
            /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/,
            /(\d{4}[\/\-\.]\d{1,2}[\/\-\.]\d{1,2})/,
            /((?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s+\d{1,2},?\s+\d{4})/i,
        ];

        let amount = '';
        let date = '';
        let description = '';

        // Look for amount
        for (const pattern of amountPatterns) {
            for (const line of lines) {
                const match = line.match(pattern);
                if (match) {
                    const potentialAmount = parseFloat(match[1].replace(/,/g, ''));
                    if (!isNaN(potentialAmount) && potentialAmount > 0) {
                        amount = potentialAmount.toString();
                        break;
                    }
                }
            }
            if (amount) break;
        }

        // Look for date
        for (const pattern of datePatterns) {
            for (const line of lines) {
                const match = line.match(pattern);
                if (match) {
                    date = match[1];
                    break;
                }
            }
            if (date) break;
        }

        // Get store/merchant name (usually first line or after known headers)
        const storePatterns = [/^([A-Z][A-Za-z\s&']+)$/];
        for (const line of lines.slice(0, 3)) {
            if (line.length > 3 && line.length < 50 && !line.match(/\d{5,}/)) {
                description = line;
                break;
            }
        }

        return { amount, date, description };
    };

    const handleApply = () => {
        if (onDataExtracted) {
            onDataExtracted({
                amount: parseFloat(extractedData.amount) || 0,
                description: extractedData.description,
                date: extractedData.date,
            });
        }
        if (onClose) onClose();
    };

    const handleInputChange = (field) => (event) => {
        setExtractedData({
            ...extractedData,
            [field]: event.target.value,
        });
    };

    return (
        <Card sx={{ maxWidth: 600, mx: 'auto' }}>
            <CardContent>
                <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
                    <Typography variant="h6" display="flex" alignItems="center" gap={1}>
                        <ReceiptIcon color="primary" />
                        Receipt Scanner (OCR)
                    </Typography>
                    {onClose && (
                        <IconButton onClick={onClose} size="small">
                            <CloseIcon />
                        </IconButton>
                    )}
                </Box>

                {error && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        {error}
                    </Alert>
                )}

                {!imagePreview ? (
                    <Box
                        sx={{
                            border: '2px dashed',
                            borderColor: 'divider',
                            borderRadius: 2,
                            p: 4,
                            textAlign: 'center',
                            cursor: 'pointer',
                            '&:hover': { borderColor: 'primary.main', bgcolor: 'action.hover' },
                        }}
                        onClick={() => fileInputRef.current?.click()}
                    >
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleFileSelect}
                            accept="image/*"
                            style={{ display: 'none' }}
                        />
                        <UploadIcon sx={{ fontSize: 48, color: 'text.secondary', mb: 1 }} />
                        <Typography>Click to upload receipt image</Typography>
                        <Typography variant="caption" color="text.secondary">
                            Supports JPG, PNG (Max 10MB)
                        </Typography>
                    </Box>
                ) : (
                    <>
                        <Box position="relative" mb={2}>
                            <img
                                src={imagePreview}
                                alt="Receipt preview"
                                style={{
                                    width: '100%',
                                    maxHeight: 200,
                                    objectFit: 'contain',
                                    borderRadius: 8,
                                }}
                            />
                            <IconButton
                                size="small"
                                sx={{ position: 'absolute', top: 8, right: 8, bgcolor: 'background.paper' }}
                                onClick={() => {
                                    setImage(null);
                                    setImagePreview(null);
                                    setExtractedText('');
                                    setExtractedData({ amount: '', description: '', date: '' });
                                }}
                            >
                                <CloseIcon />
                            </IconButton>
                        </Box>

                        {!extractedText && !processing && (
                            <Button
                                fullWidth
                                variant="contained"
                                startIcon={<MagicIcon />}
                                onClick={processReceipt}
                                sx={{ mb: 2 }}
                            >
                                Extract Data from Receipt
                            </Button>
                        )}

                        {processing && (
                            <Box textAlign="center" py={3}>
                                <CircularProgress variant="determinate" value={progress} size={60} />
                                <Typography variant="body2" color="text.secondary" mt={1}>
                                    Processing... {progress}%
                                </Typography>
                            </Box>
                        )}

                        {extractedText && (
                            <>
                                <Chip label="Data Extracted" color="success" size="small" sx={{ mb: 2 }} />

                                <Grid container spacing={2}>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Amount"
                                            value={extractedData.amount}
                                            onChange={handleInputChange('amount')}
                                            type="number"
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12} sm={6}>
                                        <TextField
                                            fullWidth
                                            label="Date"
                                            value={extractedData.date}
                                            onChange={handleInputChange('date')}
                                            size="small"
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            fullWidth
                                            label="Description"
                                            value={extractedData.description}
                                            onChange={handleInputChange('description')}
                                            size="small"
                                        />
                                    </Grid>
                                </Grid>

                                <Box display="flex" gap={1} mt={2}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={handleApply}
                                        disabled={!extractedData.amount}
                                    >
                                        Apply to Transaction
                                    </Button>
                                    <Button
                                        variant="outlined"
                                        onClick={processReceipt}
                                    >
                                        Re-scan
                                    </Button>
                                </Box>
                            </>
                        )}
                    </>
                )}
            </CardContent>
        </Card>
    );
};

export default ReceiptScanner;
