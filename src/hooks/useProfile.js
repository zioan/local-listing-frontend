import { useState, useCallback } from "react";
import api from "../config/api";
import { handleApiError } from "../util/ErrorBoundary";

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
      handleApiError(err, "Failed to fetch public profile");
      return null;
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
      handleApiError(err, "Failed to fetch user listings");
      return null;
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
