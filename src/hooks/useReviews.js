import { useState } from "react";
import api from "../config/api";

const useReviews = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getExistingReview = async (reviewedUserId, reviewerId) => {
    try {
      const response = await api.get(`reviews/users/${reviewedUserId}/reviewer/${reviewerId}/`);
      if (response.status === 204) {
        // No content, means no existing review
        return null;
      }
      return response.data;
    } catch (error) {
      console.error("Error fetching existing review:", error);
      setError("Failed to fetch existing review");
      return null;
    }
  };

  const submitReview = async (userId, reviewData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.post(`/reviews/users/${userId}/reviews/`, reviewData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data || "Failed to submit review");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateReview = async (reviewId, reviewData) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.put(`/reviews/reviews/${reviewId}/`, reviewData);
      return response.data;
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data || "Failed to update review");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteReview = async (reviewId) => {
    setLoading(true);
    setError(null);
    try {
      await api.delete(`/reviews/reviews/${reviewId}/`);
    } catch (err) {
      setError(err.response?.data?.detail || err.response?.data || "Failed to delete review");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    error,
    getExistingReview,
    submitReview,
    updateReview,
    deleteReview,
  };
};

export default useReviews;
