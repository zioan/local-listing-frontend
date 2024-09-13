import { useState, useCallback } from "react";
import api from "../config/api";

const useMyListings = (user) => {
  const [myListings, setMyListings] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchMyListings = useCallback(async () => {
    if (!user) return;
    setLoading(true);
    setError(null);
    try {
      const response = await api.get("listings/my-listings/");
      setMyListings(response.data);
    } catch (err) {
      if (err.response && err.response.status === 401) {
        setError("Please log in to view your listings");
      } else {
        setError(err.response?.data?.message || "Failed to fetch my listings");
      }
    } finally {
      setLoading(false);
    }
  }, [user]);

  return {
    myListings,
    loading,
    error,
    fetchMyListings,
    setMyListings,
  };
};

export default useMyListings;
