import React from "react";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import ListingCard from "../listings/ListingCard";
import LoadingSpinner from "../shared/LoadingSpinner";

/**
 * Favorites component displays the user's favorite listings.
 *
 * It shows a loading spinner while fetching data, handles errors,
 * and renders the list of favorite listings or appropriate messages based on the user's authentication status.
 *
 * @returns {JSX.Element} The Favorites component.
 */
const Favorites = () => {
  const { favorites, loading, error } = useData();
  const { user } = useAuth();

  // Show loading spinner if favorites are being fetched
  if (loading.favorites) return <LoadingSpinner isLoading={loading.favorites} />;

  // Show error message if there's an error fetching favorites
  if (error.favorites) return <div className="text-red-500">Error: {error.favorites}</div>;

  return (
    <div className="container px-4 py-10 mx-auto">
      <h2 className="mb-6 text-2xl font-bold">My Favorites</h2>

      {user ? (
        favorites.length === 0 ? (
          // Show message if there are no favorites
          <p className="text-center text-gray-600">You haven't added any listings to your favorites yet.</p>
        ) : (
          // Render the grid of favorite listings
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {favorites.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )
      ) : (
        // Prompt to log in if user is not authenticated
        <p>Please log in to view your favorites.</p>
      )}
    </div>
  );
};

export default Favorites;
