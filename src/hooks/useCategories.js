import { useState, useCallback } from "react";
import api from "../config/api";

const useCategories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    if (categories.length > 0) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("listings/categories/");
      setCategories(response.data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch categories");
    } finally {
      setLoading(false);
    }
  }, [categories.length]);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    setCategories,
  };
};

export default useCategories;
