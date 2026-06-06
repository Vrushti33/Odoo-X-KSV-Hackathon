import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export const Layout = ({ children }) => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const { user, logout } = useAuth();
  const location = useLocation();

  const menuItems = [
    { path: '/', label: 'Dashboard', roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'VENDOR', 'MANAGER'] },
    { path: '/vendors', label: 'Vendors', roles: ['ADMIN', 'PROCUREMENT_OFFICER'] },
    { path: '/rfqs', label: 'RFQs', roles: ['ADMIN', 'PROCUREMENT_OFFICER'] },
    { path: '/quotations', label: 'Quotations', roles: ['PROCUREMENT_OFFICER', 'VENDOR', 'MANAGER'] },
    { path: '/quotations/compare', label: 'Compare Quotations', roles: ['PROCUREMENT_OFFICER', 'MANAGER'] },
    { path: '/approvals', label: 'Approvals', roles: ['MANAGER', 'ADMIN'] },
    { path: '/purchase-orders', label: 'Purchase Orders', roles: ['ADMIN', 'PROCUREMENT_OFFICER'] },
    { path: '/invoices', label: 'Invoices', roles: ['ADMIN', 'PROCUREMENT_OFFICER'] },
    { path: '/activity', label: 'Activity Log', roles: ['ADMIN', 'PROCUREMENT_OFFICER', 'VENDOR', 'MANAGER'] },
    { path: '/reports', label: 'Reports', roles: ['ADMIN', 'PROCUREMENT_OFFICER'] },
  ];

  const visibleMenuItems = menuItems.filter((item) => item.roles.includes(user?.role));

  return (
    <div className="flex h-screen bg-background">
      {/* Sidebar */}
      <aside
        className={`${
          sidebarOpen ? 'w-64' : 'w-20'
        } bg-primary text-white transition-all duration-300 flex flex-col overflow-y-auto`}
      >
        <div className="p-4 border-b border-primary-dark">
          <h1 className={`font-bold ${sidebarOpen ? 'text-2xl' : 'text-sm text-center'}`}>
            {sidebarOpen ? 'VendorBridge' : 'VB'}
          </h1>
        </div>

        <nav className="flex-1 p-4 space-y-2">
          {visibleMenuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-primary-dark'
                  : 'hover:bg-primary-dark'
              } ${!sidebarOpen && 'justify-center'}`}
              title={!sidebarOpen ? item.label : ''}
            >
              <span className={`${sidebarOpen ? '' : 'text-lg'}`}>→</span>
              {sidebarOpen && <span className="text-sm">{item.label}</span>}
            </Link>
          ))}
        </nav>

        <div className="p-4 border-t border-primary-dark">
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="w-full px-4 py-2 bg-primary-dark rounded-lg hover:bg-primary text-sm transition-colors text-center"
          >
            {sidebarOpen ? '←' : '→'}
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <header className="bg-card-bg border-b border-border px-6 py-4 flex justify-between items-center">
          <h2 className="text-xl font-semibold text-text-primary">
            {visibleMenuItems.find((item) => item.path === location.pathname)?.label || 'Dashboard'}
          </h2>
          <div className="flex items-center gap-4">
            <span className="text-sm text-text-secondary">
              {user?.firstName} {user?.lastName}
            </span>
            <span className="bg-accent text-white px-3 py-1 rounded-full text-xs font-medium">
              {user?.role}
            </span>
            <button
              onClick={logout}
              className="btn-secondary py-1 px-3 text-sm"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Content area */}
        <main className="flex-1 overflow-auto p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;
