import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { rfqService, quotationService, approvalService, poService, invoiceService } from '../services/mockData';
import { Card, Badge, Spinner } from '../components/UI';
import Layout from '../components/Layout';

const StatCard = ({ title, value, icon, color }) => (
  <Card className={`border-l-4 ${color}`}>
    <div className="flex items-center justify-between">
      <div>
        <p className="text-text-secondary text-sm mb-1">{title}</p>
        <p className="text-3xl font-bold text-text-primary">{value}</p>
      </div>
      <div className={`text-4xl opacity-20 ${color === 'border-primary' ? 'text-primary' : 'text-accent'}`}>
        {icon}
      </div>
    </div>
  </Card>
);

export const DashboardPage = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalRFQs: 0,
    activeRFQs: 0,
    pendingApprovals: 0,
    totalPOs: 0,
  });
  const [recentRFQs, setRecentRFQs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadData = () => {
      try {
        const rfqs = rfqService.getAll();
        const quotations = quotationService.getAll();
        const approvals = approvalService.getAll();
        const pos = poService.getAll();

        setStats({
          totalRFQs: rfqs.length,
          activeRFQs: rfqs.filter((r) => r.status === 'Open').length,
          pendingApprovals: approvals.filter((a) => a.status === 'Pending').length,
          totalPOs: pos.length,
        });

        setRecentRFQs(rfqs.slice(-3).reverse());
      } catch (err) {
        console.error('Error loading dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  if (loading) {
    return (
      <Layout>
        <div className="flex items-center justify-center h-full">
          <Spinner size="lg" />
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="space-y-6">
        {/* Welcome Section */}
        <div className="card bg-gradient-to-r from-primary to-primary-dark text-white">
          <h1 className="text-3xl font-bold mb-2">Welcome, {user?.firstName}!</h1>
          <p className="text-blue-200/90">Here's your procurement dashboard overview</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <StatCard title="Total RFQs" value={stats.totalRFQs} icon="📋" color="border-primary" />
          <StatCard title="Active RFQs" value={stats.activeRFQs} icon="🎯" color="border-accent" />
          <StatCard title="Pending Approvals" value={stats.pendingApprovals} icon="⏳" color="border-warning" />
          <StatCard title="Purchase Orders" value={stats.totalPOs} icon="📦" color="border-success" />
        </div>

        {/* Recent Activity */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Recent RFQs</h2>
          {recentRFQs.length === 0 ? (
            <p className="text-text-secondary">No RFQs found</p>
          ) : (
            <div className="space-y-3">
              {recentRFQs.map((rfq) => (
                <div key={rfq.id} className="flex items-center justify-between p-3 bg-slate-50 rounded-xl border border-slate-100">
                  <div>
                    <p className="font-semibold text-text-primary">{rfq.referenceNo}</p>
                    <p className="text-sm text-text-secondary">{rfq.title}</p>
                  </div>
                  <Badge variant={rfq.status === 'Open' ? 'info' : 'danger'}>{rfq.status}</Badge>
                </div>
              ))}
            </div>
          )}
        </Card>

        {/* Quick Links */}
        <Card>
          <h2 className="text-xl font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3">
            {['ADMIN', 'PROCUREMENT_OFFICER'].includes(user?.role) && (
              <a href="/rfqs" className="p-3 border border-primary text-primary rounded-xl hover:bg-primary/5 transition-all text-center font-semibold">
                Browse RFQs
              </a>
            )}
            {['ADMIN', 'PROCUREMENT_OFFICER'].includes(user?.role) && (
              <a href="/vendors" className="p-3 border border-accent text-accent rounded-xl hover:bg-accent/5 transition-all text-center font-semibold">
                View Vendors
              </a>
            )}
            {['PROCUREMENT_OFFICER', 'VENDOR', 'MANAGER'].includes(user?.role) && (
              <a href="/quotations" className="p-3 border border-accent text-accent rounded-xl hover:bg-accent/5 transition-all text-center font-semibold">
                View Quotations
              </a>
            )}
            {['MANAGER', 'ADMIN'].includes(user?.role) && (
              <a href="/approvals" className="p-3 border border-warning text-warning rounded-xl hover:bg-warning/5 transition-all text-center font-semibold">
                Review Approvals
              </a>
            )}
            {['ADMIN', 'PROCUREMENT_OFFICER'].includes(user?.role) && (
              <a href="/purchase-orders" className="p-3 border border-success text-success rounded-xl hover:bg-success/5 transition-all text-center font-semibold">
                Purchase Orders
              </a>
            )}
            {['ADMIN', 'PROCUREMENT_OFFICER'].includes(user?.role) && (
              <a href="/reports" className="p-3 border border-info text-info rounded-xl hover:bg-info/5 transition-all text-center font-semibold">
                View Reports
              </a>
            )}
          </div>
        </Card>
      </div>
    </Layout>
  );
};
