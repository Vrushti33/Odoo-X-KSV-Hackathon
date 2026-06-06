import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { Button, Table, Card, Badge, Spinner, Alert } from '../components/UI';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

export const PurchaseOrderListPage = () => {
  const [pos, setPos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { hasRole } = useAuth();

  const fetchPos = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get('/purchase-orders');
      setPos(Array.isArray(data) ? data : data.content || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch purchase orders');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPos();
  }, []);

  const handleGenerateInvoice = async (poId) => {
    try {
      await apiClient.post(`/invoices/generate/${poId}`);
      alert('Invoice generated successfully!');
      navigate('/invoices');
    } catch (err) {
      alert(err.message || 'Failed to generate invoice');
    }
  };

  const columns = [
    { key: 'poNumber', label: 'PO Number' },
    { key: 'rfqNumber', label: 'RFQ No.' },
    { key: 'vendorName', label: 'Vendor' },
    { key: 'poDate', label: 'Order Date' },
    { key: 'grandTotal', label: 'Total', render: (val) => val ? `$${val.toLocaleString()}` : '—' },
    {
      key: 'status',
      label: 'Status',
      render: (status) => <Badge variant={status === 'CONFIRMED' ? 'success' : 'info'}>{status}</Badge>,
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Purchase Orders</h1>

        {error && <Alert type="danger">{error}</Alert>}

        <Card>
          {loading ? (
            <div className="flex justify-center py-10"><Spinner size="lg" /></div>
          ) : (
            <Table
              columns={columns}
              data={pos}
              actions={(po) => (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/purchase-orders/${po.id}`)}>
                    View
                  </Button>
                  {hasRole(['VENDOR', 'ADMIN']) && (
                    <Button variant="success" size="sm" onClick={() => handleGenerateInvoice(po.id)}>
                      Generate Invoice
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

export const PurchaseOrderDetailPage = () => {
  const { id } = useParams();
  const [po, setPo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get(`/purchase-orders/${id}`)
      .then(setPo)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownloadPdf = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      const response = await fetch(`${baseUrl}/purchase-orders/${id}/pdf`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('authToken')}`
        }
      });
      if (!response.ok) throw new Error('Failed to download PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `PO-${po?.poNumber || id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    }
  };

  if (loading) return <Layout><Spinner size="lg" /></Layout>;
  if (error) return <Layout><Alert type="danger">{error}</Alert></Layout>;
  if (!po) return <Layout><Alert type="danger">PO not found</Alert></Layout>;

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{po.poNumber}</h1>
            <p className="text-slate-500">{po.vendorName}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadPdf}>Download PDF</Button>
            <Button variant="outline" onClick={() => navigate('/purchase-orders')}>Back to List</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <p className="text-sm text-slate-500 mb-1">Order Date</p>
            <p className="font-semibold">{po.poDate}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-500 mb-1">Delivery Date</p>
            <p className="font-semibold">{po.deliveryDate}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-500 mb-1">Status</p>
            <Badge variant="success">{po.status}</Badge>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <Table
            columns={[
              { key: 'itemName', label: 'Description' },
              { key: 'quantity', label: 'Quantity' },
              { key: 'unitPrice', label: 'Unit Price', render: (val) => `$${val}` },
              { key: 'lineTotal', label: 'Total', render: (val) => `$${val.toLocaleString()}` },
            ]}
            data={po.items}
          />
        </Card>

        <Card>
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-slate-500">Subtotal</span>
            <span>${po.subtotal?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm mb-4 border-b pb-4">
            <span className="text-slate-500">Tax</span>
            <span>${po.taxAmount?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Grand Total:</p>
            <p className="text-3xl font-bold text-blue-700">${po.grandTotal?.toLocaleString()}</p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};
