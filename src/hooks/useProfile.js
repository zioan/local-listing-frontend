import { useState, useCallback } from "react";
import api from "../config/api";

const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchPublicProfile = useCallback(async (username) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`profiles/profiles/${username}/`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch public profile");
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchUserListings = useCallback(async (username) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`profiles/listings/user/${username}/`);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch user listings");
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    fetchPublicProfile,
    fetchUserListings,
  };
};

export default useProfile;
