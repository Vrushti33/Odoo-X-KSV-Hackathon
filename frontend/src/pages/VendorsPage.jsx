import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { vendorService } from '../services/mockData';
import { Button, Table, Card, Input, Badge, Modal, Alert, Spinner } from '../components/UI';
import Layout from '../components/Layout';

export const VendorsListPage = () => {
  const [vendors, setVendors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    address: '',
    category: '',
  });
  const navigate = useNavigate();

  useEffect(() => {
    const data = vendorService.getAll();
    setVendors(data);
    setLoading(false);
  }, []);

  const handleAddVendor = (e) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.phone) {
      alert('Please fill in required fields');
      return;
    }

    const newVendor = vendorService.add({
      ...formData,
      status: 'Active',
      rating: 4.0,
    });

    setVendors([...vendors, newVendor]);
    setFormData({ name: '', email: '', phone: '', address: '', category: '' });
    setShowModal(false);
  };

  const columns = [
    { key: 'name', label: 'Vendor Name' },
    { key: 'category', label: 'Category' },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    {
      key: 'status',
      label: 'Status',
      render: (status) => <Badge variant={status === 'Active' ? 'success' : 'danger'}>{status}</Badge>,
    },
  ];

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center items-center h-full">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Vendor Management</h1>
          <Button variant="primary" onClick={() => setShowModal(true)}>
            + Add Vendor
          </Button>
        </div>

        <Card>
          <Table
            columns={columns}
            data={vendors}
            actions={(vendor) => (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/vendors/${vendor.id}`)}
              >
                View Details
              </Button>
            )}
          />
        </Card>

        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title="Add New Vendor">
          <form onSubmit={handleAddVendor} className="space-y-4">
            <Input
              label="Vendor Name"
              placeholder="Enter vendor name"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Email"
              type="email"
              placeholder="Enter vendor email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Phone"
              placeholder="Enter vendor phone"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
            <Input
              label="Address"
              placeholder="Enter vendor address"
              value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })}
            />
            <Input
              label="Category"
              placeholder="Enter vendor category"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            />
            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" onClick={() => setShowModal(false)}>
                Cancel
              </Button>
              <Button variant="primary" type="submit">
                Add Vendor
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

export const VendorDetailPage = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const data = vendorService.getById(id);
    setVendor(data);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <Spinner size="lg" />
      </Layout>
    );
  }

  if (!vendor) {
    return (
      <Layout>
        <Alert type="danger">Vendor not found</Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-2xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{vendor.name}</h1>
            <p className="text-text-secondary">{vendor.category}</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/vendors')}>
            Back to List
          </Button>
        </div>

        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-sm text-text-secondary mb-1">Email</p>
              <p className="font-semibold">{vendor.email}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Phone</p>
              <p className="font-semibold">{vendor.phone}</p>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Status</p>
              <Badge variant={vendor.status === 'Active' ? 'success' : 'danger'}>{vendor.status}</Badge>
            </div>
            <div>
              <p className="text-sm text-text-secondary mb-1">Rating</p>
              <p className="font-semibold">★ {vendor.rating} / 5.0</p>
            </div>
            <div className="md:col-span-2">
              <p className="text-sm text-text-secondary mb-1">Address</p>
              <p className="font-semibold">{vendor.address}</p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};
