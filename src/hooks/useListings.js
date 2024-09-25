import { useState, useCallback } from "react";
import api from "../config/api";
import { HttpError } from "../util/ErrorBoundary";

const useListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchListings = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = {
        ...filters,
      };
      Object.keys(params).forEach((key) => (params[key] === "" || params[key] === null) && delete params[key]);
      const response = await api.get("listings/listings/", { params });
      const newListings = response.data.results || [];
      setListings(newListings);
    } catch (err) {
      if (err instanceof HttpError) {
        setError(err);
        return null;
      }
      setError(err.response?.data?.message || "Failed to fetch listings");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

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
      setListings((prevListings) =>
        prevListings.map((listing) =>
          listing.id === id ? { ...listing, status: response.data.status, is_active: response.data.status === "active" } : listing
        )
      );
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
    loading,
    error,
    fetchListings,
    updateListing,
    updateListingStatus,
    deleteListing,
    setListings,
  };
};

export default useListings;
