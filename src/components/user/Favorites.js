import React, { useState, useEffect } from "react";
import api from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import ListingCard from "../listings/ListingCard";
import LoadingSpinner from "../shared/LoadingSpinner";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const fetchFavorites = async () => {
    try {
      const response = await api.get("listings/favorites/");
      setFavorites(response.data);
      setLoading(false);
    } catch (err) {
      setError("Error fetching favorites. Please try again.");
      setLoading(false);
    }
  };

  if (loading) return <LoadingSpinner isLoading={loading} />;
  if (error) return <div className="py-8 text-center text-red-500">{error}</div>;

  return (
    <div className="container px-4 py-8 mx-auto">
      <h2 className="mb-6 text-2xl font-bold">My Favorites</h2>
      {favorites.length === 0 ? (
        <p className="text-center text-gray-600">You haven't added any listings to your favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {favorites.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
