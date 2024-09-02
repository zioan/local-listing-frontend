import axios from "axios";

const API_URL = process.env.REACT_APP_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Update the interceptor to use the token directly
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers["Authorization"] = `Token ${token}`;
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
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data.user;
    } catch (error) {
      if (error.response && error.response.data) {
        throw error.response.data;
      } else {
        throw new Error("An unexpected error occurred during registration.");
      }
    }
  },

  login: async (email, password) => {
    try {
      const response = await axiosInstance.post("login/", { email, password });
      if (response.data.token) {
        localStorage.setItem("token", response.data.token);
      }
      return response.data.user;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  logout: async () => {
    try {
      await axiosInstance.post("logout/");
      localStorage.removeItem("token");
    } catch (error) {
      console.error("Logout error:", error);
      localStorage.removeItem("token");
    }
  },

  getCurrentUser: async () => {
    try {
      const response = await axiosInstance.get("profile/");
      return response.data;
    } catch (error) {
      console.error("Error fetching current user:", error);
      return null;
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
};

export default authService;
