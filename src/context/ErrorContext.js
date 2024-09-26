import React, { createContext, useContext, useState } from "react";
import { toast } from "react-toastify";

const ErrorContext = createContext();

export class HttpError extends Error {
  constructor(message, status) {
    super(message);
    this.name = "HttpError";
    this.status = status;
  }

  getRedirectPath() {
    switch (this.status) {
      case 400:
        return "/error";
      case 401:
        return "/unauthorized";
      case 403:
        return "/forbidden";
      case 404:
        return "/not-found";
      case 500:
        return "/server-error";
      default:
        return "/error";
    }
  }
}

export const ErrorProvider = ({ children, navigate }) => {
  const [error, setError] = useState(null);

  const handleApiError = (err, fallbackMessage) => {
    let httpError;
    if (err instanceof HttpError) {
      httpError = err;
    } else {
      const errorMessage = err.response?.data?.message || fallbackMessage;
      const statusCode = err.response?.status || 500;
      httpError = new HttpError(errorMessage, statusCode);
    }

    setError(httpError);
    toast.error(httpError.message, {
      toastId: `error-${httpError.status}`,
    });

    if (navigate) {
      navigate(httpError.getRedirectPath(), { state: { error: httpError } });
    }
  };

  return <ErrorContext.Provider value={{ error, setError, handleApiError }}>{children}</ErrorContext.Provider>;
};

export const useError = () => useContext(ErrorContext);
