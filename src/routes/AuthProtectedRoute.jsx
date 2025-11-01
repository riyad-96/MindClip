import React from 'react';
import { useUser } from '../contexts/UserContextProvider';
import { Navigate } from 'react-router-dom';

function AuthProtectedRoute({ children }) {
  const { user } = useUser();

  if (user) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AuthProtectedRoute;
