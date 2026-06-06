import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { quotationService, rfqService, approvalService } from '../services/mockData';
import { Button, Table, Card, Badge, Modal, Input, Spinner, Alert } from '../components/UI';
import Layout from '../components/Layout';

export const QuotationsListPage = () => {
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const data = quotationService.getAll();
    setQuotations(data);
    setLoading(false);
  }, []);

  const columns = [
    { key: 'rfqNo', label: 'RFQ No' },
    { key: 'vendorName', label: 'Vendor' },
    { key: 'quantity', label: 'Quantity' },
    { key: 'unitPrice', label: 'Unit Price', render: (val) => `$${val}` },
    { key: 'totalPrice', label: 'Total', render: (val) => `$${val.toLocaleString()}` },
    { key: 'deliveryDate', label: 'Delivery Date' },
    {
      key: 'status',
      label: 'Status',
      render: (status) => <Badge variant={status === 'Submitted' ? 'info' : 'success'}>{status}</Badge>,
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
        <h1 className="text-2xl font-bold">Quotations</h1>

        <Card>
          <Table
            columns={columns}
            data={quotations}
            actions={(quotation) => (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/quotations/${quotation.id}`)}
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

export const QuotationComparePage = () => {
  const [rfqs, setRfqs] = useState([]);
  const [selectedRfqId, setSelectedRfqId] = useState(null);
  const [quotations, setQuotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedQuotation, setSelectedQuotation] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);

  useEffect(() => {
    const data = rfqService.getAll().filter((r) => r.status === 'Open');
    setRfqs(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    if (selectedRfqId) {
      const quots = quotationService.getByRfqId(selectedRfqId);
      setQuotations(quots);
    } else {
      setQuotations([]);
    }
  }, [selectedRfqId]);

  const handleApproveQuotation = () => {
    if (!selectedQuotation) return;

    const approval = approvalService.add({
      quotationId: selectedQuotation.id,
      rfqNo: selectedQuotation.rfqNo,
      vendorName: selectedQuotation.vendorName,
      amount: selectedQuotation.totalPrice,
      status: 'Pending',
      requestedBy: 'user1',
      requestedAt: new Date().toISOString().split('T')[0],
      approverRole: 'MANAGER',
    });

    alert('Quotation approved and sent for manager approval');
    setShowApprovalModal(false);
    setSelectedQuotation(null);
  };

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
        <h1 className="text-2xl font-bold">Compare Quotations</h1>

        <Card>
          <div className="mb-6">
            <label className="form-label">Select RFQ to Compare</label>
            <select
              className="form-select"
              value={selectedRfqId || ''}
              onChange={(e) => setSelectedRfqId(e.target.value)}
            >
              <option value="">-- Select RFQ --</option>
              {rfqs.map((rfq) => (
                <option key={rfq.id} value={rfq.id}>
                  {rfq.referenceNo} - {rfq.title}
                </option>
              ))}
            </select>
          </div>

          {selectedRfqId && quotations.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-border">
                    <th className="table-header">Vendor</th>
                    <th className="table-header text-right">Unit Price</th>
                    <th className="table-header text-right">Total Price</th>
                    <th className="table-header">Delivery Date</th>
                    <th className="table-header">Payment Terms</th>
                    <th className="table-header">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {quotations.map((q) => (
                    <tr key={q.id} className="border-b border-border hover:bg-gray-50">
                      <td className="table-cell font-semibold">{q.vendorName}</td>
                      <td className="table-cell text-right">${q.unitPrice}</td>
                      <td className="table-cell text-right font-bold text-primary">
                        ${q.totalPrice.toLocaleString()}
                      </td>
                      <td className="table-cell">{q.deliveryDate}</td>
                      <td className="table-cell">{q.paymentTerms}</td>
                      <td className="table-cell">
                        <Button
                          variant="success"
                          size="sm"
                          onClick={() => {
                            setSelectedQuotation(q);
                            setShowApprovalModal(true);
                          }}
                        >
                          Select
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : selectedRfqId ? (
            <p className="text-text-secondary">No quotations found for this RFQ</p>
          ) : (
            <p className="text-text-secondary">Select an RFQ to view quotations</p>
          )}
        </Card>

        <Modal
          isOpen={showApprovalModal}
          onClose={() => {
            setShowApprovalModal(false);
            setSelectedQuotation(null);
          }}
          title="Approve Quotation"
        >
          {selectedQuotation && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <p className="text-sm text-text-secondary mb-1">Vendor</p>
                <p className="font-semibold">{selectedQuotation.vendorName}</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-text-secondary mb-1">Unit Price</p>
                  <p className="font-semibold">${selectedQuotation.unitPrice}</p>
                </div>
                <div>
                  <p className="text-sm text-text-secondary mb-1">Total Amount</p>
                  <p className="font-semibold text-lg text-primary">
                    ${selectedQuotation.totalPrice.toLocaleString()}
                  </p>
                </div>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="secondary"
                  onClick={() => {
                    setShowApprovalModal(false);
                    setSelectedQuotation(null);
                  }}
                >
                  Cancel
                </Button>
                <Button variant="success" onClick={handleApproveQuotation}>
                  Approve & Send for Review
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
};
