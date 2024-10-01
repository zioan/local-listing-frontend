import React, { useState, useEffect, useCallback } from "react";
import { useAuth } from "../../context/AuthContext";
import useReviews from "../../hooks/useReviews";
import { useNavigate, useLocation } from "react-router-dom";
import { toast } from "react-toastify";
import Modal from "../shared/Modal";

/**
 * ReviewForm Component
 *
 * This component allows users to submit, update, and delete reviews for a specific user.
 * It handles fetching existing reviews and conditionally displays the review form based on user authentication status.
 *
 * @param {string} userId - The ID of the user being reviewed.
 * @param {function} onReviewSubmitted - Callback function invoked when a review is submitted.
 * @param {function} onReviewDeleted - Callback function invoked when a review is deleted.
 * @returns JSX.Element
 */
const ReviewForm = ({ userId, onReviewSubmitted, onReviewDeleted }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const [existingReview, setExistingReview] = useState(null);
  const [isUpdateModalOpen, setIsUpdateModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isInitialFetchDone, setIsInitialFetchDone] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const { user } = useAuth();
  const { submitReview, updateReview, deleteReview, getExistingReview, loading, error } = useReviews();

  /**
   * fetchExistingReview: Fetches the existing review for the user being reviewed.
   *
   * This function will only run if the user is authenticated and is not the one being reviewed.
   */
  const fetchExistingReview = useCallback(async () => {
    if (user && userId && user.id !== userId) {
      try {
        const review = await getExistingReview(userId, user.id);
        if (review) {
          setExistingReview(review);
          setRating(review.rating);
          setContent(review.content);
        } else {
          setExistingReview(null);
        }
      } catch (error) {
        toast.error("Failed to fetch existing review. Please try again.");
        throw error;
      } finally {
        setIsInitialFetchDone(true); // Mark fetch as complete
      }
    }
  }, [user, userId, getExistingReview]);

  useEffect(() => {
    if (!isInitialFetchDone) {
      fetchExistingReview();
    }
  }, [fetchExistingReview, isInitialFetchDone]);

  /**
   * handleSubmit: Handles the form submission event.
   *
   * If there is an existing review, it opens the update modal; otherwise, it submits a new review.
   *
   * @param {Event} e - The form submit event.
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (existingReview) {
      setIsUpdateModalOpen(true);
    } else {
      await submitNewReview();
    }
  };

  /**
   * handleInputChange: Updates the local state based on user input.
   *
   * @param {Event} e - The change event from the input fields.
   */
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === "rating") {
      setRating(Number(value)); // Convert rating to a number
    } else if (name === "content") {
      setContent(value);
    }
  };

  /**
   * submitNewReview: Submits a new review to the server.
   *
   * This function handles success and error cases while providing feedback via toast notifications.
   */
  const submitNewReview = async () => {
    try {
      const reviewData = { rating, content };
      const newReview = await submitReview(userId, reviewData);
      onReviewSubmitted(newReview); // Invoke callback with new review
      setExistingReview(newReview);
      toast.success("Review submitted successfully!");
      setShowReviewForm(false);
    } catch (err) {
      handleReviewSubmissionError(err);
    }
  };

  /**
   * handleReviewSubmissionError: Handles errors that occur during review submission.
   *
   * Displays appropriate error messages based on the error structure.
   *
   * @param {Object} err - The error object received from the API.
   */
  const handleReviewSubmissionError = (err) => {
    if (err.reviewed_user && Array.isArray(err.reviewed_user)) {
      toast.error(err.reviewed_user[0]);
    } else if (typeof err === "object" && err !== null) {
      Object.entries(err).forEach(([key, value]) => {
        if (Array.isArray(value)) {
          toast.error(`${key}: ${value[0]}`);
        } else {
          toast.error(`${key}: ${value}`);
        }
      });
    } else {
      toast.error("Failed to submit review. Please try again.");
    }
  };

  /**
   * handleUpdateReview: Updates an existing review with the current content and rating.
   *
   * This function also provides success and error feedback via toast notifications.
   */
  const handleUpdateReview = async () => {
    try {
      const reviewData = { rating, content };
      const updatedReview = await updateReview(existingReview.id, reviewData);
      onReviewSubmitted(updatedReview); // Invoke callback with updated review
      setExistingReview(updatedReview);
      setIsUpdateModalOpen(false);
      toast.success("Review updated successfully!");
      setShowReviewForm(false);
    } catch (err) {
      toast.error(error || "Failed to update review. Please try again.");
    }
  };

  /**
   * handleDeleteReview: Deletes the existing review and resets the form state.
   *
   * Provides feedback upon successful deletion.
   */
  const handleDeleteReview = async () => {
    try {
      await deleteReview(existingReview.id);
      onReviewDeleted(existingReview.id); // Invoke callback with deleted review ID
      setExistingReview(null);
      setRating(5);
      setContent("");
      setIsDeleteModalOpen(false);
      toast.success("Review deleted successfully!");
      setShowReviewForm(false);
    } catch (err) {
      toast.error("Failed to delete review. Please try again.");
    }
  };

  /**
   * handleRedirectToLogin: Redirects the user to the login page.
   */
  const handleRedirectToLogin = () => {
    navigate("/login", { state: { from: location } });
  };

  // If the user is not logged in, prompt them to log in
  if (!user) {
    return (
      <div className="p-4 mt-4 bg-gray-100 rounded-md">
        <p className="text-center">
          Please{" "}
          <button onClick={handleRedirectToLogin} className="text-blue-600 hover:underline">
            log in
          </button>{" "}
          to leave a review.
        </p>
      </div>
    );
  }

  // Prevent a user from reviewing themselves
  if (user.id === userId) {
    return null;
  }

  return (
    <>
      {showReviewForm ? (
        <>
          <form onSubmit={handleSubmit} className="mt-4">
            <h3 className="text-lg font-semibold">{existingReview ? "Update Your Review" : "Leave a Review"}</h3>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">Rating</label>
              <select
                value={rating}
                onChange={handleInputChange}
                name="rating"
                className="block w-full py-2 pl-3 pr-10 mt-1 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              >
                {[5, 4, 3, 2, 1].map((value) => (
                  <option key={value} value={value}>
                    {value} Star{value !== 1 && "s"}
                  </option>
                ))}
              </select>
            </div>
            <div className="mt-2">
              <label className="block text-sm font-medium text-gray-700">Review</label>
              <textarea
                value={content}
                onChange={handleInputChange}
                required
                name="content"
                rows="3"
                className="block w-full mt-1 border-gray-300 rounded-md sm:text-sm"
                placeholder="Write your review here..."
              ></textarea>
            </div>
            {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
            <div className="flex justify-between mt-4">
              <button
                type="submit"
                disabled={loading || content.trim() === ""}
                className={`inline-flex justify-center px-4 py-2 text-sm font-medium 
                  ${loading || content.trim() === "" ? "bg-gray-400 cursor-not-allowed" : "bg-indigo-600 hover:bg-indigo-700"} 
                  text-white border border-transparent rounded-md shadow-sm 
                  focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
              >
                {loading ? "Submitting..." : existingReview ? "Update Review" : "Submit Review"}
              </button>

              {existingReview && (
                <button
                  type="button"
                  onClick={() => setIsDeleteModalOpen(true)}
                  className="inline-flex justify-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                  Delete Review
                </button>
              )}
            </div>
          </form>
          <Modal isOpen={isUpdateModalOpen} onClose={() => setIsUpdateModalOpen(false)} title="Update Review">
            <p>Are you sure you want to update your review?</p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setIsUpdateModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateReview}
                className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update
              </button>
            </div>
          </Modal>
          <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Delete Review">
            <p>Are you sure you want to delete your review? This action cannot be undone.</p>
            <div className="flex justify-end mt-4 space-x-2">
              <button
                onClick={() => setIsDeleteModalOpen(false)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Cancel
              </button>
              <button
                onClick={handleDeleteReview}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Delete
              </button>
            </div>
          </Modal>
        </>
      ) : (
        <button
          className="px-4 py-2 mt-4 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          onClick={() => setShowReviewForm(true)}
        >
          {existingReview ? "Update your Review" : "Leave a Review"}
        </button>
      )}
    </>
  );
};

export default ReviewForm;
