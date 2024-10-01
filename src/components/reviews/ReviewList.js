import React from "react";
import { Link } from "react-router-dom";
import { formatDate } from "../../util/listingHelpers";

/**
 * ReviewList Component
 *
 * This component displays a list of reviews made by a specific user. It handles the display of
 * review details such as reviewer username, review date, rating, and review content.
 *
 * @param {Array} reviews - Array of review objects.
 * @param {string} user - Username of the user whose reviews are displayed.
 * @returns JSX.Element
 */
const ReviewList = ({ reviews, user }) => {
  return (
    <div className="mt-6">
      {reviews.length === 0 ? (
        <p className="mt-2 text-gray-500">{user} have no reviews</p>
      ) : (
        <>
          <h4 className="mt-8 mb-4 text-2xl font-bold">{user}'s reviews</h4>
          <ul className="mt-2 space-y-4">
            {reviews.map((review) => (
              <li key={review.id} className="overflow-hidden bg-white shadow sm:rounded-md">
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center justify-between">
                    <Link to={`/profiles/${review.reviewer_username}`} className="text-blue-600 hover:underline">
                      {review.reviewer_username}
                    </Link>
                    <span className="text-sm text-gray-500">{formatDate(review.created_at)}</span>
                  </div>
                  <div className="flex items-center mt-2">
                    {[...Array(5)].map((_, index) => (
                      <svg
                        key={index}
                        className={`h-5 w-5 ${index < review.rating ? "text-yellow-400" : "text-gray-300"}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <p className="mt-2 text-sm text-gray-500">{review.content}</p>
                </div>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
};

export default ReviewList;
