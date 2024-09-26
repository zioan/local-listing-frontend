import React from "react";
import { Navigate } from "react-router-dom";
import { toast } from "react-toastify";

export const handleErrorRedirect = (error) => {
  if (!error) return null;

  switch (error.status) {
    case 400:
      return <Navigate to="/error" state={{ error }} />;
    case 401:
      return <Navigate to="/unauthorized" state={{ error }} />;
    case 403:
      return <Navigate to="/forbidden" state={{ error }} />;
    case 404:
      return <Navigate to="/not-found" state={{ error }} />;
    case 500:
      return <Navigate to="/server-error" state={{ error }} />;
    default:
      return <Navigate to="/error" state={{ error }} />;
  }
};

export class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props);
    this.state = { hasError: false, error: null };
  }

  static getDerivedStateFromError(error) {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return handleErrorRedirect(this.state.error);
    }
    return this.props.children;
  }
}

export class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }
}

export const handleApiError = (err, fallbackMessage) => {
  const errorMessage = err.response?.data?.message || fallbackMessage;
  const statusCode = err.response?.status || 500;
  if (!(err instanceof HttpError)) {
    toast.error(errorMessage, {
      toastId: `error-${statusCode}`, // Prevent duplicate toasts
    });
    throw new HttpError(errorMessage, statusCode);
  }
  throw err;
};
