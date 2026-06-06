import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { apiClient } from '../services/apiClient';
import { Button, Table, Card, Badge, Modal, Input, Spinner, Alert } from '../components/UI';
import Layout from '../components/Layout';
import { useAuth } from '../context/AuthContext';

// ─── Helpers ──────────────────────────────────────────────────────────────────
const statusVariant = (status) => {
  const map = { DRAFT: 'info', SUBMITTED: 'warning', ACCEPTED: 'success', REJECTED: 'danger' };
  return map[status] || 'info';
};

const fmt = (val) => (val != null ? `₹${Number(val).toLocaleString('en-IN', { minimumFractionDigits: 2 })}` : '—');

// ─── QuotationsListPage ───────────────────────────────────────────────────────
export const QuotationsListPage = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    apiClient.get('/quotations')
      .then(setQuotations)
      .catch(err => setError(err.message || 'Failed to load quotations'))
      .finally(() => setLoading(false));
  }, []);

  const columns = [
    { key: 'quotationNumber', label: 'Quotation No.' },
    { key: 'rfqNumber', label: 'RFQ No.' },
    { key: 'vendorName', label: 'Vendor' },
    { key: 'grandTotal', label: 'Total', render: (val) => fmt(val) },
    { key: 'deliveryDays', label: 'Delivery (days)' },
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
          <h1 className="text-2xl font-bold">Quotations</h1>
          <Button variant="primary" onClick={() => navigate('/quotations/submit')}>+ Submit Quotation</Button>
        </div>

        {error && <Alert type="danger">{error}</Alert>}

        <Card>
          {loading ? (
            <div className="flex justify-center py-10"><Spinner size="lg" /></div>
          ) : (
            <Table
              columns={columns}
              data={quotations}
              actions={(q) => (
                <Button variant="outline" size="sm" onClick={() => navigate(`/quotations/compare/${q.rfqId}`)}>
                  Compare RFQ
                </Button>
              )}
            />
          )}
        </Card>
      </div>
    </Layout>
  );
};

