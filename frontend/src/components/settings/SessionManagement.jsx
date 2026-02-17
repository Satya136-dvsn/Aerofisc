/*
 * © 2026 VenkataSatyanarayana Duba
 * aerofisc - Proprietary Software
 * Unauthorized copying or distribution prohibited.
*/

import React, { useState, useEffect } from 'react';
import api from '../../services/axiosConfig';
import './SessionManagement.css';

const SessionManagement = () => {
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    useEffect(() => {
        fetchSessions();
    }, []);

    const fetchSessions = async () => {
        try {
            setLoading(true);
            setError('');
            const response = await api.get('/sessions');
            setSessions(response.data);
        } catch (err) {
            setError('Failed to load sessions');
            console.error('Error fetching sessions:', err);
        } finally {
            setLoading(false);
        }
    };

    const revokeSession = async (sessionId) => {
        if (!window.confirm('Are you sure you want to revoke this session?')) {
            return;
        }

        try {
            await api.delete(`/sessions/${sessionId}`);
            setSuccessMessage('Session revoked successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
            fetchSessions();
        } catch (err) {
            setError('Failed to revoke session');
            console.error('Error revoking session:', err);
        }
    };

    const revokeAllOtherSessions = async () => {
        if (!window.confirm('Are you sure you want to revoke all other sessions? You will remain logged in on this device.')) {
            return;
        }

        try {
            await api.delete('/sessions/all');
            setSuccessMessage('All other sessions revoked successfully');
            setTimeout(() => setSuccessMessage(''), 3000);
            fetchSessions();
        } catch (err) {
            setError('Failed to revoke sessions');
            console.error('Error revoking all sessions:', err);
        }
    };

    const formatDate = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    if (loading) {
        return (
            <div className="session-management">
                <h3>Active Sessions</h3>
                <div className="loading">Loading sessions...</div>
            </div>
        );
    }

    return (
        <div className="session-management">
            <div className="session-header">
                <h3>Active Sessions</h3>
                {sessions.length > 1 && (
                    <button
                        onClick={revokeAllOtherSessions}
                        className="revoke-all-btn"
                    >
                        Revoke All Other Sessions
                    </button>
                )}
            </div>

            {error && <div className="error-message">{error}</div>}
            {successMessage && <div className="success-message">{successMessage}</div>}

            {sessions.length === 0 ? (
                <p className="no-sessions">No active sessions found</p>
            ) : (
                <div className="sessions-list">
                    {sessions.map((session) => (
                        <div key={session.id} className="session-card">
                            <div className="session-info">
                                <div className="session-detail">
                                    <span className="label">Created:</span>
                                    <span className="value">{formatDate(session.createdAt)}</span>
                                </div>
                                <div className="session-detail">
                                    <span className="label">Expires:</span>
                                    <span className="value">{formatDate(session.expiresAt)}</span>
                                </div>
                            </div>
                            <button
                                onClick={() => revokeSession(session.id)}
                                className="revoke-btn"
                            >
                                Revoke
                            </button>
                        </div>
                    ))}
                </div>
            )}

            <div className="session-info-box">
                <p>
                    <strong>Note:</strong> Sessions represent your active logins across different devices.
                    Revoking a session will log you out from that device.
                </p>
            </div>
        </div>
    );
};

export default SessionManagement;
