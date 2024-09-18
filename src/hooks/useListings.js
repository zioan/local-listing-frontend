import { useState, useCallback } from "react";
import api from "../config/api";

const useListings = () => {
  const [listings, setListings] = useState([]);
  const [listingsPage, setListingsPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [lastFetchedFilters, setLastFetchedFilters] = useState(null);

  const fetchListings = useCallback(
    async (reset = false, filters = {}) => {
      // Check if we already have listings for these filters
      if (!reset && JSON.stringify(filters) === JSON.stringify(lastFetchedFilters)) {
        return;
      }

      if (reset) {
        setListingsPage(1);
        setHasMore(true);
      }

      if (!hasMore && !reset) return;

      setLoading(true);
      setError(null);

      try {
        const params = {
          page: reset ? 1 : listingsPage,
          page_size: 20,
          ...filters,
        };
        Object.keys(params).forEach((key) => (params[key] === "" || params[key] === null) && delete params[key]);

        const response = await api.get("listings/listings/", { params });
        const newListings = response.data.results || [];

        setListings((prev) => (reset ? newListings : [...prev, ...newListings]));
        setHasMore(!!response.data.next);
        setListingsPage((prev) => (reset ? 2 : prev + 1));
        setLastFetchedFilters(filters);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to fetch listings");
      } finally {
        setLoading(false);
      }
    },
    [listingsPage, hasMore, lastFetchedFilters]
  );

  const updateListing = useCallback(async (id, listingData) => {
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
      setError(err.response?.data?.message || "Failed to update listing");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const updateListingStatus = useCallback(async (id, newStatus) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.patch(`listings/listings/${id}/update-status/`, { status: newStatus });
      setListings((prevListings) => prevListings.map((listing) => (listing.id === id ? { ...listing, status: response.data.status } : listing)));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update listing status");
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteListing = useCallback(async (id) => {
    try {
      await api.delete(`listings/listings/${id}/`);
      setListings((prev) => prev.filter((listing) => listing.id !== id));
      return { success: true };
    } catch (error) {
      console.error("Error deleting listing:", error);
      return {
        success: false,
        error: error.response?.data?.message || "Failed to delete listing",
      };
    }
  }, []);

  return {
    listings,
    hasMore,
    loading,
    error,
    fetchListings,
    updateListing,
    updateListingStatus,
    deleteListing,
    setListings,
    setListingsPage,
    setHasMore,
    lastFetchedFilters,
  };
};

export default useListings;
