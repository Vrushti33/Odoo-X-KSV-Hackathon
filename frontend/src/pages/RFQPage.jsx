import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { Button, Table, Card, Input, Badge, Modal, Spinner, Alert } from '../components/UI';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

const statusVariant = (status) => {
  const map = { DRAFT: 'secondary', PUBLISHED: 'info', CLOSED: 'warning', AWARDED: 'success', CANCELLED: 'danger' };
  return map[status] || 'info';
};

export const RFQListPage = () => {
  const [rfqs, setRfqs] = useState([]);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const { user, hasRole } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      apiClient.get('/rfqs'),
      apiClient.get('/categories').catch(() => []),
      apiClient.get('/vendors').catch(() => [])
    ]).then(([rfqData, catData, vendorData]) => {
      setRfqs(Array.isArray(rfqData) ? rfqData : rfqData.content || []);
      setCategories(Array.isArray(catData) ? catData : catData.content || []);
      setVendors(Array.isArray(vendorData) ? vendorData : vendorData.content || []);
    }).catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, []);



  const handlePublish = async (id) => {
    try {
      const updatedRfq = await apiClient.patch(`/rfqs/${id}/publish`);
      setRfqs(rfqs.map(r => r.id === id ? updatedRfq : r));
    } catch (err) {
      alert(err.message || 'Failed to publish RFQ');
    }
  };

  const columns = [
    { key: 'rfqNumber', label: 'RFQ No.' },
    { key: 'title', label: 'Title' },
    { key: 'categoryName', label: 'Category' },
    { key: 'budget', label: 'Budget', render: (val) => val ? `$${val.toLocaleString()}` : '—' },
    { key: 'deadline', label: 'Deadline' },
    {
      key: 'status',
      label: 'Status',
      render: (status) => <Badge variant={statusVariant(status)}>{status}</Badge>,
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Request for Quotations</h1>
          {hasRole(['ADMIN', 'PROCUREMENT_OFFICER']) && (
            <Button variant="primary" onClick={() => navigate('/rfqs/create')}>+ Create RFQ</Button>
          )}
        </div>

        {error && <Alert type="danger">{error}</Alert>}

        <Card>
          {loading ? (
            <div className="flex justify-center py-10"><Spinner size="lg" /></div>
          ) : (
            <Table
              columns={columns}
              data={rfqs}
              actions={(rfq) => (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/rfqs/${rfq.id}`)}>
                    View
                  </Button>
                  {rfq.status === 'DRAFT' && hasRole(['ADMIN', 'PROCUREMENT_OFFICER']) && (
                    <Button variant="success" size="sm" onClick={() => handlePublish(rfq.id)}>
                      Publish
                    </Button>
                  )}
                </div>
              )}
            />
          )}
        </Card>


      </div>
    </Layout>
  );
};

export const RFQDetailPage = () => {
  const { id } = useParams();
  const [rfq, setRfq] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  useEffect(() => {
    apiClient.get(`/rfqs/${id}`)
      .then(async (rfqData) => {
        setRfq(rfqData);
        if (hasRole(['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER'])) {
          try {
            const quots = await apiClient.get(`/quotations/rfq/${id}`);
            setQuotations(quots);
          } catch (e) { /* ignore */ }
        }
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id, hasRole]);

  if (loading) return <Layout><div className="flex justify-center py-20"><Spinner size="lg" /></div></Layout>;
  if (error) return <Layout><Alert type="danger">{error}</Alert></Layout>;
  if (!rfq) return <Layout><Alert type="danger">RFQ not found</Alert></Layout>;

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{rfq.rfqNumber}</h1>
            <p className="text-slate-500 text-lg">{rfq.title}</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/rfqs')}>← Back</Button>
        </div>

        <Card>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-6">
            <div><p className="text-sm text-slate-500 mb-1">Status</p><Badge variant={statusVariant(rfq.status)}>{rfq.status}</Badge></div>
            <div><p className="text-sm text-slate-500 mb-1">Deadline</p><p className="font-semibold">{rfq.deadline}</p></div>
            <div><p className="text-sm text-slate-500 mb-1">Budget</p><p className="font-semibold">{rfq.budget ? `$${rfq.budget.toLocaleString()}` : '—'}</p></div>
            <div><p className="text-sm text-slate-500 mb-1">Category</p><p className="font-semibold">{rfq.categoryName || '—'}</p></div>
          </div>
          <div className="border-t pt-4">
            <p className="text-sm text-slate-500 mb-1">Description</p>
            <p className="whitespace-pre-wrap">{rfq.description || 'No description provided.'}</p>
          </div>
        </Card>

        {rfq.items && rfq.items.length > 0 && (
          <Card>
            <h2 className="text-xl font-semibold mb-4">Required Items</h2>
            <Table
              columns={[
                { key: 'itemName', label: 'Item' },
                { key: 'description', label: 'Description' },
                { key: 'quantity', label: 'Qty' },
                { key: 'unit', label: 'Unit' },
                { key: 'estimatedUnitPrice', label: 'Est. Price', render: (val) => val ? `$${val}` : '—' }
              ]}
              data={rfq.items}
            />
          </Card>
        )}

        {hasRole(['ADMIN', 'PROCUREMENT_OFFICER', 'MANAGER']) && (
          <Card>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold">Quotations Received</h2>
              {quotations.length > 0 && (
                <Button variant="primary" size="sm" onClick={() => navigate(`/quotations/compare/${id}`)}>
                  Compare Quotes
                </Button>
              )}
            </div>
            
            {quotations.length === 0 ? (
              <p className="text-slate-500">No quotations submitted yet.</p>
            ) : (
              <Table
                columns={[
                  { key: 'vendorName', label: 'Vendor' },
                  { key: 'grandTotal', label: 'Total', render: (val) => `$${val.toLocaleString()}` },
                  { key: 'deliveryDays', label: 'Delivery' },
                  { key: 'status', label: 'Status', render: (status) => <Badge variant="info">{status}</Badge> },
                ]}
                data={quotations}
              />
            )}
          </Card>
        )}
      </div>
    </Layout>
  );
};
