import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { Button, Table, Card, Input, Badge, Modal, Alert, Spinner } from '../components/UI';
import Layout from '../components/Layout';

// ─── Status badge helpers ─────────────────────────────────────────────────────
const statusVariant = (status) => {
  const map = { ACTIVE: 'success', INACTIVE: 'danger', PENDING: 'warning', BLOCKED: 'danger' };
  return map[status] || 'info';
};

// ─── VendorsListPage ──────────────────────────────────────────────────────────
export const VendorsListPage = () => {
  const [vendors, setVendors] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingVendor, setEditingVendor] = useState(null);
  const [saving, setSaving] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  const emptyForm = {
    companyName: '', contactPerson: '', email: '', phone: '',
    gstNumber: '', address: '', city: '', state: '', country: '', pincode: '',
    categoryIds: [],
  };
  const [formData, setFormData] = useState(emptyForm);
  const navigate = useNavigate();

  const fetchVendors = useCallback(async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams();
      if (searchQuery) params.append('search', searchQuery);
      if (filterStatus) params.append('status', filterStatus);
      const query = params.toString() ? `?${params}` : '';
      const data = await apiClient.get(`/vendors${query}`);
      // Response may be a Page object or an array
      setVendors(Array.isArray(data) ? data : (data.content || []));
    } catch (err) {
      setError(err.message || 'Failed to load vendors');
    } finally {
      setLoading(false);
    }
  }, [searchQuery, filterStatus]);

  const fetchCategories = async () => {
    try {
      const data = await apiClient.get('/categories');
      setCategories(data);
    } catch {
      // non-critical
    }
  };

  useEffect(() => {
    fetchVendors();
    fetchCategories();
  }, [fetchVendors]);

  const openAddModal = () => {
    setEditingVendor(null);
    setFormData(emptyForm);
    setShowModal(true);
  };

  const openEditModal = (vendor) => {
    setEditingVendor(vendor);
    setFormData({
      companyName: vendor.companyName || '',
      contactPerson: vendor.contactPerson || '',
      email: vendor.email || '',
      phone: vendor.phone || '',
      gstNumber: vendor.gstNumber || '',
      address: vendor.address || '',
      city: vendor.city || '',
      state: vendor.state || '',
      country: vendor.country || '',
      pincode: vendor.pincode || '',
      categoryIds: vendor.categories ? vendor.categories.map(c => c.id) : [],
    });
    setShowModal(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!formData.companyName || !formData.email) {
      alert('Company name and email are required');
      return;
    }
    setSaving(true);
    try {
      if (editingVendor) {
        await apiClient.put(`/vendors/${editingVendor.id}`, formData);
      } else {
        await apiClient.post('/vendors', formData);
      }
      setShowModal(false);
      fetchVendors();
    } catch (err) {
      alert(err.message || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const columns = [
    { key: 'companyName', label: 'Vendor Name' },
    {
      key: 'categories',
      label: 'Categories',
      render: (cats) => (cats && cats.length > 0 ? cats.map(c => c.name).join(', ') : '—'),
    },
    { key: 'email', label: 'Email' },
    { key: 'phone', label: 'Phone' },
    { key: 'gstNumber', label: 'GST No.' },
    {
      key: 'status',
      label: 'Status',
      render: (status) => <Badge variant={statusVariant(status)}>{status}</Badge>,
    },
  ];

  return (
    <Layout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Vendor Management</h1>
          <Button variant="primary" onClick={openAddModal}>+ Add Vendor</Button>
        </div>

        {error && <Alert type="danger" onClose={() => setError('')}>{error}</Alert>}

        {/* Filters */}
        <div className="flex flex-wrap gap-3">
          <input
            type="text"
            placeholder="Search vendors..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-56"
          />
          <select
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
            className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Status</option>
            <option value="ACTIVE">Active</option>
            <option value="INACTIVE">Inactive</option>
            <option value="PENDING">Pending</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>

        <Card>
          {loading ? (
            <div className="flex justify-center py-10"><Spinner size="lg" /></div>
          ) : (
            <Table
              columns={columns}
              data={vendors}
              actions={(vendor) => (
                <div className="flex gap-2">
                  <Button variant="outline" size="sm" onClick={() => navigate(`/vendors/${vendor.id}`)}>
                    View
                  </Button>
                  <Button variant="secondary" size="sm" onClick={() => openEditModal(vendor)}>
                    Edit
                  </Button>
                </div>
              )}
            />
          )}
        </Card>

        {/* Add / Edit Modal */}
        <Modal isOpen={showModal} onClose={() => setShowModal(false)} title={editingVendor ? 'Edit Vendor' : 'Add New Vendor'}>
          <form onSubmit={handleSave} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <Input label="Company Name *" value={formData.companyName}
                onChange={(e) => setFormData({ ...formData, companyName: e.target.value })} />
              <Input label="Contact Person" value={formData.contactPerson}
                onChange={(e) => setFormData({ ...formData, contactPerson: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Email *" type="email" value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })} />
              <Input label="Phone" value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="GST Number" value={formData.gstNumber}
                onChange={(e) => setFormData({ ...formData, gstNumber: e.target.value })} />
              <Input label="Pincode" value={formData.pincode}
                onChange={(e) => setFormData({ ...formData, pincode: e.target.value })} />
            </div>
            <Input label="Address" value={formData.address}
              onChange={(e) => setFormData({ ...formData, address: e.target.value })} />
            <div className="grid grid-cols-3 gap-4">
              <Input label="City" value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
              <Input label="State" value={formData.state}
                onChange={(e) => setFormData({ ...formData, state: e.target.value })} />
              <Input label="Country" value={formData.country}
                onChange={(e) => setFormData({ ...formData, country: e.target.value })} />
            </div>

            {/* Category multi-select */}
            {categories.length > 0 && (
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Categories</label>
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <label key={cat.id} className="flex items-center gap-1 text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        checked={formData.categoryIds.includes(cat.id)}
                        onChange={(e) => {
                          const ids = e.target.checked
                            ? [...formData.categoryIds, cat.id]
                            : formData.categoryIds.filter(id => id !== cat.id);
                          setFormData({ ...formData, categoryIds: ids });
                        }}
                      />
                      {cat.name}
                    </label>
                  ))}
                </div>
              </div>
            )}

            <div className="flex justify-end gap-3 pt-4">
              <Button variant="secondary" type="button" onClick={() => setShowModal(false)}>Cancel</Button>
              <Button variant="primary" type="submit" disabled={saving}>
                {saving ? 'Saving...' : (editingVendor ? 'Update Vendor' : 'Add Vendor')}
              </Button>
            </div>
          </form>
        </Modal>
      </div>
    </Layout>
  );
};

// ─── VendorDetailPage ─────────────────────────────────────────────────────────
export const VendorDetailPage = () => {
  const { id } = useParams();
  const [vendor, setVendor] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get(`/vendors/${id}`)
      .then(setVendor)
      .catch(err => setError(err.message || 'Failed to load vendor'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <Layout><div className="flex justify-center py-20"><Spinner size="lg" /></div></Layout>;
  if (error)  return <Layout><Alert type="danger">{error}</Alert></Layout>;
  if (!vendor) return <Layout><Alert type="danger">Vendor not found</Alert></Layout>;

  return (
    <Layout>
      <div className="space-y-6 max-w-3xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-1">{vendor.companyName}</h1>
            <p className="text-slate-500">
              {vendor.categories && vendor.categories.map(c => c.name).join(' · ')}
            </p>
          </div>
          <Button variant="outline" onClick={() => navigate('/vendors')}>← Back</Button>
        </div>

        <Card>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div><p className="text-sm text-slate-500 mb-1">Contact Person</p><p className="font-semibold">{vendor.contactPerson || '—'}</p></div>
            <div><p className="text-sm text-slate-500 mb-1">Email</p><p className="font-semibold">{vendor.email}</p></div>
            <div><p className="text-sm text-slate-500 mb-1">Phone</p><p className="font-semibold">{vendor.phone || '—'}</p></div>
            <div><p className="text-sm text-slate-500 mb-1">GST Number</p><p className="font-semibold">{vendor.gstNumber || '—'}</p></div>
            <div><p className="text-sm text-slate-500 mb-1">Status</p><Badge variant={statusVariant(vendor.status)}>{vendor.status}</Badge></div>
            <div><p className="text-sm text-slate-500 mb-1">Rating</p><p className="font-semibold">★ {vendor.rating?.toFixed(2)} / 5.00</p></div>
            <div className="md:col-span-2">
              <p className="text-sm text-slate-500 mb-1">Address</p>
              <p className="font-semibold">
                {[vendor.address, vendor.city, vendor.state, vendor.pincode, vendor.country].filter(Boolean).join(', ')}
              </p>
            </div>
          </div>
        </Card>
      </div>
    </Layout>
  );
};
