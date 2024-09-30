import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import authService from "../lib/authService";
import { useWatcher } from "./WatcherContext";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { triggerUpdate } = useWatcher();

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
        triggerUpdate("auth");
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
            // Retry fetching user with new token
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

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

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

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      sessionStorage.clear();
      triggerUpdate("auth");
    } catch (error) {
      throw error;
    }
  };

  const register = async (userData) => {
    try {
      const data = await authService.register(userData);
      setUser(data.user);
      triggerUpdate("auth");
      return data;
    } catch (error) {
      throw error;
    }
  };

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

export const useAuth = () => useContext(AuthContext);
