import React, { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import useReviews from "../../hooks/useReviews";

const ReviewForm = ({ userId, onReviewSubmitted }) => {
  const [rating, setRating] = useState(5);
  const [content, setContent] = useState("");
  const { user } = useAuth();
  const { submitReview, loading, error } = useReviews();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const newReview = await submitReview(userId, { rating, content });
      onReviewSubmitted(newReview);
      setRating(5);
      setContent("");
    } catch (err) {
      console.error("Failed to submit review:", err);
    }
  };

  if (user.id === userId) {
    return null;
  }

  const formatErrorMessage = (error) => {
    if (typeof error === "string") return error;
    if (typeof error === "object") {
      return Object.entries(error)
        .map(([key, value]) => `${key}: ${Array.isArray(value) ? value.join(", ") : value}`)
        .join("; ");
    }
    return "An unknown error occurred";
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <h3 className="text-lg font-semibold">Leave a Review</h3>
      <div className="mt-2">
        <label className="block text-sm font-medium text-gray-700">Rating</label>
        <select
          value={rating}
          onChange={(e) => setRating(Number(e.target.value))}
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
          onChange={(e) => setContent(e.target.value)}
          rows="3"
          className="block w-full mt-1 border-gray-300 rounded-md sm:text-sm"
          placeholder="Write your review here..."
        ></textarea>
      </div>
      {error && <p className="mt-2 text-sm text-red-600">{formatErrorMessage(error)}</p>}
      <button
        type="submit"
        disabled={loading}
        className="inline-flex justify-center px-4 py-2 mt-3 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
};

export default ReviewForm;
