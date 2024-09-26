import { useState, useCallback } from "react";
import api from "../config/api";
import { useError } from "../context/ErrorContext";

const useFavorites = (user) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { handleApiError } = useError();

  const fetchFavorites = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("listings/favorites/");
      setFavorites(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Please log in to view favorites");
      } else {
        setError(err.response?.data?.message || "Failed to fetch favorites");
      }
      handleApiError(err, "Failed to fetch favorites");
    } finally {
      setLoading(false);
    }
  }, [user]);

  const updateFavoriteStatus = useCallback((listingId, isFavorited, allListings) => {
    setFavorites((prev) => {
      if (isFavorited) {
        const listingToAdd = allListings.find((listing) => listing.id === listingId);
        return listingToAdd ? [...prev, listingToAdd] : prev;
      } else {
        return prev.filter((fav) => fav.id !== listingId);
      }
    });
  }, []);

  return {
    favorites,
    loading,
    error,
    fetchFavorites,
    updateFavoriteStatus,
    setFavorites,
  };
};

export default useFavorites;
