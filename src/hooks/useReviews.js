import { useState, useCallback } from "react";
import api from "../config/api";
import { useError } from "../context/ErrorContext";

/**
 * Custom hook for managing user reviews.
 *
 * @returns {Object} An object containing loading state, error information,
 *                  and functions to get, submit, update, and delete reviews.
 */
const useReviews = () => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { handleApiError } = useError();

  /**
   * Retrieves all reviews for a user.
   *
   * @param {string} userId - The ID of the user to fetch reviews for.
   * @returns {Array} An array of review objects.
   */
  const fetchUserReviews = useCallback(
    async (userId) => {
      try {
        const response = await api.get(`reviews/users/${userId}/reviews/`);
        return response.data;
      } catch (error) {
        handleApiError(error, "Failed to fetch user reviews");
        return [];
      }
    },
    [handleApiError]
  );
  /**
   * Retrieves an existing review between a reviewed user and a reviewer.
   *
   * @param {string} reviewedUserId - The ID of the user being reviewed.
   * @param {string} reviewerId - The ID of the reviewer.
   * @returns {Object|null} The existing review data or null if no review exists.
   */
  const getExistingReview = async (reviewedUserId, reviewerId) => {
    try {
      const response = await api.get(`reviews/users/${reviewedUserId}/reviewer/${reviewerId}/`);
      if (response.status === 204) {
        return null; // No content means no existing review
      }
      return response.data;
    } catch (error) {
      setError("Failed to fetch existing review");
      handleApiError(error, "Failed to fetch existing review");
      return null;
    }
  };

  /**
   * Submits a new review for a user.
   *
   * @param {string} userId - The ID of the user being reviewed.
   * @param {Object} reviewData - The data for the new review.
   * @returns {Object|null} The submitted review data or null if an error occurs.
   */
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

  /**
   * Updates an existing review.
   *
   * @param {string} reviewId - The ID of the review to update.
   * @param {Object} reviewData - The new data for the review.
   * @returns {Object|null} The updated review data or null if an error occurs.
   */
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

  /**
   * Deletes a review by its ID.
   *
   * @param {string} reviewId - The ID of the review to delete.
   */
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
    fetchUserReviews,
    getExistingReview,
    submitReview,
    updateReview,
    deleteReview,
  };
};

export default useReviews;
