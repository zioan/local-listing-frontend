import React, { createContext, useState, useContext, useEffect, useCallback } from "react";
import authService from "../lib/authService";
import { useWatcher } from "./WatcherContext";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const { triggerUpdate } = useWatcher();

  const fetchUser = useCallback(async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
      if (currentUser) {
        triggerUpdate("auth");
      }
    } catch (error) {
      if (error.response && error.response.status !== 401) {
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
      console.error("Login failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      triggerUpdate("auth");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  const register = async (userData) => {
    try {
      const registeredUser = await authService.register(userData);
      setUser(registeredUser);
      triggerUpdate("auth");
      return registeredUser;
    } catch (error) {
      console.error("Registration failed:", error);
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
