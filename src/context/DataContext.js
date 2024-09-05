import React, { createContext, useContext, useState, useCallback, useEffect } from "react";
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
  const [cache, setCache] = useState({});
  const [isInitialized, setIsInitialized] = useState(false);

  const updateState = (key, data) => {
    setState((prev) => ({ ...prev, [key]: data }));
  };

  const updateLoading = (key, isLoading) => {
    setLoading((prev) => ({ ...prev, [key]: isLoading }));
  };

  const updateError = (key, errorMessage) => {
    setError((prev) => ({ ...prev, [key]: errorMessage }));
  };

  const fetchWithCache = useCallback(
    async (key, fetchFunction) => {
      if (cache[key] && Date.now() - cache[key].timestamp < 5 * 60 * 1000) {
        return cache[key].data;
      }

      updateLoading(key, true);
      updateError(key, null);

      try {
        const data = await fetchFunction();
        setCache((prevCache) => ({
          ...prevCache,
          [key]: { data, timestamp: Date.now() },
        }));
        updateState(key, data);
        updateLoading(key, false);
        return data;
      } catch (err) {
        updateError(key, err.message);
        updateLoading(key, false);
        throw err;
      }
    },
    [cache]
  );

  const fetchListings = useCallback(
    (category = "") => {
      return fetchWithCache("listings", async () => {
        const response = await api.get("listings/listings", { params: { category } });
        return response.data;
      });
    },
    [fetchWithCache]
  );

  const fetchCategories = useCallback(() => {
    return fetchWithCache("categories", async () => {
      const response = await api.get("listings/categories/");
      const categoriesWithSubcategories = response.data.map((category) => ({
        ...category,
        subcategories: category.subcategories || [],
      }));
      return categoriesWithSubcategories;
    });
  }, [fetchWithCache]);

  const fetchListing = useCallback(
    (id) => {
      return fetchWithCache(`listing-${id}`, async () => {
        const response = await api.get(`listings/listings/${id}/`);
        setState((prev) => ({
          ...prev,
          listingDetails: {
            ...prev.listingDetails,
            [id]: response.data,
          },
        }));
        return response.data;
      });
    },
    [fetchWithCache]
  );

  const fetchFavorites = useCallback(() => {
    return fetchWithCache("favorites", async () => {
      const response = await api.get("listings/favorites/");
      return response.data;
    });
  }, [fetchWithCache]);

  const fetchMyListings = useCallback(() => {
    return fetchWithCache("my-listings", async () => {
      const response = await api.get("listings/my-listings/", {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      return response.data;
    });
  }, [fetchWithCache]);

  const invalidateCache = useCallback((key) => {
    setCache((prevCache) => {
      const newCache = { ...prevCache };
      delete newCache[key];
      return newCache;
    });
  }, []);

  const initializeData = useCallback(async () => {
    if (isInitialized) return;

    try {
      await Promise.all([fetchListings(), fetchCategories()]);
      setIsInitialized(true);
    } catch (error) {
      console.error("Error initializing data:", error);
    }
  }, [fetchListings, fetchCategories, isInitialized]);

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
        invalidateCache,
        initializeData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
