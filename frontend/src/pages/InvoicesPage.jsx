import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { Button, Table, Card, Badge, Spinner, Alert } from '../components/UI';
import Layout from '../components/Layout';

export const InvoiceListPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const data = await apiClient.get('/invoices');
      setInvoices(Array.isArray(data) ? data : data.content || []);
    } catch (err) {
      setError(err.message || 'Failed to fetch invoices');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchInvoices();
  }, []);

  const columns = [
    { key: 'invoiceNumber', label: 'Invoice Number' },
    { key: 'poNumber', label: 'PO No.' },
    { key: 'vendorName', label: 'Vendor' },
    { key: 'invoiceDate', label: 'Date' },
    { key: 'grandTotal', label: 'Total', render: (val) => val ? `$${val.toLocaleString()}` : '—' },
    {
      key: 'status',
      label: 'Status',
      render: (status) => <Badge variant={status === 'SUBMITTED' ? 'info' : 'success'}>{status}</Badge>,
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Invoices</h1>

        {error && <Alert type="danger">{error}</Alert>}

        <Card>
          {loading ? (
            <div className="flex justify-center py-10"><Spinner size="lg" /></div>
          ) : (
            <Table
              columns={columns}
              data={invoices}
              actions={(invoice) => (
                <Button variant="outline" size="sm" onClick={() => navigate(`/invoices/${invoice.id}`)}>
                  View
                </Button>
              )}
            />
          )}
        </Card>
      </div>
    </Layout>
  );
};

export const InvoiceDetailPage = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get(`/invoices/${id}`)
      .then(setInvoice)
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownloadPdf = async () => {
    try {
      const baseUrl = import.meta.env.VITE_API_URL || 'http://localhost:8080/api';
      const response = await fetch(`${baseUrl}/invoices/${id}/pdf`, {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('authToken')}` }
      });
      if (!response.ok) throw new Error('Failed to download PDF');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `INV-${invoice?.invoiceNumber || id}.pdf`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message);
    }
  };

  const handleSendEmail = async () => {
    try {
      await apiClient.post(`/invoices/${id}/send-email`);
      alert('Email sent successfully!');
    } catch (err) {
      alert(err.message || 'Failed to send email');
    }
  };

  if (loading) return <Layout><Spinner size="lg" /></Layout>;
  if (error) return <Layout><Alert type="danger">{error}</Alert></Layout>;
  if (!invoice) return <Layout><Alert type="danger">Invoice not found</Alert></Layout>;

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{invoice.invoiceNumber}</h1>
            <p className="text-slate-500">{invoice.vendorName}</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={handleDownloadPdf}>Download PDF</Button>
            <Button variant="primary" onClick={handleSendEmail}>Email Invoice</Button>
            <Button variant="outline" onClick={() => navigate('/invoices')}>Back to List</Button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <p className="text-sm text-slate-500 mb-1">Invoice Date</p>
            <p className="font-semibold">{invoice.invoiceDate}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-500 mb-1">Due Date</p>
            <p className="font-semibold text-red-600">{invoice.dueDate}</p>
          </Card>
          <Card>
            <p className="text-sm text-slate-500 mb-1">Status</p>
            <Badge variant="info">{invoice.status}</Badge>
          </Card>
          <Card>
            <p className="text-sm text-slate-500 mb-1">Payment</p>
            <Badge variant={invoice.paymentStatus === 'PAID' ? 'success' : 'danger'}>{invoice.paymentStatus}</Badge>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Invoice Items</h2>
          <Table
            columns={[
              { key: 'itemName', label: 'Description' },
              { key: 'quantity', label: 'Quantity' },
              { key: 'unitPrice', label: 'Unit Price', render: (val) => `$${val}` },
              { key: 'lineTotal', label: 'Total', render: (val) => `$${val.toLocaleString()}` },
            ]}
            data={invoice.items}
          />
        </Card>

        <Card>
          <div className="flex justify-between items-center text-sm mb-2">
            <span className="text-slate-500">Subtotal</span>
            <span>${invoice.subtotal?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center text-sm mb-4 border-b pb-4">
            <span className="text-slate-500">IGST</span>
            <span>${invoice.igst?.toLocaleString()}</span>
          </div>
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Grand Total:</p>
            <p className="text-3xl font-bold text-green-700">${invoice.grandTotal?.toLocaleString()}</p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};
