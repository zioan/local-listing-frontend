import { useState, useCallback } from "react";
import api from "../config/api";
import { useError } from "../context/ErrorContext";

/**
 * Custom hook for managing profile-related functionality.
 *
 * @returns {Object} An object containing loading state, error information,
 *                  and functions to fetch public profiles and user listings.
 */
const useProfile = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { handleApiError } = useError();

  /**
   * Fetches the public profile data for a given username.
   *
   * @param {string} username - The username of the profile to fetch.
   * @returns {Object|null} The public profile data or null if an error occurs.
   */
  const fetchPublicProfile = useCallback(
    async (username) => {
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
    },
    [handleApiError]
  );

  /**
   * Fetches listings for a given username.
   *
   * @param {string} username - The username whose listings to fetch.
   * @returns {Array|null} The user listings data or null if an error occurs.
   */
  const fetchUserListings = useCallback(
    async (username) => {
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
    },
    [handleApiError]
  );

  return {
    loading,
    error,
    fetchPublicProfile,
    fetchUserListings,
  };
};

export default useProfile;
