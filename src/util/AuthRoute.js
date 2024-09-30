import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/shared/LoadingSpinner";

const AuthRoute = ({ children, authRequired, redirectTo = "/" }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <LoadingSpinner isLoading={loading} />;
  }

  if (authRequired && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (!authRequired && user) {
    return <Navigate to={redirectTo} replace />;
  }

  return children;
};

export default AuthRoute;
