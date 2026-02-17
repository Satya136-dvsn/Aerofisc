/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import { useState } from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    IconButton,
    Chip,
    Menu,
    MenuItem,
    Typography,
    Box,
    Avatar
} from '@mui/material';
import { MoreVert, CheckCircle, Block, Delete, Visibility } from '@mui/icons-material';

const UserManagementTable = ({ users, onUpdateStatus, onDeleteUser, onViewTransactions }) => {
    const [anchorEl, setAnchorEl] = useState(null);
    const [selectedUser, setSelectedUser] = useState(null);

    const handleMenuOpen = (event, user) => {
        setAnchorEl(event.currentTarget);
        setSelectedUser(user);
    };

    const handleMenuClose = () => {
        setAnchorEl(null);
        setSelectedUser(null);
    };

    const handleStatusChange = (status) => {
        if (selectedUser) {
            onUpdateStatus(selectedUser.id, status);
        }
        handleMenuClose();
    };

    const handleDelete = () => {
        if (selectedUser) {
            onDeleteUser(selectedUser.id);
        }
        handleMenuClose();
    };

    const getStatusColor = (status) => {
        switch (status) {
            case 'Active': return 'success';
            case 'Inactive': return 'warning';
            case 'Suspended': return 'error';
            default: return 'default';
        }
    };

    return (
        <Paper elevation={0} sx={{ border: '1px solid', borderColor: 'divider', borderRadius: 2, overflow: 'hidden' }}>
            <Box p={3} borderBottom="1px solid" borderColor="divider">
                <Typography variant="h6" fontWeight="bold">
                    User Management
                </Typography>
            </Box>
            <TableContainer>
                <Table>
                    <TableHead>
                        <TableRow sx={{ bgcolor: 'background.default' }}>
                            <TableCell>User</TableCell>
                            <TableCell>Role</TableCell>
                            <TableCell>Status</TableCell>
                            <TableCell>Joined</TableCell>
                            <TableCell align="right">Actions</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {users.map((user) => (
                            <TableRow key={user.id} hover>
                                <TableCell>
                                    <Box display="flex" alignItems="center" gap={2}>
                                        <Avatar sx={{ bgcolor: 'primary.light', color: 'primary.main' }}>
                                            {user.name.charAt(0)}
                                        </Avatar>
                                        <Box>
                                            <Typography variant="subtitle2" fontWeight="bold">
                                                {user.name}
                                            </Typography>
                                            <Typography variant="caption" color="text.secondary">
                                                {user.email}
                                            </Typography>
                                        </Box>
                                    </Box>
                                </TableCell>
                                <TableCell>{user.role}</TableCell>
                                <TableCell>
                                    <Chip
                                        label={user.status}
                                        size="small"
                                        color={getStatusColor(user.status)}
                                        variant="outlined"
                                    />
                                </TableCell>
                                <TableCell>{user.joined}</TableCell>
                                <TableCell align="right">
                                    <IconButton size="small" onClick={(e) => handleMenuOpen(e, user)}>
                                        <MoreVert />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Menu
                anchorEl={anchorEl}
                open={Boolean(anchorEl)}
                onClose={handleMenuClose}
            >
                <MenuItem onClick={() => {
                    if (selectedUser && onViewTransactions) {
                        onViewTransactions(selectedUser.id, selectedUser.name);
                    }
                    handleMenuClose();
                }}>
                    <Visibility fontSize="small" sx={{ mr: 1, color: 'info.main' }} /> View Profile
                </MenuItem>
                <MenuItem onClick={() => handleStatusChange('Active')}>
                    <CheckCircle fontSize="small" sx={{ mr: 1, color: 'success.main' }} /> Activate
                </MenuItem>
                <MenuItem onClick={() => handleStatusChange('Suspended')}>
                    <Block fontSize="small" sx={{ mr: 1, color: 'warning.main' }} /> Suspend
                </MenuItem>
                <MenuItem onClick={handleDelete} sx={{ color: 'error.main' }}>
                    <Delete fontSize="small" sx={{ mr: 1 }} /> Delete
                </MenuItem>
            </Menu>
        </Paper>
    );
};

export default UserManagementTable;
