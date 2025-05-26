import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useOdooAuth } from '../hooks/useOdooAuth';

const ProtectedRoute: React.FC = () => {
  const { isAuthenticated, loading } = useOdooAuth();

  if (loading) {
    return <div className="flex items-center justify-center min-h-screen">Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;