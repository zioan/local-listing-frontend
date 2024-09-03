import axios from "axios";

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

export default api;
