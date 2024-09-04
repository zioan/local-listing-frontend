import React, { createContext, useState, useContext, useEffect } from "react";
import authService from "../lib/authService";
import LoadingSpinner from "../components/shared/LoadingSpinner";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchUser = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      setUser(currentUser);
    } catch (error) {
      // Only log errors that are not 401 Unauthorized
      if (error.response && error.response.status !== 401) {
        console.error("Error fetching current user:", error);
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, []);

  const login = async (email, password) => {
    try {
      const data = await authService.login(email, password);
      setUser(data.user);
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
    } catch (error) {
      console.error("Logout failed:", error);
      setUser(null);
    }
  };

  const register = async (userData) => {
    try {
      const registeredUser = await authService.register(userData);
      setUser(registeredUser);
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
      return updatedUser;
    } catch (error) {
      console.error("Profile update failed:", error);
      throw error;
    }
  };

  if (loading) return <LoadingSpinner isLoading={loading} />;

  return <AuthContext.Provider value={{ user, login, logout, register, updateProfile, fetchUser }}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
