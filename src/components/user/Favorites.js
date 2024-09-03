import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const Favorites = () => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  useEffect(() => {
    const fetchFavorites = async () => {
      try {
        const response = await axios.get("/api/listings/favorites/", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("access_token")}`,
          },
        });
        setFavorites(response.data);
        setLoading(false);
      } catch (err) {
        setError("Error fetching favorites. Please try again.");
        setLoading(false);
      }
    };

    if (user) {
      fetchFavorites();
    }
  }, [user]);

  const handleRemoveFavorite = async (listingId) => {
    try {
      await axios.post(`/api/listings/${listingId}/unfavorite/`, null, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      setFavorites(favorites.filter((fav) => fav.id !== listingId));
    } catch (err) {
      setError("Error removing favorite. Please try again.");
    }
  };

  if (loading) return <div>Loading...</div>;
  if (error) return <div className="text-red-500">{error}</div>;

  return (
    <div className="container px-4 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">My Favorites</h2>
      {favorites.length === 0 ? (
        <p>You haven't added any listings to your favorites yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {favorites.map((listing) => (
            <div key={listing.id} className="overflow-hidden border rounded-lg shadow-lg">
              {listing.images && listing.images.length > 0 && (
                <img src={listing.images[0].image} alt={listing.title} className="object-cover w-full h-48" />
              )}
              <div className="p-4">
                <h3 className="mb-2 text-xl font-semibold">{listing.title}</h3>
                <p className="mb-2 text-gray-600">${listing.price}</p>
                <p className="mb-4 text-sm text-gray-500">{listing.created_at}</p>
                <div className="flex justify-between">
                  <Link to={`/listings/${listing.id}`} className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">
                    View Details
                  </Link>
                  <button
                    onClick={() => handleRemoveFavorite(listing.id)}
                    className="px-4 py-2 font-bold text-white bg-red-500 rounded hover:bg-red-700"
                  >
                    Remove
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Favorites;
