import React, { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

// Create a context for error management
const ErrorContext = createContext();

/**
 * Custom error class for handling HTTP errors.
 */
export class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }

  /**
   * Get the redirect path based on the HTTP status code.
   *
   * @returns {string} The path to redirect to
   */
  getRedirectPath() {
    switch (this.status) {
      case 400:
        return "/error"; // Bad request
      case 401:
        return "/unauthorized"; // Unauthorized access
      case 403:
        return "/forbidden"; // Forbidden access
      case 404:
        return "/not-found"; // Resource not found
      case 500:
        return "/server-error"; // Internal server error
      default:
        return "/error"; // Default error path
    }
  }
}

/**
 * ErrorProvider component that wraps the application and provides
 * error management context to its children.
 *
 * @param {Object} props - React props
 * @param {ReactNode} props.children - Children components to be wrapped
 * @param {function} props.navigate - Navigation function to handle redirects
 * @returns {JSX.Element} The ErrorProvider component
 */
export const ErrorProvider = ({ children, navigate }) => {
  const [error, setError] = useState(null);

  /**
   * Handle API errors by creating an HttpError instance and displaying a toast notification.
   *
   * @param {Object} err - The error object thrown by the API
   * @param {string} fallbackMessage - Fallback message if no message is found in the error response
   */
  const handleApiError = (err, fallbackMessage) => {
    let httpError;
    // Check if the error is an instance of HttpError
    if (err instanceof HttpError) {
      httpError = err;
    } else {
      const errorMessage = err.response?.data?.message || fallbackMessage; // Get error message
      const statusCode = err.response?.status || 500; // Get status code
      httpError = new HttpError(errorMessage, statusCode); // Create a new HttpError instance
    }

    setError(httpError);
    toast.error(httpError.message, {
      toastId: `error-${httpError.status}`, // Prevent duplicate toasts
    });

    // Redirect to the appropriate path if navigate function is provided
    if (navigate) {
      navigate(httpError.getRedirectPath(), { state: { error: httpError } });
    }
  };

  // Provide the error context value to children
  return <ErrorContext.Provider value={{ error, setError, handleApiError }}>{children}</ErrorContext.Provider>;
};

/**
 * Custom hook to access the ErrorContext.
 *
 * @returns {Object} The error context value
 */
export const useError = () => useContext(ErrorContext);
