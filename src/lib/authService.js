import axios from "axios";

const API_URL = process.env.REACT_APP_USERS_API_URL;

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Request interceptor to attach the access token to requests
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
  /**
   * Registers a new user and stores access and refresh tokens in local storage.
   *
   * @param {Object} userData - The data for the user to register.
   * @returns {Promise<Object>} The response data from the registration.
   * @throws {Object} The error response if the registration fails.
   */
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

  /**
   * Logs in a user and stores access and refresh tokens in local storage.
   *
   * @param {string} email - The email of the user.
   * @param {string} password - The password of the user.
   * @returns {Promise<Object>} The response data from the login.
   * @throws {string} The error message if the login fails.
   */
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

  /**
   * Logs out the user and removes tokens from local storage.
   *
   * @returns {Promise<void>} Resolves when logout is successful.
   * @throws {Error} If there is no refresh token or if the logout fails.
   */
  logout: async () => {
    try {
      const refreshToken = localStorage.getItem("refresh_token");
      if (!refreshToken) {
        throw new Error("No refresh token found");
      }
      await axiosInstance.post("logout/", { refresh_token: refreshToken });
    } finally {
      localStorage.removeItem("access_token");
      localStorage.removeItem("refresh_token");
    }
  },

  /**
   * Fetches the current user's profile data.
   *
   * @returns {Promise<Object|null>} The user profile data, or null if not authenticated.
   * @throws {Error} If there is an error fetching the profile.
   */
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

  /**
   * Updates the user's profile with the provided data.
   *
   * @param {Object} userData - The data to update in the user's profile.
   * @returns {Promise<Object>} The updated profile data.
   * @throws {string} The error message if the update fails.
   */
  updateProfile: async (userData) => {
    try {
      const response = await axiosInstance.put("profile/", userData);
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },

  /**
   * Refreshes the user's access token using the refresh token.
   *
   * @param {string} refreshToken - The refresh token to use for refreshing.
   * @returns {Promise<Object>} The response data from the token refresh.
   * @throws {string} The error message if the refresh fails.
   */
  refreshToken: async (refreshToken) => {
    try {
      const response = await axiosInstance.post("token/refresh/", { refresh: refreshToken });
      if (response.data.access) {
        localStorage.setItem("access_token", response.data.access);
        if (response.data.refresh) {
          localStorage.setItem("refresh_token", response.data.refresh);
        }
      }
      return response.data;
    } catch (error) {
      throw error.response ? error.response.data : error.message;
    }
  },
};

export default authService;
