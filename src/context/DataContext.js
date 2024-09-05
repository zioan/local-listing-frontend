import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import api from "../config/api";

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [state, setState] = useState({
    listings: [],
    categories: [],
    favorites: [],
    myListings: [],
    listingDetails: {},
  });
  const [loading, setLoading] = useState({});
  const [error, setError] = useState({});
  const [listingsPage, setListingsPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const isInitialized = useRef(false);

  const updateState = (key, data) => {
    setState((prev) => ({ ...prev, [key]: data }));
  };

  const updateLoading = (key, isLoading) => {
    setLoading((prev) => ({ ...prev, [key]: isLoading }));
  };

  const updateError = (key, errorMessage) => {
    setError((prev) => ({ ...prev, [key]: errorMessage }));
  };

  const fetchListings = useCallback(
    async (reset = false) => {
      if (reset) {
        setListingsPage(1);
        setHasMore(true);
      }

      if (!hasMore) return;

      updateLoading("listings", true);
      updateError("listings", null);

      try {
        const response = await api.get("listings/listings/", {
          params: { page: reset ? 1 : listingsPage, page_size: 20 },
        });

        const newListings = response.data.results;
        setState((prev) => ({
          ...prev,
          listings: reset ? newListings : [...prev.listings, ...newListings],
        }));

        setHasMore(!!response.data.next);
        setListingsPage((prev) => (reset ? 2 : prev + 1));
      } catch (err) {
        updateError("listings", err.message);
      } finally {
        updateLoading("listings", false);
      }
    },
    [listingsPage, hasMore]
  );

  const fetchCategories = useCallback(async () => {
    if (state.categories.length > 0) return;
    updateLoading("categories", true);
    updateError("categories", null);
    try {
      const response = await api.get("listings/categories/");
      updateState("categories", response.data);
    } catch (err) {
      updateError("categories", err.message);
    } finally {
      updateLoading("categories", false);
    }
  }, [state.categories.length]);

  const fetchFavorites = useCallback(async () => {
    updateLoading("favorites", true);
    updateError("favorites", null);
    try {
      const response = await api.get("listings/favorites/");
      updateState("favorites", response.data);
    } catch (err) {
      updateError("favorites", err.message);
    } finally {
      updateLoading("favorites", false);
    }
  }, []);

  const fetchListing = useCallback((id) => {
    return new Promise(async (resolve, reject) => {
      updateLoading(`listing-${id}`, true);
      updateError(`listing-${id}`, null);
      try {
        const response = await api.get(`listings/listings/${id}/`);
        setState((prev) => ({
          ...prev,
          listingDetails: {
            ...prev.listingDetails,
            [id]: response.data,
          },
        }));
        resolve(response.data);
      } catch (err) {
        updateError(`listing-${id}`, err.message);
        reject(err);
      } finally {
        updateLoading(`listing-${id}`, false);
      }
    });
  }, []);

  const fetchMyListings = useCallback(async () => {
    updateLoading("myListings", true);
    updateError("myListings", null);
    try {
      const response = await api.get("listings/my-listings/");
      updateState("myListings", response.data);
    } catch (err) {
      updateError("myListings", err.message);
    } finally {
      updateLoading("myListings", false);
    }
  }, []);

  const initializeData = useCallback(async () => {
    if (isInitialized.current) return;
    isInitialized.current = true;
    await Promise.all([fetchCategories(), fetchFavorites(), fetchListings(true), fetchMyListings()]);
  }, [fetchCategories, fetchFavorites, fetchListings, fetchMyListings]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  return (
    <DataContext.Provider
      value={{
        state,
        loading,
        error,
        fetchListings,
        fetchCategories,
        fetchListing,
        fetchFavorites,
        fetchMyListings,
        hasMore,
        initializeData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
