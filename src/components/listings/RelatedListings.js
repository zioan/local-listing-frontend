import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import ListingCard from "./ListingCard";

/**
 * RelatedListings Component
 *
 * This component displays a list of related listings based on the category of the current listing.
 * It filters out the current listing and only shows listings that are active and belong to the same category.
 *
 * @param {string} category - The category of the current listing.
 * @param {number} currentListingId - The ID of the current listing to exclude it from related listings.
 * @returns JSX.Element
 */
const RelatedListings = ({ category, currentListingId }) => {
  const { listings } = useData();
  const navigate = useNavigate();

  /**
   * useMemo hook to calculate related listings based on category and current listing.
   * It filters listings that match the category, are active, and excludes the current listing.
   *
   * @returns {Array} - An array of related listings, limited to 4 items.
   */
  const relatedListings = useMemo(() => {
    return listings.filter((listing) => listing.category === category && listing.id !== currentListingId && listing.status === "active").slice(0, 4); // Limit to 4 related listings
  }, [listings, category, currentListingId]);

  /**
   * handleViewMore
   *
   * Navigates to home page with the category filter to view more listings in the same category.
   */
  const handleViewMore = () => {
    navigate(`/?category=${category}`);
  };

  return (
    <div className="mt-8">
      <h2 className="mb-4 text-2xl font-bold">Related Listings</h2>
      {relatedListings.length > 0 ? (
        <>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {relatedListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
          <div className="mt-4 text-center">
            <button onClick={handleViewMore} className="px-4 py-2 text-white transition duration-300 bg-blue-500 rounded hover:bg-blue-600">
              View More
            </button>
          </div>
        </>
      ) : (
        <p>No related listings found.</p>
      )}
    </div>
  );
};

export default RelatedListings;
