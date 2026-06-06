import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { rfqService, quotationService, vendorService } from '../services/mockData';
import { Button, Table, Card, Input, Badge, Modal, Select, Spinner, Alert } from '../components/UI';
import Layout from '../components/Layout';

export const RFQListPage = () => {
  const [rfqs, setRfqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    quantity: '',
    unit: '',
    budget: '',
    deadline: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const data = rfqService.getAll();
    setRfqs(data);
    setLoading(false);
  }, []);

  const handleCreateRFQ = (e) => {
    e.preventDefault();
    if (!formData.title || !formData.quantity || !formData.budget) {
      alert('Please fill in required fields');
      return;
    }

    const vendors = vendorService.getAll();
    const newRfq = rfqService.add({
      ...formData,
      referenceNo: 'RFQ-' + Date.now().toString().slice(-6),
      status: 'Open',
      createdBy: 'user1',
      createdAt: new Date().toISOString().split('T')[0],
      vendors: vendors.slice(0, 2).map((v) => v.id),
    });

    setRfqs([...rfqs, newRfq]);
    setFormData({ title: '', description: '', quantity: '', unit: '', budget: '', deadline: '' });
    setShowModal(false);
  };

  const columns = [
    { key: 'referenceNo', label: 'Reference No' },
    { key: 'title', label: 'Title' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'budget', label: 'Budget', render: (val) => `$${val.toLocaleString()}` },
    { key: 'deadline', label: 'Deadline' },
    {
      key: 'status',
      label: 'Status',
      render: (status) => <Badge variant={status === 'Open' ? 'info' : 'danger'}>{status}</Badge>,
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
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Request for Quotations</h1>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Create RFQ
          </Button>
        </div>

        <Card>
          <Table
            columns={columns}
            data={rfqs}
            actions={(rfq) => (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/rfqs/${rfq.id}`)}
              >
                View
              </Button>
            )}
          />
        </Card>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Create RFQ">
          <form onSubmit={handleCreateRFQ} className="space-y-4">
            <Input
              label="Title"
              placeholder="Enter RFQ title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <Input
              label="Description"
              placeholder="Enter RFQ description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <div className="grid grid-cols-2 gap-4">
              <Input
                label="Quantity"
                type="number"
                placeholder="Enter quantity"
                value={formData.quantity}
                onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
              />
              <Input
                label="Unit"
                placeholder="e.g., pieces, kg"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
              />
            </div>
            <Input
              label="Budget"
              type="number"
              placeholder="Enter budget"
              value={formData.budget}
              onChange={(e) => setFormData({ ...formData, budget: e.target.value })}
            />
            <Input
              label="Deadline"
              type="date"
              value={formData.deadline}
              onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Create RFQ
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export const RFQDetailPage = () => {
  const { id } = useParams();
  const [rfq, setRfq] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const rfqData = rfqService.getById(id);
    if (rfqData) {
      setRfq(rfqData);
      const quots = quotationService.getByRfqId(id);
      setQuotations(quots);
    }
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <Spinner size="lg" />
      </Layout>
    );
  }

  if (!rfq) {
    return (
      <Layout>
        <Alert type="danger">RFQ not found</Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{rfq.referenceNo}</h1>
            <p className="text-text-secondary">{rfq.title}</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/rfqs')}>
            Back to List
          </Button>
        </div>

        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-text-secondary mb-1">Status</p>
              <Badge variant={rfq.status === 'Open' ? 'info' : 'danger'}>{rfq.status}</Badge>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Deadline</p>
              <p className="font-semibold">{rfq.deadline}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Quantity</p>
              <p className="font-semibold">{rfq.quantity} {rfq.unit}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Budget</p>
              <p className="font-semibold">${rfq.budget.toLocaleString()}</p>
            </div>
          </div>
          <div>
            <p className="text-sm text-text-secondary mb-1">Description</p>
            <p className="text-text-primary">{rfq.description}</p>
          </div>
        </Card>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Quotations Received</h2>
          {quotations.length === 0 ? (
            <p className="text-text-secondary">No quotations yet</p>
          ) : (
            <Table
              columns={[
                { key: 'vendorName', label: 'Vendor' },
                { key: 'quantity', label: 'Quantity' },
                { key: 'unitPrice', label: 'Unit Price', render: (val) => `$${val}` },
                { key: 'totalPrice', label: 'Total', render: (val) => `$${val.toLocaleString()}` },
                { key: 'deliveryDate', label: 'Delivery' },
                { key: 'status', label: 'Status', render: (status) => <Badge variant="info">{status}</Badge> },
              ]}
              data={quotations}
            />
          )}
        </Card>
      </div>
    </Layout>
  );
};