// ─── QuotationSubmitPage (Vendor view) ────────────────────────────────────────
export const QuotationSubmitPage = () => {
  const { rfqId: paramRfqId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();

  const [rfqs, setRfqs] = useState([]);
  const [selectedRfqId, setSelectedRfqId] = useState(paramRfqId || '');
  const [rfqDetail, setRfqDetail] = useState(null);
  const [vendors, setVendors] = useState([]);
  const [selectedVendorId, setSelectedVendorId] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('');
  const [taxPct, setTaxPct] = useState('18');
  const [discountPct, setDiscountPct] = useState('0');
  const [notes, setNotes] = useState('');
  const [validityDays, setValidityDays] = useState('30');
  const [lineItems, setLineItems] = useState([]);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Load published RFQs to select from
  useEffect(() => {
    apiClient.get('/rfqs').then(data => {
      const arr = Array.isArray(data) ? data : (data.content || []);
      setRfqs(arr.filter(r => r.status === 'PUBLISHED'));
    }).catch(() => {});
  }, []);

  // Load vendor list (Vendor users can have a linked vendor record)
  useEffect(() => {
    apiClient.get('/vendors').then(data => {
      setVendors(Array.isArray(data) ? data : (data.content || []));
    }).catch(() => {});
  }, []);

  // When RFQ is selected, load its line items to pre-fill form
  useEffect(() => {
    if (!selectedRfqId) { setRfqDetail(null); setLineItems([]); return; }
    apiClient.get(`/rfqs/${selectedRfqId}`).then(rfq => {
      setRfqDetail(rfq);
      setLineItems((rfq.items || []).map(item => ({
        rfqItemId: item.id,
        itemName: item.itemName,
        quantity: item.quantity,
        unitPrice: '',
      })));
    }).catch(() => {});
  }, [selectedRfqId]);

  // Computed totals
  const subtotal = lineItems.reduce((sum, item) => {
    const price = parseFloat(item.unitPrice) || 0;
    return sum + (price * (item.quantity || 1));
  }, 0);
  const taxAmt = subtotal * (parseFloat(taxPct) || 0) / 100;
  const discountAmt = subtotal * (parseFloat(discountPct) || 0) / 100;
  const grandTotal = subtotal + taxAmt - discountAmt;

  const handleLineItemChange = (idx, field, value) => {
    setLineItems(prev => prev.map((item, i) => i === idx ? { ...item, [field]: value } : item));
  };

  const addLineItem = () => {
    setLineItems(prev => [...prev, { rfqItemId: null, itemName: '', quantity: 1, unitPrice: '' }]);
  };

  const removeLineItem = (idx) => {
    setLineItems(prev => prev.filter((_, i) => i !== idx));
  };

  const handleSaveDraft = () => handleSubmitQuotation(false);
  const handleSubmit = () => handleSubmitQuotation(true);

  const handleSubmitQuotation = async (submit) => {
    setError('');
    if (!selectedRfqId || !selectedVendorId) {
      setError('Please select an RFQ and a Vendor');
      return;
    }
    if (lineItems.length === 0) {
      setError('Please add at least one line item');
      return;
    }
    if (lineItems.some(i => !i.itemName || !i.unitPrice)) {
      setError('All line items must have a name and unit price');
      return;
    }

    setSubmitting(true);
    try {
      const payload = {
        rfqId: parseInt(selectedRfqId),
        vendorId: parseInt(selectedVendorId),
        taxPercentage: parseFloat(taxPct) || 0,
        discountPercentage: parseFloat(discountPct) || 0,
        deliveryDays: parseInt(deliveryDays) || null,
        notes,
        validityDays: parseInt(validityDays) || 30,
        items: lineItems.map(item => ({
          rfqItemId: item.rfqItemId || null,
          itemName: item.itemName,
          quantity: parseInt(item.quantity) || 1,
          unitPrice: parseFloat(item.unitPrice),
        })),
      };

      const quotation = await apiClient.post('/quotations', payload);

      if (submit) {
        await apiClient.patch(`/quotations/${quotation.id}/submit`);
        setSuccess(`Quotation ${quotation.quotationNumber} submitted successfully!`);
      } else {
        setSuccess(`Draft saved as ${quotation.quotationNumber}`);
      }
      setTimeout(() => navigate('/quotations'), 2000);
    } catch (err) {
      setError(err.message || 'Failed to submit quotation');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Submit Quotation</h1>
          <Button variant="outline" onClick={() => navigate('/quotations')}>← Back</Button>
        </div>

        {error && <Alert type="danger" onClose={() => setError('')}>{error}</Alert>}
        {success && <Alert type="success">{success}</Alert>}

        {/* Step 1: Select RFQ & Vendor */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">1. Select RFQ & Vendor</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">RFQ *</label>
              <select
                value={selectedRfqId}
                onChange={(e) => setSelectedRfqId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">— Select Published RFQ —</option>
                {rfqs.map(rfq => (
                  <option key={rfq.id} value={rfq.id}>
                    {rfq.rfqNumber} — {rfq.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Vendor *</label>
              <select
                value={selectedVendorId}
                onChange={(e) => setSelectedVendorId(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">— Select Vendor —</option>
                {vendors.map(v => (
                  <option key={v.id} value={v.id}>{v.companyName}</option>
                ))}
              </select>
            </div>
          </div>

          {rfqDetail && (
            <div className="mt-4 p-3 bg-blue-50 rounded-lg text-sm">
              <p className="font-semibold text-blue-800">{rfqDetail.title}</p>
              <p className="text-blue-600">Deadline: {rfqDetail.deadline} · Budget: {rfqDetail.budget ? fmt(rfqDetail.budget) : 'N/A'}</p>
              {rfqDetail.description && <p className="text-slate-600 mt-1">{rfqDetail.description}</p>}
            </div>
          )}
        </Card>

        {/* Step 2: Line Items */}
        <Card>
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">2. Line Items</h2>
            <Button variant="outline" size="sm" type="button" onClick={addLineItem}>+ Add Item</Button>
          </div>

          {lineItems.length === 0 ? (
            <p className="text-slate-400 text-sm text-center py-4">
              {selectedRfqId ? 'No items from RFQ. Click "+ Add Item" to add manually.' : 'Select an RFQ to auto-fill items.'}
            </p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-slate-200 text-left text-slate-600">
                    <th className="pb-2 pr-3">Item Name</th>
                    <th className="pb-2 pr-3 w-24">Qty</th>
                    <th className="pb-2 pr-3 w-32">Unit Price (₹)</th>
                    <th className="pb-2 pr-3 w-28 text-right">Line Total</th>
                    <th className="pb-2 w-10"></th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item, idx) => {
                    const lineTotal = (parseFloat(item.unitPrice) || 0) * (item.quantity || 1);
                    return (
                      <tr key={idx} className="border-b border-slate-100">
                        <td className="py-2 pr-3">
                          <input
                            value={item.itemName}
                            onChange={(e) => handleLineItemChange(idx, 'itemName', e.target.value)}
                            placeholder="Item name"
                            className="w-full border border-slate-300 rounded px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="py-2 pr-3">
                          <input
                            type="number" min="1" value={item.quantity}
                            onChange={(e) => handleLineItemChange(idx, 'quantity', e.target.value)}
                            className="w-full border border-slate-300 rounded px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="py-2 pr-3">
                          <input
                            type="number" min="0" step="0.01" value={item.unitPrice}
                            onChange={(e) => handleLineItemChange(idx, 'unitPrice', e.target.value)}
                            placeholder="0.00"
                            className="w-full border border-slate-300 rounded px-2 py-1 text-sm"
                          />
                        </td>
                        <td className="py-2 pr-3 text-right font-medium">{fmt(lineTotal)}</td>
                        <td className="py-2">
                          <button onClick={() => removeLineItem(idx)} className="text-red-400 hover:text-red-600 text-lg leading-none">×</button>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </Card>

        {/* Step 3: Pricing & Terms */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">3. Pricing & Terms</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Tax %</label>
              <input type="number" value={taxPct} onChange={(e) => setTaxPct(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Discount %</label>
              <input type="number" value={discountPct} onChange={(e) => setDiscountPct(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Delivery Days</label>
              <input type="number" value={deliveryDays} onChange={(e) => setDeliveryDays(e.target.value)}
                placeholder="e.g. 14" className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Valid for (days)</label>
              <input type="number" value={validityDays} onChange={(e) => setValidityDays(e.target.value)}
                className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm" />
            </div>
          </div>

          <div className="mt-4">
            <label className="block text-sm font-medium text-slate-700 mb-1">Notes / Terms & Conditions</label>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Payment terms, warranty, special conditions..."
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Summary */}
          <div className="mt-6 border-t pt-4 space-y-1 text-sm">
            <div className="flex justify-between"><span className="text-slate-500">Subtotal</span><span>{fmt(subtotal)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Tax ({taxPct}%)</span><span>{fmt(taxAmt)}</span></div>
            <div className="flex justify-between"><span className="text-slate-500">Discount ({discountPct}%)</span><span className="text-red-500">-{fmt(discountAmt)}</span></div>
            <div className="flex justify-between font-bold text-base border-t pt-2 mt-2">
              <span>Grand Total</span><span className="text-blue-700">{fmt(grandTotal)}</span>
            </div>
          </div>
        </Card>

        {/* Action Buttons */}
        <div className="flex justify-end gap-3">
          <Button variant="secondary" type="button" onClick={handleSaveDraft} disabled={submitting}>
            {submitting ? 'Saving...' : 'Save as Draft'}
          </Button>
          <Button variant="primary" type="button" onClick={handleSubmit} disabled={submitting}>
            {submitting ? 'Submitting...' : 'Submit Quotation'}
          </Button>
        </div>
      </div>
    </Layout>
  );
};

// ─── QuotationComparePage ─────────────────────────────────────────────────────
export const QuotationComparePage = () => {
  const { rfqId: paramRfqId } = useParams();
  const navigate = useNavigate();
  const [rfqs, setRfqs] = useState([]);
  const [selectedRfqId, setSelectedRfqId] = useState(paramRfqId || '');
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');
  const [timeline, setTimeline] = useState([]);

  useEffect(() => {
    apiClient.get('/rfqs').then(data => {
      const arr = Array.isArray(data) ? data : (data.content || []);
      setRfqs(arr.filter(r => ['PUBLISHED', 'CLOSED'].includes(r.status)));
    }).catch(() => {});
  }, []);

  useEffect(() => {
    if (!selectedRfqId) { setQuotations([]); setTimeline([]); return; }
    setLoading(true);
    Promise.all([
      apiClient.get(`/quotations/rfq/${selectedRfqId}/compare`),
      apiClient.get(`/activity/RFQ/${selectedRfqId}`)
    ])
      .then(([quots, acts]) => {
        setQuotations(quots);
        setTimeline(Array.isArray(acts) ? acts : (acts.content || []));
      })
      .catch(err => setError(err.message))
      .finally(() => setLoading(false));
  }, [selectedRfqId]);

  const handleSelectQuotation = async () => {
    if (!selectedQuotation) return;
    try {
      // POST /api/approvals — create approval request
      await apiClient.post('/approvals', {
        rfqId: parseInt(selectedRfqId),
        quotationId: selectedQuotation.id,
        stepOrder: 1,
      });
      alert('Quotation selected and approval request created!');
      setShowModal(false);
    } catch (err) {
      alert(err.message || 'Failed to create approval');
    }
  };

  const minGrandTotal = quotations.length > 0
    ? Math.min(...quotations.map(q => parseFloat(q.grandTotal) || Infinity))
    : null;

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Compare Quotations</h1>

        {error && <Alert type="danger">{error}</Alert>}

        <Card>
          <div className="mb-6">
            <label className="block text-sm font-medium text-slate-700 mb-1">Select RFQ to Compare</label>
            <select
              value={selectedRfqId}
              onChange={(e) => setSelectedRfqId(e.target.value)}
              className="border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-72"
            >
              <option value="">— Select RFQ —</option>
              {rfqs.map(rfq => (
                <option key={rfq.id} value={rfq.id}>{rfq.rfqNumber} — {rfq.title}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className="flex justify-center py-10"><Spinner size="lg" /></div>
          ) : selectedRfqId && quotations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-slate-50 border-b">
                    <th className="text-left px-4 py-2 text-slate-600">Vendor</th>
                    <th className="text-right px-4 py-2 text-slate-600">Grand Total</th>
                    <th className="text-center px-4 py-2 text-slate-600">Delivery Days</th>
                    <th className="text-center px-4 py-2 text-slate-600">Tax %</th>
                    <th className="text-center px-4 py-2 text-slate-600">Validity</th>
                    <th className="text-center px-4 py-2 text-slate-600">Status</th>
                    <th className="px-4 py-2"></th>
                  </tr>
                </thead>
                <tbody>
                  {quotations.map(q => {
                    const isLowest = parseFloat(q.grandTotal) === minGrandTotal;
                    return (
                      <tr key={q.id} className={`border-b ${isLowest ? 'bg-green-50' : ''}`}>
                        <td className="px-4 py-3 font-semibold">{q.vendorName}{isLowest && <span className="ml-2 text-xs text-green-600 font-bold">★ Lowest</span>}</td>
                        <td className={`px-4 py-3 text-right font-bold ${isLowest ? 'text-green-700' : ''}`}>{fmt(q.grandTotal)}</td>
                        <td className="px-4 py-3 text-center">{q.deliveryDays ?? '—'}</td>
                        <td className="px-4 py-3 text-center">{q.taxPercentage ?? '—'}%</td>
                        <td className="px-4 py-3 text-center">{q.validityDays} days</td>
                        <td className="px-4 py-3 text-center"><Badge variant={statusVariant(q.status)}>{q.status}</Badge></td>
                        <td className="px-4 py-3">
                          {q.status === 'SUBMITTED' && (
                            <Button variant="success" size="sm" onClick={() => { setSelectedQuotation(q); setShowModal(true); }}>
                              Select
                            </Button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          ) : selectedRfqId ? (
            <p className="text-slate-400 text-center py-8">No submitted quotations found for this RFQ.</p>
          ) : (
            <p className="text-slate-400 text-center py-8">Select an RFQ above to compare vendor quotations.</p>
          )}
        </Card>

        {/* Timeline */}
        {selectedRfqId && timeline.length > 0 && (
          <Card>
            <h2 className="text-lg font-semibold mb-4">RFQ Timeline</h2>
            <div className="space-y-4">
              {timeline.map((log) => (
                <div key={log.id} className="flex gap-4 pb-4 border-b border-slate-100 last:border-0">
                  <div className="flex-1">
                    <p className="font-semibold text-sm">{log.action}</p>
                    <p className="text-sm text-slate-600 mb-1">{log.description}</p>
                    <p className="text-xs text-slate-400">By {log.userName} on {new Date(log.createdAt).toLocaleString()}</p>
                  </div>
                </div>
              ))}
            </div>
          </Card>
        )}

        {/* Confirm Modal */}
        <Modal isOpen={showModal} onClose={() => { setShowModal(false); setSelectedQuotation(null); }} title="Select Quotation for Approval">
          {selectedQuotation && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-slate-500 mb-1">Vendor</p>
                <p className="font-semibold text-lg">{selectedQuotation.vendorName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div><p className="text-sm text-slate-500 mb-1">Grand Total</p><p className="font-bold text-blue-700 text-lg">{fmt(selectedQuotation.grandTotal)}</p></div>
                <div><p className="text-sm text-slate-500 mb-1">Delivery</p><p className="font-semibold">{selectedQuotation.deliveryDays ?? '—'} days</p></div>
              </div>
              <p className="text-sm text-slate-500">This will create an approval request for a Manager to review.</p>
              <div className="flex justify-end gap-3 pt-2">
                <Button variant="secondary" onClick={() => { setShowModal(false); setSelectedQuotation(null); }}>Cancel</Button>
                <Button variant="success" onClick={handleSelectQuotation}>Confirm & Send for Approval</Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
};
