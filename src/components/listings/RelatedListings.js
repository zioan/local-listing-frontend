import React, { useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import ListingCard from "./ListingCard";

const RelatedListings = ({ category, currentListingId }) => {
  const { listings } = useData();
  const navigate = useNavigate();

  const relatedListings = useMemo(() => {
    return listings.filter((listing) => listing.category === category && listing.id !== currentListingId && listing.status === "active").slice(0, 4);
  }, [listings, category, currentListingId]);

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
