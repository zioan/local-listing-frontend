import { useState, useCallback } from "react";
import api from "../config/api";
import { useError } from "../context/ErrorContext";

const useSubcategories = () => {
  const [subcategories, setSubcategories] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { handleApiError } = useError();

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
