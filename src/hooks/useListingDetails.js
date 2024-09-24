import { useState, useCallback } from "react";
import api from "../config/api";
import { HttpError } from "../util/ErrorBoundary";

const useListingDetails = () => {
  const [listingDetails, setListingDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

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
      if (err instanceof HttpError) {
        setError(err);
        return null;
      }
      setError(new Error("An unexpected error occurred"));
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
