/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import React, { useState, useEffect } from 'react'
import {
    Box,
    Typography,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Chip,
    CircularProgress,
    Alert
} from '@mui/material'
import { format } from 'date-fns'
import { useAuth } from '../../context/AuthContext'
import { ProfessionalCard } from '../ui'
import axios from 'axios'

const AuditLogViewer = () => {
    const [logs, setLogs] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const { user } = useAuth()

    useEffect(() => {
        const fetchLogs = async () => {
            try {
                const token = localStorage.getItem('token')
                const response = await axios.get('http://localhost:8080/api/audit/my-logs', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                setLogs(response.data)
            } catch (err) {
                console.error('Failed to fetch audit logs:', err)
                setError('Failed to load security activity logs.')
            } finally {
                setLoading(false)
            }
        }

        fetchLogs()
    }, [])

    const getActionColor = (action) => {
        switch (action) {
            case 'LOGIN':
                return 'success'
            case 'UPDATE_PROFILE':
            case 'UPDATE_PREFERENCES':
                return 'info'
            case 'MFA_VERIFY':
                return 'warning'
            default:
                return 'default'
        }
    }

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}>
                <CircularProgress />
            </Box>
        )
    }

    return (
        <ProfessionalCard
            title="Security Activity Log"
            subheader="Recent security-related actions on your account"
        >
            {error && (
                <Alert severity="error" sx={{ mb: 3 }}>
                    {error}
                </Alert>
            )}

            <TableContainer component={Paper} sx={{ bgcolor: 'transparent', boxShadow: 'none' }}>
                <Table>
                    <TableHead>
                        <TableRow>
                            <TableCell>Action</TableCell>
                            <TableCell>Details</TableCell>
                            <TableCell>IP Address</TableCell>
                            <TableCell>Date & Time</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {logs.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={4} align="center" sx={{ py: 4 }}>
                                    <Typography color="text.secondary">No activity logs found</Typography>
                                </TableCell>
                            </TableRow>
                        ) : (
                            logs.map((log) => (
                                <TableRow key={log.id} hover>
                                    <TableCell>
                                        <Chip
                                            label={log.action}
                                            color={getActionColor(log.action)}
                                            size="small"
                                            variant="outlined"
                                        />
                                    </TableCell>
                                    <TableCell>{log.details}</TableCell>
                                    <TableCell>
                                        <Typography variant="body2" sx={{ fontFamily: 'monospace' }}>
                                            {log.ipAddress}
                                        </Typography>
                                    </TableCell>
                                    <TableCell>
                                        {format(new Date(log.eventTimestamp), 'MMM dd, yyyy HH:mm:ss')}
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </TableContainer>
        </ProfessionalCard>
    )
}

export default AuditLogViewer
