import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Button, Input, Select, Alert } from '../components/UI';

export const RegisterPage = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: '',
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (!formData.firstName || !formData.lastName || !formData.email || !formData.password || !formData.role) {
        setError('Please fill in all fields');
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        setError('Passwords do not match');
        return;
      }

      if (formData.password.length < 6) {
        setError('Password must be at least 6 characters');
        return;
      }

      await register({
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        role: formData.role,
      });

      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed. Email may already be in use.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-50">
      {/* Left Panel - Dark Navy Background */}
      <div className="hidden lg:flex lg:w-[45%] bg-[#132238] relative flex-col justify-between p-12 overflow-hidden">
        {/* Decorative blur elements for modern premium UI */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-primary/10 rounded-full blur-3xl -mr-20 -mt-20"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#175193]/20 rounded-full blur-3xl -ml-20 -mb-20"></div>
        
        {/* Brand Logo */}
        <div className="flex items-center space-x-3 z-10">
          <div className="bg-[#175193] text-white p-2 rounded-xl shadow-md">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path>
            </svg>
          </div>
          <span className="text-white text-xl font-bold tracking-wide">VendorBridge</span>
        </div>

        {/* Center Slogan */}
        <div className="max-w-md my-auto z-10">
          <h2 className="text-4xl font-bold text-white tracking-tight leading-tight mb-4">
            Procurement, simplified.
          </h2>
          <p className="text-slate-300 text-lg leading-relaxed font-light">
            Manage vendors, RFQs, quotations, approvals, and POs — all in one platform built for modern teams.
          </p>
        </div>

        {/* Footer copyright */}
        <div className="z-10">
          <span className="text-slate-400 text-sm font-light">
            &copy; 2026 VendorBridge
          </span>
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full lg:w-[55%] flex items-center justify-center p-6 sm:p-12 bg-[#f0f4f8]">
        <div className="w-full max-w-lg bg-white border border-[#e2e8f0] shadow-sm rounded-2xl p-8 lg:p-10">
          {/* Title */}
          <h1 className="text-3xl font-bold text-[#0f172a] mb-1.5">Welcome</h1>
          <p className="text-[#475569] text-sm mb-6">Sign in or create an account to continue</p>

          {/* Tabs Switch */}
          <div className="bg-[#eef2f6] p-1 rounded-xl flex space-x-1 mb-6">
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="flex-1 py-2 text-center text-sm font-medium rounded-lg text-slate-500 hover:text-slate-800 transition-colors"
            >
              Sign in
            </button>
            <button
              type="button"
              className="flex-1 py-2 text-center text-sm font-semibold rounded-lg bg-white text-slate-800 shadow-sm border border-slate-200/50"
            >
              Register
            </button>
          </div>

          {error && (
            <Alert type="danger" className="mb-4" onClose={() => setError('')}>
              {error}
            </Alert>
          )}

          <form onSubmit={handleRegister} className="space-y-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="First Name"
                type="text"
                name="firstName"
                placeholder="First name"
                value={formData.firstName}
                onChange={handleChange}
                required
              />
              <Input
                label="Last Name"
                type="text"
                name="lastName"
                placeholder="Last name"
                value={formData.lastName}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Email"
                type="email"
                name="email"
                placeholder="Email address"
                value={formData.email}
                onChange={handleChange}
                required
              />
              <Select
                label="Role"
                name="role"
                value={formData.role}
                onChange={handleChange}
                required
                options={[
                  { value: 'ADMIN', label: 'Administrator' },
                  { value: 'PROCUREMENT_OFFICER', label: 'Procurement Officer' },
                  { value: 'VENDOR', label: 'Vendor' },
                  { value: 'MANAGER', label: 'Manager' },
                ]}
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Input
                label="Password"
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
              <Input
                label="Confirm Password"
                type="password"
                name="confirmPassword"
                placeholder="Confirm password"
                value={formData.confirmPassword}
                onChange={handleChange}
                required
              />
            </div>

            <Button type="submit" variant="primary" className="w-full py-3 mt-4" disabled={loading}>
              {loading ? 'Creating Account...' : 'Register'}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};
