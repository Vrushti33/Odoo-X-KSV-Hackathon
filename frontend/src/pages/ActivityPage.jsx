import React, { useState, useEffect } from 'react';
import { apiClient } from '../services/apiClient';
import { Card, Badge, Spinner, Alert } from '../components/UI';
import Layout from '../components/Layout';

export const ActivityLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchLogs = async () => {
      try {
        const data = await apiClient.get('/activity');
        // If paginated, might be in data.content or just data
        const arr = Array.isArray(data) ? data : (data.content || []);
        setLogs(arr);
      } catch (err) {
        setError(err.message || 'Failed to fetch activity logs');
      } finally {
        setLoading(false);
      }
    };
    fetchLogs();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-10"><Spinner size="lg" /></div>
      </Layout>
    );
  }

  const getTypeColor = (type) => {
    if (!type) return 'info';
    const t = type.toLowerCase();
    if (t.includes('create') || t.includes('approve') || t.includes('success')) return 'success';
    if (t.includes('reject') || t.includes('delete') || t.includes('cancel')) return 'danger';
    if (t.includes('request') || t.includes('submit')) return 'warning';
    return 'info';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '';
    const d = new Date(dateStr);
    return d.toLocaleString();
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Activity Log</h1>

        {error && <Alert type="danger">{error}</Alert>}

        <Card>
          <div className="space-y-4">
            {logs.length === 0 ? (
              <p className="text-slate-500 text-center py-4">No recent activity.</p>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="flex gap-4 pb-4 border-b border-border last:border-0">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <p className="font-semibold text-text-primary">{log.entityType} {log.action}</p>
                      <Badge variant={getTypeColor(log.action)}>{log.action}</Badge>
                    </div>
                    <p className="text-sm text-text-secondary mb-2">{log.description}</p>
                    <div className="flex gap-4 text-xs text-text-secondary">
                      <span>By: {log.userName}</span>
                      <span>{formatDate(log.createdAt)}</span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
};
