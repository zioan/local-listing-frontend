import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingSpinner from "../components/shared/LoadingSpinner";

/**
 * AuthRoute component to protect routes based on authentication status.
 * Redirects users to the login page if authentication is required and the user is not logged in.
 * Redirects authenticated users away from login or other specified routes.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.authRequired - Flag to determine if authentication is needed.
 * @param {React.ReactNode} props.children - The child components to render if authentication requirements are met.
 * @param {string} [props.redirectTo="/"] - The path to redirect authenticated users.
 * @returns {React.ReactNode} - The child components or redirection components.
 */
const AuthRoute = ({ children, authRequired, redirectTo = "/" }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // Show a loading spinner while authentication status is being determined
  if (loading) {
    return <LoadingSpinner isLoading={loading} />;
  }

  // Redirect to login if authentication is required and user is not authenticated
  if (authRequired && !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Redirect authenticated users to the specified route if they try to access a login or restricted page
  if (!authRequired && user) {
    return <Navigate to={redirectTo} replace />;
  }

  // Render the child components if authentication status is satisfactory
  return children;
};

export default AuthRoute;
