import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
import { UnauthorizedPage } from './pages/UnauthorizedPage';
import { DashboardPage } from './pages/DashboardPage';
import { VendorsListPage, VendorDetailPage } from './pages/VendorsPage';
import { RFQListPage, RFQDetailPage } from './pages/RFQPage';
import { RfqCreatePage } from './pages/RfqCreatePage';
import { QuotationsListPage, QuotationComparePage, QuotationSubmitPage } from './pages/QuotationsPage';
import { ApprovalsPage } from './pages/ApprovalsPage';
import { PurchaseOrderListPage, PurchaseOrderDetailPage } from './pages/PurchaseOrdersPage';
import { InvoiceListPage, InvoiceDetailPage } from './pages/InvoicesPage';
import { ActivityLogPage } from './pages/ActivityPage';
import { ReportsPage } from './pages/ReportsPage';
import './index.css';

function App() {
  return (
    <Router>
      <AuthProvider>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/unauthorized" element={<UnauthorizedPage />} />

          {/* Protected Routes */}
          <Route
            path="/"
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            }
          />

          {/* Vendor Routes */}
          <Route
            path="/vendors"
            element={
              <ProtectedRoute requiredRoles={['ADMIN', 'PROCUREMENT_OFFICER']}>
                <VendorsListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/vendors/:id"
            element={
              <ProtectedRoute requiredRoles={['ADMIN', 'PROCUREMENT_OFFICER']}>
                <VendorDetailPage />
              </ProtectedRoute>
            }
          />

          {/* RFQ Routes */}
          <Route
            path="/rfqs"
            element={
              <ProtectedRoute requiredRoles={['ADMIN', 'PROCUREMENT_OFFICER']}>
                <RFQListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rfqs/create"
            element={
              <ProtectedRoute requiredRoles={['ADMIN', 'PROCUREMENT_OFFICER']}>
                <RfqCreatePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/rfqs/:id"
            element={
              <ProtectedRoute requiredRoles={['ADMIN', 'PROCUREMENT_OFFICER', 'VENDOR', 'MANAGER']}>
                <RFQDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Quotation Routes */}
          <Route
            path="/quotations"
            element={
              <ProtectedRoute requiredRoles={['PROCUREMENT_OFFICER', 'VENDOR', 'MANAGER']}>
                <QuotationsListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quotations/submit"
            element={
              <ProtectedRoute requiredRoles={['VENDOR', 'PROCUREMENT_OFFICER', 'ADMIN']}>
                <QuotationSubmitPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quotations/submit/:rfqId"
            element={
              <ProtectedRoute requiredRoles={['VENDOR', 'PROCUREMENT_OFFICER', 'ADMIN']}>
                <QuotationSubmitPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quotations/compare/:rfqId"
            element={
              <ProtectedRoute requiredRoles={['PROCUREMENT_OFFICER', 'MANAGER']}>
                <QuotationComparePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/quotations/compare"
            element={
              <ProtectedRoute requiredRoles={['PROCUREMENT_OFFICER', 'MANAGER']}>
                <QuotationComparePage />
              </ProtectedRoute>
            }
          />

          {/* Approval Routes */}
          <Route
            path="/approvals"
            element={
              <ProtectedRoute requiredRoles={['MANAGER', 'ADMIN']}>
                <ApprovalsPage />
              </ProtectedRoute>
            }
          />

          {/* Purchase Order Routes */}
          <Route
            path="/purchase-orders"
            element={
              <ProtectedRoute requiredRoles={['ADMIN', 'PROCUREMENT_OFFICER']}>
                <PurchaseOrderListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/purchase-orders/:id"
            element={
              <ProtectedRoute requiredRoles={['ADMIN', 'PROCUREMENT_OFFICER']}>
                <PurchaseOrderDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Invoice Routes */}
          <Route
            path="/invoices"
            element={
              <ProtectedRoute requiredRoles={['ADMIN', 'PROCUREMENT_OFFICER']}>
                <InvoiceListPage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/invoices/:id"
            element={
              <ProtectedRoute requiredRoles={['ADMIN', 'PROCUREMENT_OFFICER']}>
                <InvoiceDetailPage />
              </ProtectedRoute>
            }
          />

          {/* Activity Log Routes */}
          <Route
            path="/activity"
            element={
              <ProtectedRoute requiredRoles={['ADMIN', 'PROCUREMENT_OFFICER', 'VENDOR', 'MANAGER']}>
                <ActivityLogPage />
              </ProtectedRoute>
            }
          />

          {/* Reports Routes */}
          <Route
            path="/reports"
            element={
              <ProtectedRoute requiredRoles={['ADMIN', 'PROCUREMENT_OFFICER']}>
                <ReportsPage />
              </ProtectedRoute>
            }
          />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;
