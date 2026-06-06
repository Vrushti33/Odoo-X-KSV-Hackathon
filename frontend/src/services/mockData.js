// Mock data services for all features
const mockVendors = [
  {
    id: 'v1',
    name: 'TechSupply Ltd',
    email: 'contact@techsupply.com',
    phone: '555-0101',
    address: '123 Tech Street, City, State 12345',
    category: 'Electronics',
    status: 'Active',
    rating: 4.5,
  },
  {
    id: 'v2',
    name: 'Industrial Parts Co',
    email: 'sales@industrialparts.com',
    phone: '555-0102',
    address: '456 Factory Ave, Industrial City, State 67890',
    category: 'Components',
    status: 'Active',
    rating: 4.2,
  },
  {
    id: 'v3',
    name: 'Global Materials Inc',
    email: 'info@globalmaterials.com',
    phone: '555-0103',
    address: '789 Trade Park, Trade City, State 11111',
    category: 'Raw Materials',
    status: 'Inactive',
    rating: 3.8,
  },
];

const mockRFQs = [
  {
    id: 'rfq1',
    referenceNo: 'RFQ-2024-001',
    title: 'Electronic Components Procurement',
    description: 'Seeking suppliers for various electronic components',
    quantity: 1000,
    unit: 'pieces',
    budget: 50000,
    deadline: '2024-12-31',
    status: 'Open',
    createdBy: 'user1',
    createdAt: '2024-11-01',
    vendors: ['v1', 'v2'],
  },
  {
    id: 'rfq2',
    referenceNo: 'RFQ-2024-002',
    title: 'Raw Material Supply',
    description: 'Monthly supply of industrial raw materials',
    quantity: 5000,
    unit: 'kg',
    budget: 100000,
    deadline: '2024-12-15',
    status: 'Open',
    createdBy: 'user1',
    createdAt: '2024-11-05',
    vendors: ['v3'],
  },
  {
    id: 'rfq3',
    referenceNo: 'RFQ-2024-003',
    title: 'Office Supplies',
    description: 'Quarterly office supply procurement',
    quantity: 500,
    unit: 'items',
    budget: 10000,
    deadline: '2024-11-30',
    status: 'Closed',
    createdBy: 'user1',
    createdAt: '2024-10-15',
    vendors: ['v1'],
  },
];

const mockQuotations = [
  {
    id: 'q1',
    rfqId: 'rfq1',
    rfqNo: 'RFQ-2024-001',
    vendorId: 'v1',
    vendorName: 'TechSupply Ltd',
    quantity: 1000,
    unitPrice: 45.50,
    totalPrice: 45500,
    deliveryDate: '2024-12-20',
    paymentTerms: 'Net 30',
    validUntil: '2024-11-30',
    status: 'Submitted',
    submittedAt: '2024-11-10',
  },
  {
    id: 'q2',
    rfqId: 'rfq1',
    rfqNo: 'RFQ-2024-001',
    vendorId: 'v2',
    vendorName: 'Industrial Parts Co',
    quantity: 1000,
    unitPrice: 48.00,
    totalPrice: 48000,
    deliveryDate: '2024-12-18',
    paymentTerms: 'Net 45',
    validUntil: '2024-12-05',
    status: 'Submitted',
    submittedAt: '2024-11-12',
  },
];

const mockApprovals = [
  {
    id: 'apr1',
    quotationId: 'q1',
    rfqNo: 'RFQ-2024-001',
    vendorName: 'TechSupply Ltd',
    amount: 45500,
    status: 'Pending',
    requestedBy: 'user1',
    requestedAt: '2024-11-15',
    approverRole: 'MANAGER',
  },
];

const mockPurchaseOrders = [
  {
    id: 'po1',
    poNumber: 'PO-2024-001',
    rfqNo: 'RFQ-2024-003',
    vendorName: 'TechSupply Ltd',
    orderDate: '2024-11-01',
    deliveryDate: '2024-11-20',
    totalAmount: 10000,
    status: 'Confirmed',
    items: [
      { itemNo: 1, description: 'Desk Supplies', quantity: 200, unitPrice: 25, totalPrice: 5000 },
      { itemNo: 2, description: 'Office Chairs', quantity: 10, unitPrice: 500, totalPrice: 5000 },
    ],
  },
];

const mockInvoices = [
  {
    id: 'inv1',
    invoiceNumber: 'INV-2024-001',
    poNumber: 'PO-2024-001',
    vendorName: 'TechSupply Ltd',
    issueDate: '2024-11-15',
    dueDate: '2024-12-15',
    totalAmount: 10000,
    status: 'Received',
    items: [
      { description: 'Office Supplies', amount: 10000 },
    ],
  },
];

