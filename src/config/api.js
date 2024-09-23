import axios from "axios";
import { toast } from "react-toastify";
import authService from "../lib/authService";

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

    // If the error is 401 and we haven't retried yet
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refresh_token");
        if (refreshToken) {
          const newTokens = await authService.refreshToken(refreshToken);
          localStorage.setItem("access_token", newTokens.access);
          localStorage.setItem("refresh_token", newTokens.refresh);

          // Update the original request with the new token
          originalRequest.headers["Authorization"] = `Bearer ${newTokens.access}`;
          return api(originalRequest);
        }
      } catch (refreshError) {
        console.error("Error refreshing token:", refreshError);
        // Clear tokens and redirect to login
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        toast.error("Your session has expired. Please log in again.");
        window.location.href = "/login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
