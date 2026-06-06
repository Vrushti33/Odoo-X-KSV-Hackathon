import React, { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { approvalService, poService } from '../services/mockData';
import { Button, Table, Card, Badge, Modal, Spinner, Alert } from '../components/UI';
import Layout from '../components/Layout';

export const ApprovalsPage = () => {
  const [approvals, setApprovals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedApproval, setSelectedApproval] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    const data = approvalService.getAll();
    setApprovals(data);
    setLoading(false);
  }, []);

  const handleApprove = (approval) => {
    const updatedApproval = approvalService.update(approval.id, { status: 'Approved' });
    setApprovals(approvals.map((a) => (a.id === approval.id ? updatedApproval : a)));
    setShowModal(false);

    // Create PO after approval
    const newPO = poService.add({
      poNumber: 'PO-' + Date.now().toString().slice(-6),
      rfqNo: approval.rfqNo,
      vendorName: approval.vendorName,
      orderDate: new Date().toISOString().split('T')[0],
      deliveryDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      totalAmount: approval.amount,
      status: 'Confirmed',
      items: [{ itemNo: 1, description: 'Approved items', quantity: 1, unitPrice: approval.amount, totalPrice: approval.amount }],
    });

    alert('Quotation approved! Purchase Order created: ' + newPO.poNumber);
  };

  const handleReject = (approval) => {
    approvalService.update(approval.id, { status: 'Rejected' });
    setApprovals(approvals.map((a) => (a.id === approval.id ? { ...a, status: 'Rejected' } : a)));
    setShowModal(false);
    alert('Quotation rejected');
  };

  const columns = [
    { key: 'rfqNo', label: 'RFQ No' },
    { key: 'vendorName', label: 'Vendor' },
    { key: 'amount', label: 'Amount', render: (val) => `$${val.toLocaleString()}` },
    { key: 'requestedAt', label: 'Requested' },
    {
      key: 'status',
      label: 'Status',
      render: (status) => {
        const variants = { Pending: 'warning', Approved: 'success', Rejected: 'danger' };
        return <Badge variant={variants[status]}>{status}</Badge>;
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
        <h1 className="text-2xl font-bold">Quotation Approvals</h1>

        <Card>
          <Table
            columns={columns}
            data={approvals}
            actions={(approval) => (
              approval.status === 'Pending' ? (
                <Button
                  variant="primary"
                  size="sm"
                  onClick={() => {
                    setSelectedApproval(approval);
                    setShowModal(true);
                  }}
                >
                  Review
                </Button>
              ) : (
                <Badge variant={approval.status === 'Approved' ? 'success' : 'danger'}>
                  {approval.status}
                </Badge>
              )
            )}
          />
        </Card>

        <Modal
          isOpen={showModal}
          onClose={() => {
            setShowModal(false);
            setSelectedApproval(null);
          }}
          title="Review Quotation Approval"
        >
          {selectedApproval && (
            <div className="space-y-4">
              <div className="bg-blue-50 p-4 rounded-lg">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-text-secondary mb-1">RFQ</p>
                    <p className="font-semibold">{selectedApproval.rfqNo}</p>
                  </div>
                  <div>
                    <p className="text-sm text-text-secondary mb-1">Vendor</p>
                    <p className="font-semibold">{selectedApproval.vendorName}</p>
                  </div>
                </div>
              </div>
              <div className="bg-green-50 p-4 rounded-lg">
                <p className="text-sm text-text-secondary mb-1">Total Amount</p>
                <p className="text-2xl font-bold text-success">
                  ${selectedApproval.amount.toLocaleString()}
                </p>
              </div>
              <div className="flex justify-end gap-3 pt-4">
                <Button
                  variant="danger"
                  onClick={() => handleReject(selectedApproval)}
                >
                  Reject
                </Button>
                <Button
                  variant="success"
                  onClick={() => handleApprove(selectedApproval)}
                >
                  Approve
                </Button>
              </div>
            </div>
          )}
        </Modal>
      </div>
    </Layout>
  );
};

export const PurchaseOrderListPage = () => {
  const [pos, setPos] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const data = poService.getAll();
    setPos(data);
    setLoading(false);
  }, []);

  const columns = [
    { key: 'poNumber', label: 'PO Number' },
    { key: 'rfqNo', label: 'RFQ No' },
    { key: 'vendorName', label: 'Vendor' },
    { key: 'orderDate', label: 'Order Date' },
    { key: 'totalAmount', label: 'Total', render: (val) => `$${val.toLocaleString()}` },
    {
      key: 'status',
      label: 'Status',
      render: (status) => <Badge variant={status === 'Confirmed' ? 'success' : 'info'}>{status}</Badge>,
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
        <h1 className="text-2xl font-bold">Purchase Orders</h1>

        <Card>
          <Table
            columns={columns}
            data={pos}
            actions={(po) => (
              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(`/purchase-orders/${po.id}`)}
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

export const PurchaseOrderDetailPage = () => {
  const { id } = useParams();
  const [po, setPo] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const data = poService.getById(id);
    setPo(data);
    setLoading(false);
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <Spinner size="lg" />
      </Layout>
    );
  }

  if (!po) {
    return (
      <Layout>
        <Alert type="danger">Purchase Order not found</Alert>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6 max-w-4xl">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold mb-2">{po.poNumber}</h1>
            <p className="text-text-secondary">{po.vendorName}</p>
          </div>
          <Button variant="outline" onClick={() => navigate('/purchase-orders')}>
            Back to List
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <p className="text-sm text-text-secondary mb-1">Order Date</p>
            <p className="font-semibold">{po.orderDate}</p>
          </Card>
          <Card>
            <p className="text-sm text-text-secondary mb-1">Delivery Date</p>
            <p className="font-semibold">{po.deliveryDate}</p>
          </Card>
          <Card>
            <p className="text-sm text-text-secondary mb-1">Status</p>
            <Badge variant="success">{po.status}</Badge>
          </Card>
        </div>

        <Card>
          <h2 className="text-xl font-semibold mb-4">Order Items</h2>
          <Table
            columns={[
              { key: 'itemNo', label: 'Item No' },
              { key: 'description', label: 'Description' },
              { key: 'quantity', label: 'Quantity' },
              { key: 'unitPrice', label: 'Unit Price', render: (val) => `$${val}` },
              { key: 'totalPrice', label: 'Total', render: (val) => `$${val.toLocaleString()}` },
            ]}
            data={po.items}
          />
        </Card>

        <Card>
          <div className="flex justify-between items-center">
            <p className="text-lg font-semibold">Grand Total:</p>
            <p className="text-3xl font-bold text-primary">${po.totalAmount.toLocaleString()}</p>
          </div>
        </Card>
      </div>
    </Layout>
  );
};
