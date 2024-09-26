import { useState } from "react";
import api from "../config/api";
import { useError } from "../context/ErrorContext";

const useReviews = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { handleApiError } = useError();

  const getExistingReview = async (reviewedUserId, reviewerId) => {
    try {
      const response = await api.get(`reviews/users/${reviewedUserId}/reviewer/${reviewerId}/`);
      if (response.status === 204) {
        // No content, means no existing review
        return null;
      }
      return response.data;
    } catch (error) {
      setError("Failed to fetch existing review");
      handleApiError(error, "Failed to fetch existing review");
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
      setError(err.response?.data?.error || "An unexpected error occurred");
      handleApiError(err, "Failed to submit review");
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
      setError(err.response?.data?.error || "Failed to update review");
      handleApiError(err, "Failed to update review");
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
      setError(err.response?.data?.error || "Failed to delete review");
      handleApiError(err, "Failed to delete review");
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
