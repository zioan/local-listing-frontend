import axios from "axios";
import { toast } from "react-toastify";
import authService from "../lib/authService";
import { HttpError } from "../util/ErrorBoundary";

const BASE_API_URL = process.env.REACT_APP_BASE_API_URL;

const api = axios.create({
  baseURL: BASE_API_URL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (!error.response) {
      throw new HttpError("Network error", 0);
    }

    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const newTokens = await authService.refreshToken(refreshToken);
          localStorage.setItem("access_token", newTokens.access);
          localStorage.setItem("refresh_token", newTokens.refresh);
          originalRequest.headers["Authorization"] = `Bearer ${newTokens.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        window.location.href = "/login";
        throw new HttpError("Session expired", 401);
      }
    }

    let errorMessage;
    switch (error.response.status) {
      case 400:
        errorMessage = "Bad request. Please check your input.";
        break;
      case 401:
        errorMessage = "You are not authorized to access this resource.";
        break;
      case 403:
        errorMessage = "You don't have permission to access this resource.";
        break;
      case 404:
        errorMessage = "The requested resource was not found.";
        break;
      case 500:
        errorMessage = "An internal server error occurred. Please try again later.";
        break;
      default:
        errorMessage = error.response.data.message || "An unexpected error occurred.";
    }

    toast.error(errorMessage, {
      toastId: `error-${error.response.status}`, // Prevent duplicate toasts
    });
    throw new HttpError(errorMessage, error.response.status);
  }
);

export default api;
