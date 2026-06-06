import React, { useState, useEffect } from 'react';
import { activityService } from '../services/mockData';
import { Card, Badge, Spinner } from '../components/UI';
import Layout from '../components/Layout';

export const ActivityLogPage = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const data = activityService.getAll();
    setLogs(data.reverse());
    setLoading(false);
  }, []);

  if (loading) {
    return (
      <Layout>
        <Spinner size="lg" />
      </Layout>
    );
  }

  const getTypeColor = (type) => {
    const colors = {
      create: 'success',
      submit: 'info',
      request: 'warning',
      approve: 'success',
      reject: 'danger',
    };
    return colors[type] || 'info';
  };

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Activity Log</h1>

        <Card>
          <div className="space-y-4">
            {logs.map((log) => (
              <div key={log.id} className="flex gap-4 pb-4 border-b border-border last:border-0">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <p className="font-semibold text-text-primary">{log.action}</p>
                    <Badge variant={getTypeColor(log.type)}>{log.type}</Badge>
                  </div>
                  <p className="text-sm text-text-secondary mb-2">{log.description}</p>
                  <div className="flex gap-4 text-xs text-text-secondary">
                    <span>By: {log.user}</span>
                    <span>{log.timestamp}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </Layout>
  );
};
