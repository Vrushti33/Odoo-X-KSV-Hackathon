import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { invoiceService } from '../services/mockData';
import { Table, Card, Badge, Button, Spinner, Alert } from '../components/UI';
import Layout from '../components/Layout';

export const InvoiceListPage = () => {
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const data = invoiceService.getAll();
    setInvoices(data);
    setLoading(false);
  }, []);

  const columns = [
    { key: 'invoiceNumber', label: 'Invoice No' },
    { key: 'poNumber', label: 'PO Number' },
    { key: 'vendorName', label: 'Vendor' },
    { key: 'issueDate', label: 'Issue Date' },
    { key: 'dueDate', label: 'Due Date' },
    { key: 'totalAmount', label: 'Amount', render: (val) => `$${val.toLocaleString()}` },
    {
      key: 'status',
      label: 'Status',
      render: (status) => {
        const variants = { Received: 'success', Paid: 'success', Pending: 'warning' };
        return <Badge variant={variants[status] || 'info'}>{status}</Badge>;
      },
    },
  ];

  if (loading) {
    return (
      <Layout>
        <Spinner size="lg" />
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Invoices</h1>

        <Card>
          <Table
            columns={columns}
            data={invoices}
            actions={(invoice) => (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/invoices/${invoice.id}`)}
              >
                View
              </Button>
            )}
          />
        </Card>
      </div>
    </Layout>
  );
};

export const InvoiceDetailPage = () => {
  const { id } = useParams();
  const [invoice, setInvoice] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const data = invoiceService.getById(id);
    setInvoice(data);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <Spinner size="lg" />
      </Layout>
    );
  }

  if (!invoice) {
    return (
      <Layout>
        <Alert type="danger">Invoice not found</Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{invoice.invoiceNumber}</h1>
            <p className="text-text-secondary">{invoice.vendorName}</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/invoices')}>
            Back to List
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <p className="text-sm text-text-secondary mb-1">PO Number</p>
            <p className="font-semibold">{invoice.poNumber}</p>
          </Card>
          <Card>
            <p className="text-sm text-text-secondary mb-1">Issue Date</p>
            <p className="font-semibold">{invoice.issueDate}</p>
          </Card>
          <Card>
            <p className="text-sm text-text-secondary mb-1">Due Date</p>
            <p className="font-semibold">{invoice.dueDate}</p>
          </Card>
          <Card>
            <p className="text-sm text-text-secondary mb-1">Status</p>
            <Badge variant="success">{invoice.status}</Badge>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Invoice Items</h2>
          <Table
            columns={[
              { key: 'description', label: 'Description' },
              { key: 'amount', label: 'Amount', render: (val) => `$${val.toLocaleString()}` },
            ]}
            data={invoice.items}
          />
        </Card>

        <Card className="bg-blue-50">
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Invoice Total:</p>
            <p className="text-3xl font-bold text-primary">${invoice.totalAmount.toLocaleString()}</p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};
