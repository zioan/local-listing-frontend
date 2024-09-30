import axios from "axios";

const API_URL = process.env.REACT_APP_USERS_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const authService = {
  register: async (userData) => {
    try {
      const response = await axiosInstance.post("register/", userData);
      if (response.data.access) {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error;
    }
  },

  login: async (email, password) => {
    try {
      const response = await axiosInstance.post("login/", { email, password });
      if (response.data.access) {
        localStorage.setItem("access_token", response.data.access);
        localStorage.setItem("refresh_token", response.data.refresh);
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  logout: async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        throw new Error("No refresh token found");
      }
      await axiosInstance.post("logout/", { refresh_token: refreshToken });
    } catch (error) {
      throw error;
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  },

  getCurrentUser: async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      return null; // Return null if there's no token
    }
    try {
      const response = await axiosInstance.get("profile/");
      return response.data;
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Token is invalid or expired
        localStorage.removeItem("access_token");
        localStorage.removeItem("refresh_token");
        return null;
      }
      throw error;
    }
  },

  updateProfile: async (userData) => {
    try {
      const response = await axiosInstance.put("profile/", userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  refreshToken: async (refreshToken) => {
    try {
      const response = await axiosInstance.post("token/refresh/", { refresh: refreshToken });
      if (response.data.access) {
        localStorage.setItem("access_token", response.data.access);
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default authService;
