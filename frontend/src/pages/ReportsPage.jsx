import React, { useState, useEffect } from 'react';
import { BarChart, Bar, PieChart, Pie, Cell, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { rfqService, quotationService, approvalService, poService } from '../services/mockData';
import { Card, Spinner } from '../components/UI';
import Layout from '../components/Layout';

export const ReportsPage = () => {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = () => {
      try {
        const rfqs = rfqService.getAll();
        const quotations = quotationService.getAll();
        const approvals = approvalService.getAll();
        const pos = poService.getAll();

        // Calculate statistics
        const totalRFQValue = rfqs.reduce((sum, r) => sum + Number(r.budget), 0);
        const totalQuotationValue = quotations.reduce((sum, q) => sum + Number(q.totalPrice), 0);
        const approvedValue = approvals.filter(a => a.status === 'Approved').reduce((sum, a) => sum + Number(a.amount), 0);
        const poValue = pos.reduce((sum, p) => sum + Number(p.totalAmount), 0);

        // RFQ Status data
        const rfqStatusData = [
          { name: 'Open', value: rfqs.filter(r => r.status === 'Open').length },
          { name: 'Closed', value: rfqs.filter(r => r.status === 'Closed').length },
        ];

        // Approval Status data
        const approvalStatusData = [
          { name: 'Pending', value: approvals.filter(a => a.status === 'Pending').length },
          { name: 'Approved', value: approvals.filter(a => a.status === 'Approved').length },
          { name: 'Rejected', value: approvals.filter(a => a.status === 'Rejected').length },
        ];

        // Trend data
        const trendData = [
          { month: 'Nov', rfqs: rfqs.length, quotations: quotations.length },
          { month: 'Dec', rfqs: rfqs.length + 2, quotations: quotations.length + 3 },
          { month: 'Jan', rfqs: rfqs.length + 4, quotations: quotations.length + 5 },
        ];

        setStats({
          totalRFQValue,
          totalQuotationValue,
          approvedValue,
          poValue,
          rfqStatusData,
          approvalStatusData,
          trendData,
          totalRFQs: rfqs.length,
          totalQuotations: quotations.length,
          totalApprovals: approvals.length,
          totalPOs: pos.length,
        });
      } catch (err) {
        console.error('Error loading statistics:', err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  if (loading) {
    return (
      <Layout>
        <Spinner size="lg" />
      </Layout>
    );
  }

  const COLORS = ['#2563eb', '#10b981', '#f59e0b', '#ef4444'];

  return (
    <Layout>
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Reports & Analytics</h1>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card>
            <p className="text-sm text-text-secondary mb-2">Total RFQ Value</p>
            <p className="text-3xl font-bold text-primary">${(stats.totalRFQValue / 1000).toFixed(1)}K</p>
            <p className="text-xs text-text-secondary mt-2">{stats.totalRFQs} RFQs</p>
          </Card>
          <Card>
            <p className="text-sm text-text-secondary mb-2">Total Quotation Value</p>
            <p className="text-3xl font-bold text-accent">${(stats.totalQuotationValue / 1000).toFixed(1)}K</p>
            <p className="text-xs text-text-secondary mt-2">{stats.totalQuotations} Quotations</p>
          </Card>
          <Card>
            <p className="text-sm text-text-secondary mb-2">Approved Value</p>
            <p className="text-3xl font-bold text-success">${(stats.approvedValue / 1000).toFixed(1)}K</p>
            <p className="text-xs text-text-secondary mt-2">{stats.totalApprovals} Approvals</p>
          </Card>
          <Card>
            <p className="text-sm text-text-secondary mb-2">Purchase Order Value</p>
            <p className="text-3xl font-bold text-info">${(stats.poValue / 1000).toFixed(1)}K</p>
            <p className="text-xs text-text-secondary mt-2">{stats.totalPOs} POs</p>
          </Card>
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* RFQ Status Pie Chart */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">RFQ Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={stats.rfqStatusData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {stats.rfqStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>

          {/* Approval Status Pie Chart */}
          <Card>
            <h2 className="text-lg font-semibold mb-4">Approval Status Distribution</h2>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie data={stats.approvalStatusData} cx="50%" cy="50%" labelLine={false} label={({ name, value }) => `${name}: ${value}`} outerRadius={80} fill="#8884d8" dataKey="value">
                  {stats.approvalStatusData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Card>
        </div>

        {/* Trend Line Chart */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">RFQ & Quotation Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={stats.trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="month" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="rfqs" stroke="#2563eb" name="RFQs" />
              <Line type="monotone" dataKey="quotations" stroke="#10b981" name="Quotations" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        {/* Bar Chart */}
        <Card>
          <h2 className="text-lg font-semibold mb-4">Value Distribution by Status</h2>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={[
                { name: 'RFQ Value', value: stats.totalRFQValue },
                { name: 'Quotation Value', value: stats.totalQuotationValue },
                { name: 'Approved Value', value: stats.approvedValue },
                { name: 'PO Value', value: stats.poValue },
              ]}
            >
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip formatter={(value) => `$${(value / 1000).toFixed(1)}K`} />
              <Bar dataKey="value" fill="#2563eb" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>
    </Layout>
  );
};
