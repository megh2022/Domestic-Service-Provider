import React, { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import ProviderDashboard from '../components/ProviderDashboard';
import { Navigate } from 'react-router-dom';

function ProviderManagement() {
  const { user } = useContext(AuthContext);

  if (!user || user.role !== 'provider') {
    return <Navigate to="/login" />;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Provider Dashboard</h1>
      <ProviderDashboard />
    </div>
  );
}

export default ProviderManagement;