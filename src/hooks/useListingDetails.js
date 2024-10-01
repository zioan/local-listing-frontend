import { useState, useCallback } from "react";
import api from "../config/api";
import { useError } from "../context/ErrorContext";

/**
 * Custom hook for managing listing details.
 *
 * @returns {Object} An object containing listing details, loading state, error information,
 *                  and a function to fetch listing details by ID.
 */
const useListingDetails = () => {
  const [listingDetails, setListingDetails] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const { handleApiError } = useError();

  /**
   * Fetches the details of a listing by its ID.
   *
   * @param {number|string} id - The ID of the listing to fetch.
   * @returns {Promise<Object|null>} The fetched listing details or null if an error occurs.
   */
  const fetchListing = useCallback(
    async (id) => {
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
        // Handle errors and set appropriate error messages
        setError(err.response?.data?.message || "Failed to fetch listing details");
        handleApiError(err, "Failed to fetch listing details");
        return null;
      } finally {
        setLoading(false);
      }
    },
    [handleApiError]
  );

  return {
    listingDetails,
    loading,
    error,
    fetchListing,
    setListingDetails,
  };
};

export default useListingDetails;
