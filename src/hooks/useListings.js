import { useState, useCallback } from "react";
import api from "../config/api";
import { useError } from "../context/ErrorContext";

const useListings = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { handleApiError } = useError();

  const fetchListings = useCallback(async (filters = {}) => {
    setLoading(true);
    setError(null);
    try {
      const params = { ...filters };
      Object.keys(params).forEach((key) => (params[key] === "" || params[key] === null) && delete params[key]);
      const response = await api.get("listings/listings/", { params });
      const newListings = response.data.results || [];
      setListings(newListings);
    } catch (err) {
      handleApiError(err, "Failed to fetch listings");
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
      handleApiError(err, "Failed to update listing");
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
      handleApiError(err, "Failed to update listing status");
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteListing = useCallback(async (id) => {
    try {
      await api.delete(`listings/listings/${id}/`);
      setListings((prev) => prev.filter((listing) => listing.id !== id));
      return { success: true };
    } catch (err) {
      handleApiError(err, "Failed to delete listing");
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
