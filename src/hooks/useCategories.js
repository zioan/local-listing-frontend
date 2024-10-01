import { useState, useCallback } from "react";
import api from "../config/api";
import { useError } from "../context/ErrorContext";

/**
 * Custom hook for managing categories data fetching and state.
 *
 * @returns {Object} An object containing categories data, loading state, error information,
 *                  fetch function, and a setter for categories.
 */
const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { handleApiError } = useError();

  /**
   * Fetches categories from the API.
   * If categories are already loaded, it will not refetch.
   */
  const fetchCategories = useCallback(async () => {
    // Prevent fetching if categories are already loaded
    if (categories.length > 0) return;

    setLoading(true);
    setError(null);
    try {
      const response = await api.get("listings/categories/");
      setCategories(response.data);
    } catch (err) {
      // Set error state and call handleApiError for centralized error handling
      setError(err.response?.data?.message || "Failed to fetch categories");
      handleApiError(err, "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, [categories.length, handleApiError]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    setCategories,
  };
};

export default useCategories;
