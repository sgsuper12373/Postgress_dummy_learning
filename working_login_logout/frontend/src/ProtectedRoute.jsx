import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children }) {
  const token = localStorage.getItem('access_token');

  if (!token) {
    // If no token, redirect to the /login page
    return <Navigate to="/login" replace />;
  }

  // If token exists, show the children components
  return children;
}

export default ProtectedRoute;