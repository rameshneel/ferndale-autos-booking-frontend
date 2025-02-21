//*****************IN PRODUCTION USE CODE ************ */
import React, { useEffect } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = () => {
  const { isAuthenticated, loading, checkAuthStatus } = useAuth();

  useEffect(() => {
    if (!isAuthenticated && !loading) {
      checkAuthStatus();
    }
  }, [isAuthenticated, loading, checkAuthStatus]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default PrivateRoute;
