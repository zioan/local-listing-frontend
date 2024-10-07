import { useState, useCallback } from "react";
import api from "../config/api";
import { useError } from "../context/ErrorContext";

/**
 * Custom hook for managing listings.
 *
 * @returns {Object} An object containing listings, loading state, error information,
 *                  and functions to fetch, update, and delete listings.
 */
const useListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [lastFetchedFilters, setLastFetchedFilters] = useState(null);
  const [error, setError] = useState(null);
  const { handleApiError } = useError();

  /**
   * Fetches listings based on provided filters.
   *
   * @param {Object} filters - The filters to apply when fetching listings.
   */
  const fetchListings = useCallback(
    async (filters = {}) => {
      setLoading(true);
      setError(null);
      try {
        const params = { ...filters };
        // Remove empty or null parameters from the request
        Object.keys(params).forEach((key) => (params[key] === "" || params[key] === null) && delete params[key]);
        const response = await api.get("listings/listings/", { params });
        const newListings = response.data.results || [];
        setListings(newListings);
        setLastFetchedFilters(filters);
      } catch (err) {
        handleApiError(err, "Failed to fetch listings");
      } finally {
        setLoading(false);
      }
    },
    [handleApiError]
  );

  /**
   * Updates a listing by its ID with new data.
   *
   * @param {number|string} id - The ID of the listing to update.
   * @param {Object} listingData - The new data for the listing.
   * @returns {Promise<Object>} The updated listing data.
   */
  const updateListing = useCallback(
    async (id, listingData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.put(`listings/listings/${id}/`, listingData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setListings((prev) => prev.map((listing) => (listing.id === id ? response.data : listing)));
        return response.data;
      } catch (err) {
        handleApiError(err, "Failed to update listing");
      } finally {
        setLoading(false);
      }
    },
    [handleApiError]
  );

  /**
   * Updates the status of a listing by its ID.
   *
   * @param {number|string} id - The ID of the listing to update.
   * @param {string} newStatus - The new status for the listing.
   * @returns {Promise<Object>} The updated listing status data.
   */
  const updateListingStatus = useCallback(
    async (id, newStatus) => {
      setLoading(true);
      setError(null);
      try {
        const response = await api.patch(`listings/listings/${id}/update-status/`, { status: newStatus });
        setListings((prevListings) =>
          prevListings.map((listing) =>
            listing.id === id ? { ...listing, status: response.data.status, is_active: response.data.status === "active" } : listing
          )
        );
        return response.data;
      } catch (err) {
        handleApiError(err, "Failed to update listing status");
      } finally {
        setLoading(false);
      }
    },
    [handleApiError]
  );

  /**
   * Deletes a listing by its ID.
   *
   * @param {number|string} id - The ID of the listing to delete.
   * @returns {Promise<Object>} A success message if the deletion was successful.
   */
  const deleteListing = useCallback(
    async (id) => {
      try {
        await api.delete(`listings/listings/${id}/`);
        setListings((prev) => prev.filter((listing) => listing.id !== id));
        return { success: true };
      } catch (err) {
        handleApiError(err, "Failed to delete listing");
      }
    },
    [handleApiError]
  );

  return {
    listings,
    loading,
    error,
    fetchListings,
    updateListing,
    updateListingStatus,
    deleteListing,
    setListings,
    lastFetchedFilters,
  };
};

export default useListings;
