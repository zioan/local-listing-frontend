import { useState, useCallback } from "react";
import api from "../config/api";
import { useError } from "../context/ErrorContext";

/**
 * Custom hook for managing the user's favorite listings.
 *
 * @param {Object} user - The current authenticated user.
 * @returns {Object} An object containing favorites data, loading state, error information,
 *                  functions to fetch favorites and update favorite status.
 */
const useFavorites = (user) => {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { handleApiError } = useError();

  /**
   * Fetches favorite listings from the API for the authenticated user.
   * Will not fetch if the user is not authenticated.
   */
  const fetchFavorites = useCallback(async () => {
    if (!user) return; // Prevent fetching if there is no user

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
  }, [user, handleApiError]);

  /**
   * Updates the favorite status of a listing.
   *
   * @param {number} listingId - The ID of the listing to update.
   * @param {boolean} isFavorited - The new favorite status.
   * @param {Array} allListings - Array of all listings to find the listing to add.
   */
  const updateFavoriteStatus = useCallback((listingId, isFavorited, allListings) => {
    setFavorites((prev) => {
      if (isFavorited) {
        const listingToAdd = allListings.find((listing) => listing.id === listingId);
        return listingToAdd ? [...prev, listingToAdd] : prev; // Add to favorites if not already present
      } else {
        return prev.filter((fav) => fav.id !== listingId); // Remove from favorites
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
