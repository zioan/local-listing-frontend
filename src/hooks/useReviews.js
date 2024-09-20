import { useState, useCallback } from "react";
import api from "../config/api";

const useReviews = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const submitReview = useCallback(async (userId, reviewData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/reviews/users/${userId}/reviews/`, { ...reviewData, reviewed_user: userId });
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data || "Failed to submit review");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    loading,
    error,
    submitReview,
  };
};

export default useReviews;
