import React from "react";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import ListingCard from "../listings/ListingCard";
import LoadingSpinner from "../shared/LoadingSpinner";

const Favorites = () => {
  const { favorites, loading, error } = useData();
  const { user } = useAuth();

  if (loading.favorites) return <LoadingSpinner isLoading={loading.favorites} />;
  if (error.favorites) return <div className="text-red-500">Error: {error.favorites}</div>;

  return (
    <div className="container px-4 py-8 mx-auto">
      <h2 className="mb-6 text-2xl font-bold">My Favorites</h2>

      {user ? (
        favorites.length === 0 ? (
          <p className="text-center text-gray-600">You haven't added any listings to your favorites yet.</p>
        ) : (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {favorites.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )
      ) : (
        <p>Please log in to view your favorites.</p>
      )}
    </div>
  );
};

export default Favorites;
