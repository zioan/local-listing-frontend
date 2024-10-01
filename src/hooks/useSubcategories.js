import { useState, useCallback } from "react";
import api from "../config/api";
import { useError } from "../context/ErrorContext";

/**
 * Custom hook for managing subcategories based on category ID.
 *
 * @returns {Object} An object containing subcategories, loading state,
 *                  error information, and a function to fetch subcategories.
 */
const useSubcategories = () => {
  const [subcategories, setSubcategories] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { handleApiError } = useError();

  /**
   * Fetches subcategories for a given category ID.
   *
   * @param {string} categoryId - The ID of the category for which to fetch subcategories.
   */
  const fetchSubcategories = useCallback(async (categoryId) => {
    if (!categoryId) return;
    if (subcategories[categoryId]) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`listings/subcategories/by-category/${categoryId}/`);
      const subcategoriesData = Array.isArray(response.data) ? response.data : [];
      setSubcategories((prev) => ({
        ...prev,
        [categoryId]: subcategoriesData,
      }));
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch subcategories");
      handleApiError(err, "Failed to fetch subcategories");
      setSubcategories((prev) => ({
        ...prev,
        [categoryId]: [],
      }));
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    subcategories,
    loading,
    error,
    fetchSubcategories,
    setSubcategories,
  };
};

export default useSubcategories;
