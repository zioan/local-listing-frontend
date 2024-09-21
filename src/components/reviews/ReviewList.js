import React from "react";
import { formatDate } from "../../util/listingHelpers";

const ReviewList = ({ reviews }) => {
  console.log("reviews", reviews);
  return (
    <div className="mt-6">
      <h3 className="text-lg font-semibold">Reviews</h3>
      {reviews.length === 0 ? (
        <p className="mt-2 text-gray-500">No reviews yet.</p>
      ) : (
        <ul className="mt-2 space-y-4">
          {reviews.map((review) => (
            <li key={review.id} className="overflow-hidden bg-white shadow sm:rounded-md">
              <div className="px-4 py-5 sm:p-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-indigo-600">{review.reviewer_username}</span>
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
      )}
    </div>
  );
};

export default ReviewList;
