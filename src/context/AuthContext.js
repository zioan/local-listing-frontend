import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import authService from "../lib/authService";
import { useWatcher } from "./WatcherContext";

// Create a context for authentication
const AuthContext = createContext(null);

/**
 * AuthProvider component that wraps the application and provides
 * authentication context to its children.
 *
 * It manages the user's authentication state and loading status,
 * fetches user data, and handles login, logout, registration, and
 * profile updates.
 *
 * @param {Object} props - React props
 * @param {ReactNode} props.children - Children components to be wrapped
 * @returns {JSX.Element} The AuthProvider component
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { triggerUpdate } = useWatcher();
  /**
   * Fetches the current user data from the API using the stored access token.
   * If the token is invalid or expired, attempts to refresh the token.
   */
  const fetchUser = useCallback(async () => {
    const token = localStorage.getItem("access_token");
    if (!token) {
      setUser(null);
      setLoading(false);
      return;
    }
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        triggerUpdate("auth"); // Trigger an update in the watcher context
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Try to refresh the token
        try {
          const refreshToken = localStorage.getItem("refresh_token");
          if (refreshToken) {
            const newTokens = await authService.refreshToken(refreshToken);
            localStorage.setItem("access_token", newTokens.access);
            localStorage.setItem("refresh_token", newTokens.refresh);
            // Retry fetching user with the new token
            const currentUser = await authService.getCurrentUser();
            setUser(currentUser);
            if (currentUser) {
              triggerUpdate("auth");
            }
          } else {
            throw new Error("No refresh token available");
          }
        } catch (refreshError) {
          console.error("Error refreshing token");
          localStorage.removeItem("access_token");
          localStorage.removeItem("refresh_token");
          setUser(null);
        }
      } else {
        console.error("Error fetching current user:", error);
      }
    } finally {
      setLoading(false);
    }
  }, [triggerUpdate]);

  // Fetch user data when the component mounts
  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  /**
   * Logs in a user with the provided email and password.
   *
   * @param {string} email - User's email
   * @param {string} password - User's password
   * @returns {Promise<Object>} Response data from the login API
   * @throws {Error} Throws an error if the login fails
   */
  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
      triggerUpdate("auth");
      return data;
    } catch (error) {
      if (error.response && error.response.data) {
        const responseError = new Error("Login failed");
        responseError.data = error.response.data;
        throw responseError;
      } else {
        throw new Error("An unexpected error occurred. Please try again.");
      }
    }
  };

  /**
   * Logs out the current user and clears session storage.
   *
   * @returns {Promise<void>}
   * @throws {Error} Throws an error if the logout fails
   */
  const logout = async () => {
    await authService.logout();
    setUser(null);
    sessionStorage.clear();
    triggerUpdate("auth");
  };

  /**
   * Registers a new user with the provided user data.
   *
   * @param {Object} userData - The data for the new user
   * @returns {Promise<Object>} Response data from the registration API
   * @throws {Error} Throws an error if the registration fails
   */
  const register = async (userData) => {
    const data = await authService.register(userData);
    setUser(data.user);
    triggerUpdate("auth");
    return data;
  };

  /**
   * Updates the current user's profile with new data.
   *
   * @param {Object} userData - The updated user data
   * @returns {Promise<Object>} Response data from the update API
   * @throws {Error} Throws an error if the profile update fails
   */
  const updateProfile = async (userData) => {
    try {
      const updatedUser = await authService.updateProfile(userData);
      setUser((prevUser) => ({ ...prevUser, ...updatedUser }));
      triggerUpdate("auth");
      return updatedUser;
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        register,
        updateProfile,
        fetchUser,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access the AuthContext.
 *
 * @returns {Object} The authentication context value
 */
export const useAuth = () => useContext(AuthContext);
