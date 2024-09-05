import React, { useEffect } from "react";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import ListingCard from "../listings/ListingCard";
import LoadingSpinner from "../shared/LoadingSpinner";

const Favorites = () => {
  const { state, loading } = useData();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      return null;
    }
  }, [user]);

  if (loading.favorites) return <LoadingSpinner isLoading={loading.favorites} />;

  return (
    <div className="container px-4 py-8 mx-auto">
      <h2 className="mb-6 text-2xl font-bold">My Favorites</h2>
      {state.favorites.length === 0 ? (
        <p className="text-center text-gray-600">You haven't added any listings to your favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {state.favorites.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
