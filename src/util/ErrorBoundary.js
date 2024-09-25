import React from "react";
import { Navigate } from "react-router-dom";

export const handleErrorRedirect = (error) => {
  if (!error) return null;
  switch (error.status) {
    case 400:
      return <Navigate to="/error" />;
    case 401:
      return <Navigate to="/unauthorized" />;
    case 403:
      return <Navigate to="/forbidden" />;
    case 404:
      return <Navigate to="/not-found" />;
    case 500:
      return <Navigate to="/server-error" />;
    default:
      return <Navigate to="/error" />;
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
    this.status = status;
  }
}

const createHttpError = (err, fallbackMessage) => {
  const errorMessage = err.response?.data?.message || fallbackMessage;
  const statusCode = err.response?.status || 500;
  return new HttpError(errorMessage, statusCode);
};

export const handleApiError = (err, fallbackMessage, setError) => {
  const httpError = createHttpError(err, fallbackMessage);
  if (setError) {
    setError(httpError);
  }
  throw httpError;
};
