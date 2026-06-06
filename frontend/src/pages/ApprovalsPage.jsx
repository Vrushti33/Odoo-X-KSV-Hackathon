import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { Button, Table, Card, Badge, Modal, Spinner, Alert } from '../components/UI';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export const ApprovalsPage = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [remarks, setRemarks] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [timeline, setTimeline] = useState([]);
  const { hasRole } = useAuth();

  const fetchApprovals = useCallback(async () => {
    try {
      setLoading(true);
      const data = await apiClient.get('/approvals');
      setApprovals(Array.isArray(data) ? data : data.content || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch approvals');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchApprovals();
  }, [fetchApprovals]);

  useEffect(() => {
    if (selectedApproval && showModal) {
      apiClient.get(`/activity/APPROVAL/${selectedApproval.id}`)
        .then(data => setTimeline(Array.isArray(data) ? data : (data.content || [])))
        .catch(err => console.error('Failed to fetch timeline', err));
    } else {
      setTimeline([]);
    }
  }, [selectedApproval, showModal]);

  const handleAction = async (action) => {
    if (!selectedApproval) return;
    setActionLoading(true);
    try {
      await apiClient.patch(`/approvals/${selectedApproval.id}/${action}`, { remarks });
      alert(`Quotation ${action}d successfully`);
      setShowModal(false);
      setRemarks('');
      fetchApprovals();
    } catch (err) {
      alert(err.message || `Failed to ${action} approval`);
    } finally {
      setActionLoading(false);
    }
  };

  const columns = [
    { key: 'rfqNumber', label: 'RFQ No.' },
    { key: 'quotationNumber', label: 'Quotation No.' },
    { key: 'vendorName', label: 'Vendor' },
    { key: 'grandTotal', label: 'Amount', render: (val) => val ? `$${val.toLocaleString()}` : '—' },
    { key: 'requestedByName', label: 'Requested By' },
    {
      key: 'status',
      label: 'Status',
      render: (status) => {
        const variants = { PENDING: 'warning', APPROVED: 'success', REJECTED: 'danger' };
        return <Badge variant={variants[status] || 'info'}>{status}</Badge>;
      },
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Quotation Approvals</h1>

        {error && <Alert type="danger">{error}</Alert>}

        <Card>
          {loading ? (
            <div className="flex justify-center py-10"><Spinner size="lg" /></div>
          ) : (
            <Table
              columns={columns}
              data={approvals}
              actions={(approval) => (
                approval.status === 'PENDING' && hasRole(['MANAGER', 'ADMIN']) ? (
                  <Button
                    variant="primary"
                    size="sm"
                    onClick={() => {
                      setSelectedApproval(approval);
                      setRemarks('');
                      setShowModal(true);
                    }}
                  >
                    Review
                  </Button>
                ) : (
                  <Badge variant={approval.status === 'APPROVED' ? 'success' : approval.status === 'REJECTED' ? 'danger' : 'info'}>
                    {approval.status}
                  </Badge>
                )
              )}
            />
          )}
        </Card>

        <Modal
          isOpen={showModal}
          onClose={() => {
            if (!actionLoading) {
              setShowModal(false);
              setSelectedApproval(null);
            }
          }}
          title="Review Quotation Approval"
        >
          {selectedApproval && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-slate-500 mb-1">RFQ</p>
                    <p className="font-semibold">{selectedApproval.rfqNumber}</p>
                  </div>
                  <div>
                    <p className="text-sm text-slate-500 mb-1">Vendor</p>
                    <p className="font-semibold">{selectedApproval.vendorName}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-slate-500 mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-green-700">
                  ${selectedApproval.grandTotal.toLocaleString()}
                </p>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Remarks (Optional)</label>
                <textarea
                  value={remarks}
                  onChange={(e) => setRemarks(e.target.value)}
                  rows={3}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Reason for approval or rejection..."
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="danger"
                  onClick={() => handleAction('reject')}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Processing...' : 'Reject'}
                </Button>
                <Button
                  variant="success"
                  onClick={() => handleAction('approve')}
                  disabled={actionLoading}
                >
                  {actionLoading ? 'Processing...' : 'Approve'}
                </Button>
              </div>

              {timeline.length > 0 && (
                <div className="mt-6 pt-4 border-t">
                  <h3 className="text-sm font-semibold mb-3">Approval History</h3>
                  <div className="space-y-3">
                    {timeline.map(log => (
                      <div key={log.id} className="text-sm bg-slate-50 p-2 rounded border border-slate-100">
                        <p className="font-semibold">{log.action}</p>
                        {log.description && <p className="text-slate-600 mt-0.5">{log.description}</p>}
                        <p className="text-xs text-slate-400 mt-1">{log.userName} on {new Date(log.createdAt).toLocaleString()}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
};


