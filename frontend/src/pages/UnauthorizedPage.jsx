import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button, Card } from '../components/UI';

export const UnauthorizedPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary to-primary-dark flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <div className="mb-6">
          <h1 className="text-6xl font-bold text-danger mb-4">403</h1>
          <h2 className="text-2xl font-bold text-text-primary mb-2">Access Denied</h2>
          <p className="text-text-secondary">You don&apos;t have permission to access this resource.</p>
        </div>

        <Button variant="primary" onClick={() => navigate('/')} className="w-full">
          Go to Dashboard
        </Button>
      </Card>
    </div>
  );
};
