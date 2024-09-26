import { useState, useCallback } from "react";
import api from "../config/api";
import { useError } from "../context/ErrorContext";

const useListingDetails = () => {
  const [listingDetails, setListingDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { handleApiError } = useError();

  const fetchListing = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    try {
      const response = await api.get(`listings/listings/${id}/`);
      setListingDetails((prev) => ({
        ...prev,
        [id]: response.data,
      }));
      return response.data;
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch listing details");
      handleApiError(err, "Failed to fetch listing details");
      return null;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    listingDetails,
    loading,
    error,
    fetchListing,
    setListingDetails,
  };
};

export default useListingDetails;