const mockActivityLogs = [
  {
    id: 'log1',
    action: 'RFQ Created',
    description: 'New RFQ RFQ-2024-001 created',
    user: 'John Procurement',
    timestamp: '2024-11-01 09:00 AM',
    type: 'create',
  },
  {
    id: 'log2',
    action: 'Quotation Submitted',
    description: 'TechSupply Ltd submitted quotation for RFQ-2024-001',
    user: 'System',
    timestamp: '2024-11-10 02:30 PM',
    type: 'submit',
  },
  {
    id: 'log3',
    action: 'Approval Requested',
    description: 'Quotation approval requested from Manager',
    user: 'John Procurement',
    timestamp: '2024-11-15 10:15 AM',
    type: 'request',
  },
];

// Service functions
export const vendorService = {
  getAll: () => JSON.parse(localStorage.getItem('vendors') || JSON.stringify(mockVendors)),
  getById: (id) => {
    const vendors = vendorService.getAll();
    return vendors.find((v) => v.id === id);
  },
  add: (vendor) => {
    const vendors = vendorService.getAll();
    const newVendor = { id: 'v' + Date.now(), ...vendor };
    vendors.push(newVendor);
    localStorage.setItem('vendors', JSON.stringify(vendors));
    return newVendor;
  },
  update: (id, vendor) => {
    const vendors = vendorService.getAll();
    const index = vendors.findIndex((v) => v.id === id);
    if (index >= 0) {
      vendors[index] = { ...vendors[index], ...vendor };
      localStorage.setItem('vendors', JSON.stringify(vendors));
    }
    return vendors[index];
  },
};

export const rfqService = {
  getAll: () => JSON.parse(localStorage.getItem('rfqs') || JSON.stringify(mockRFQs)),
  getById: (id) => {
    const rfqs = rfqService.getAll();
    return rfqs.find((r) => r.id === id);
  },
  add: (rfq) => {
    const rfqs = rfqService.getAll();
    const newRfq = { id: 'rfq' + Date.now(), ...rfq };
    rfqs.push(newRfq);
    localStorage.setItem('rfqs', JSON.stringify(rfqs));
    return newRfq;
  },
};

export const quotationService = {
  getAll: () => JSON.parse(localStorage.getItem('quotations') || JSON.stringify(mockQuotations)),
  getByRfqId: (rfqId) => {
    const quotations = quotationService.getAll();
    return quotations.filter((q) => q.rfqId === rfqId);
  },
  add: (quotation) => {
    const quotations = quotationService.getAll();
    const newQuotation = { id: 'q' + Date.now(), ...quotation };
    quotations.push(newQuotation);
    localStorage.setItem('quotations', JSON.stringify(quotations));
    return newQuotation;
  },
};

export const approvalService = {
  getAll: () => JSON.parse(localStorage.getItem('approvals') || JSON.stringify(mockApprovals)),
  add: (approval) => {
    const approvals = approvalService.getAll();
    const newApproval = { id: 'apr' + Date.now(), ...approval };
    approvals.push(newApproval);
    localStorage.setItem('approvals', JSON.stringify(approvals));
    return newApproval;
  },
  update: (id, updates) => {
    const approvals = approvalService.getAll();
    const index = approvals.findIndex((a) => a.id === id);
    if (index >= 0) {
      approvals[index] = { ...approvals[index], ...updates };
      localStorage.setItem('approvals', JSON.stringify(approvals));
    }
    return approvals[index];
  },
};

export const poService = {
  getAll: () => JSON.parse(localStorage.getItem('purchaseOrders') || JSON.stringify(mockPurchaseOrders)),
  getById: (id) => {
    const pos = poService.getAll();
    return pos.find((p) => p.id === id);
  },
  add: (po) => {
    const pos = poService.getAll();
    const newPo = { id: 'po' + Date.now(), ...po };
    pos.push(newPo);
    localStorage.setItem('purchaseOrders', JSON.stringify(pos));
    return newPo;
  },
};

export const invoiceService = {
  getAll: () => JSON.parse(localStorage.getItem('invoices') || JSON.stringify(mockInvoices)),
  getById: (id) => {
    const invoices = invoiceService.getAll();
    return invoices.find((i) => i.id === id);
  },
};

export const activityService = {
  getAll: () => JSON.parse(localStorage.getItem('activityLogs') || JSON.stringify(mockActivityLogs)),
  add: (log) => {
    const logs = activityService.getAll();
    const newLog = { id: 'log' + Date.now(), ...log };
    logs.push(newLog);
    localStorage.setItem('activityLogs', JSON.stringify(logs));
    return newLog;
  },
};
