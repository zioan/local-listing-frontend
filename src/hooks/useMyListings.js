import { useState, useCallback } from "react";
import api from "../config/api";
import { useError } from "../context/ErrorContext";

/**
 * Custom hook for managing user's listings functionality.
 *
 * @param {Object} user - The authenticated user object.
 * @returns {Object} An object containing myListings, loading state, error information,
 *                  and functions to fetch and manage user's listings.
 */
const useMyListings = (user) => {
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { handleApiError } = useError();

  /**
   * Fetches the current user's listings from the API.
   */
  const fetchMyListings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("listings/my-listings/");
      setMyListings(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Please log in to view your listings");
      } else {
        setError(err.response?.data?.message || "Failed to fetch my listings");
      }
      handleApiError(err, "Failed to fetch my listings");
    } finally {
      setLoading(false);
    }
  }, [user, handleApiError]);

  return {
    myListings,
    loading,
    error,
    fetchMyListings,
    setMyListings,
  };
};

export default useMyListings;
