import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { Button, Card, Input, Alert } from '../components/UI';
import Layout from '../components/Layout';

export const RfqCreatePage = () => {
  const [step, setStep] = useState(1);
  const [categories, setCategories] = useState([]);
  const [vendors, setVendors] = useState([]);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    title: '',
    categoryId: '',
    deadline: '',
    budget: '',
    description: '',
    items: [{ itemName: '', description: '', quantity: 1, unit: 'pcs', estimatedUnitPrice: 0 }],
    vendorIds: []
  });

  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([
      apiClient.get('/categories').catch(() => []),
      apiClient.get('/vendors').catch(() => [])
    ]).then(([catData, vendorData]) => {
      setCategories(Array.isArray(catData) ? catData : catData.content || []);
      setVendors(Array.isArray(vendorData) ? vendorData : vendorData.content || []);
    });
  }, []);

  const handleNext = () => {
    if (step === 1 && (!formData.title || !formData.deadline)) {
      setError('Title and Deadline are required.');
      return;
    }
    if (step === 2 && formData.items.some(i => !i.itemName)) {
      setError('Item Name is required for all line items.');
      return;
    }
    setError('');
    setStep(step + 1);
  };

  const handlePrev = () => setStep(step - 1);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        deadline: formData.deadline,
        budget: formData.budget ? parseFloat(formData.budget) : null,
        categoryId: formData.categoryId ? parseInt(formData.categoryId) : null,
        vendorIds: formData.vendorIds.map(id => parseInt(id)),
        items: formData.items.map(i => ({ 
          ...i, 
          quantity: parseInt(i.quantity) || 1, 
          estimatedUnitPrice: parseFloat(i.estimatedUnitPrice) || 0 
        }))
      };
      
      await apiClient.post('/rfqs', payload);
      navigate('/rfqs');
    } catch (err) {
      setError(err.message || 'Failed to create RFQ');
    }
  };

  const handleItemChange = (index, field, value) => {
    const newItems = [...formData.items];
    newItems[index][field] = value;
    setFormData({ ...formData, items: newItems });
  };

  const addItem = () => {
    setFormData({
      ...formData,
      items: [...formData.items, { itemName: '', description: '', quantity: 1, unit: 'pcs', estimatedUnitPrice: 0 }]
    });
  };

  const removeItem = (index) => {
    const newItems = [...formData.items];
    newItems.splice(index, 1);
    setFormData({ ...formData, items: newItems });
  };

  const toggleVendor = (vendorId) => {
    const newIds = formData.vendorIds.includes(vendorId)
      ? formData.vendorIds.filter(id => id !== vendorId)
      : [...formData.vendorIds, vendorId];
    setFormData({ ...formData, vendorIds: newIds });
  };

  return (
    <Layout>
      <div className="max-w-4xl mx-auto space-y-6">
        <h1 className="text-2xl font-bold">Create New RFQ</h1>
        
        {/* Stepper */}
        <div className="flex items-center justify-between mb-8">
          {[1, 2, 3].map((num) => (
            <div key={num} className="flex flex-col items-center w-1/3">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold mb-2 ${step >= num ? 'bg-primary text-white' : 'bg-slate-200 text-slate-500'}`}>
                {num}
              </div>
              <span className={`text-sm ${step >= num ? 'text-primary font-semibold' : 'text-slate-500'}`}>
                {num === 1 ? 'Details' : num === 2 ? 'Line Items' : 'Select Vendors'}
              </span>
            </div>
          ))}
        </div>

        {error && <Alert type="danger">{error}</Alert>}

        <Card>
          {step === 1 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Step 1: RFQ Details</h2>
              <Input label="Title *" value={formData.title} onChange={(e) => setFormData({ ...formData, title: e.target.value })} />
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Category</label>
                  <select value={formData.categoryId} onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })} className="w-full border border-slate-300 rounded-lg px-3 py-2">
                    <option value="">— Select Category —</option>
                    {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                  </select>
                </div>
                <Input label="Deadline *" type="date" value={formData.deadline} onChange={(e) => setFormData({ ...formData, deadline: e.target.value })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Input label="Estimated Budget" type="number" step="0.01" value={formData.budget} onChange={(e) => setFormData({ ...formData, budget: e.target.value })} />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
                <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} rows={4} className="w-full border border-slate-300 rounded-lg px-3 py-2" />
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="space-y-4">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Step 2: Line Items</h2>
                <Button variant="outline" size="sm" onClick={addItem}>+ Add Item</Button>
              </div>
              {formData.items.map((item, index) => (
                <div key={index} className="p-4 border rounded-lg bg-slate-50 relative">
                  {formData.items.length > 1 && (
                    <button onClick={() => removeItem(index)} className="absolute top-2 right-2 text-red-500 font-bold hover:text-red-700">✕</button>
                  )}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-3">
                    <Input label="Item Name *" value={item.itemName} onChange={(e) => handleItemChange(index, 'itemName', e.target.value)} />
                    <Input label="Quantity" type="number" value={item.quantity} onChange={(e) => handleItemChange(index, 'quantity', e.target.value)} />
                    <Input label="Unit (e.g. pcs, kg)" value={item.unit} onChange={(e) => handleItemChange(index, 'unit', e.target.value)} />
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Input label="Description" value={item.description} onChange={(e) => handleItemChange(index, 'description', e.target.value)} />
                    <Input label="Estimated Unit Price" type="number" step="0.01" value={item.estimatedUnitPrice} onChange={(e) => handleItemChange(index, 'estimatedUnitPrice', e.target.value)} />
                  </div>
                </div>
              ))}
            </div>
          )}

          {step === 3 && (
            <div className="space-y-4">
              <h2 className="text-xl font-semibold mb-4">Step 3: Select Vendors to Invite</h2>
              {vendors.length === 0 ? (
                <p className="text-slate-500">No vendors found in the directory.</p>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {vendors.map(vendor => (
                    <label key={vendor.id} className="flex items-center p-3 border rounded-lg hover:bg-slate-50 cursor-pointer">
                      <input 
                        type="checkbox" 
                        className="w-5 h-5 text-primary border-slate-300 rounded focus:ring-primary"
                        checked={formData.vendorIds.includes(vendor.id)}
                        onChange={() => toggleVendor(vendor.id)}
                      />
                      <div className="ml-3">
                        <p className="font-semibold">{vendor.companyName}</p>
                        <p className="text-sm text-slate-500">{vendor.email}</p>
                      </div>
                    </label>
                  ))}
                </div>
              )}
            </div>
          )}

          <div className="flex justify-between mt-8 pt-4 border-t">
            {step > 1 ? (
              <Button variant="secondary" onClick={handlePrev}>Back</Button>
            ) : (
              <Button variant="secondary" onClick={() => navigate('/rfqs')}>Cancel</Button>
            )}
            
            {step < 3 ? (
              <Button variant="primary" onClick={handleNext}>Next Step</Button>
            ) : (
              <Button variant="success" onClick={handleSubmit}>Save Draft RFQ</Button>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
};
