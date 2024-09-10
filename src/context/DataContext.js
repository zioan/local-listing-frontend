import React, { createContext, useContext, useState, useCallback, useEffect, useRef } from "react";
import api from "../config/api";

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const [state, setState] = useState({
    listings: [],
    categories: [],
    subcategories: {},
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
    async (reset = false, filters = {}) => {
      if (reset) {
        setListingsPage(1);
        setHasMore(true);
      }
      if (!hasMore && !reset) return;

      updateLoading("listings", true);
      updateError("listings", null);

      try {
        const params = {
          page: reset ? 1 : listingsPage,
          page_size: 20,
          ...filters,
        };

        Object.keys(params).forEach((key) => (params[key] === "" || params[key] === null) && delete params[key]);

        const response = await api.get("listings/listings/", { params });
        const newListings = response.data.results || [];
        setState((prev) => ({
          ...prev,
          listings: reset ? newListings : [...prev.listings, ...newListings],
        }));
        setHasMore(!!response.data.next);
        setListingsPage((prev) => (reset ? 2 : prev + 1));
      } catch (err) {
        updateError("listings", err.message || "Failed to fetch listings");
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

  const fetchSubcategories = useCallback(
    async (categoryId) => {
      if (!categoryId) return;
      if (state.subcategories[categoryId]) return;

      updateLoading("subcategories", true);
      updateError("subcategories", null);

      try {
        const response = await api.get(`listings/subcategories/by-category/${categoryId}/`);
        const subcategoriesData = Array.isArray(response.data) ? response.data : [];

        setState((prev) => ({
          ...prev,
          subcategories: {
            ...prev.subcategories,
            [categoryId]: subcategoriesData,
          },
        }));
      } catch (err) {
        console.error("Error fetching subcategories:", err);
        updateError("subcategories", err.message || "Failed to fetch subcategories");
        setState((prev) => ({
          ...prev,
          subcategories: {
            ...prev.subcategories,
            [categoryId]: [],
          },
        }));
      } finally {
        updateLoading("subcategories", false);
      }
    },
    [state.subcategories]
  );

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

  const invalidateCache = useCallback(
    (key) => {
      switch (key) {
        case "listings":
          setState((prev) => ({ ...prev, listings: [] }));
          setListingsPage(1);
          setHasMore(true);
          fetchListings(true);
          break;
        case "categories":
          setState((prev) => ({ ...prev, categories: [] }));
          fetchCategories();
          break;
        case "favorites":
          setState((prev) => ({ ...prev, favorites: [] }));
          fetchFavorites();
          break;
        case "myListings":
          setState((prev) => ({ ...prev, myListings: [] }));
          fetchMyListings();
          break;
        default:
          if (key.startsWith("listing-")) {
            const listingId = key.split("-")[1];
            setState((prev) => ({
              ...prev,
              listingDetails: {
                ...prev.listingDetails,
                [listingId]: undefined,
              },
            }));
            fetchListing(listingId);
          } else if (key.startsWith("subcategories-")) {
            const categoryId = key.split("-")[1];
            setState((prev) => ({
              ...prev,
              subcategories: {
                ...prev.subcategories,
                [categoryId]: undefined,
              },
            }));
            fetchSubcategories(categoryId);
          }
      }
    },
    [fetchListings, fetchCategories, fetchFavorites, fetchMyListings, fetchListing, fetchSubcategories]
  );

  const updateListing = useCallback(
    async (id, listingData) => {
      updateLoading(`listing-${id}`, true);
      updateError(`listing-${id}`, null);
      try {
        const response = await api.put(`listings/listings/${id}/`, listingData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        setState((prev) => ({
          ...prev,
          listingDetails: {
            ...prev.listingDetails,
            [id]: response.data,
          },
        }));
        invalidateCache("listings");
        invalidateCache("myListings");
        return response.data;
      } catch (err) {
        updateError(`listing-${id}`, err.message || "Failed to update listing");
        throw err;
      } finally {
        updateLoading(`listing-${id}`, false);
      }
    },
    [invalidateCache]
  );

  const deleteListing = useCallback(async (id) => {
    try {
      await api.delete(`listings/listings/${id}/`);

      setState((prevState) => ({
        ...prevState,
        listings: prevState.listings.filter((listing) => listing.id !== id),
        favorites: prevState.favorites.filter((listing) => listing.id !== id),
        myListings: prevState.myListings.filter((listing) => listing.id !== id),
        listingDetails: {
          ...prevState.listingDetails,
          [id]: undefined,
        },
      }));

      return { success: true };
    } catch (error) {
      console.error("Error deleting listing:", error);
      return { success: false, error };
    }
  }, []);

  // User Public Profile
  const fetchPublicProfile = useCallback(async (username) => {
    updateLoading("profile", true);
    updateError("profile", null);
    try {
      const response = await api.get(`profiles/profiles/${username}/`);
      return response.data;
    } catch (err) {
      updateError("profile", err.message);
    } finally {
      updateLoading("profile", false);
    }
  }, []);

  const fetchUserListings = useCallback(async (username) => {
    updateLoading("userListings", true);
    updateError("userListings", null);
    try {
      const response = await api.get(`profiles/listings/user/${username}/`);
      return response.data;
    } catch (err) {
      updateError("userListings", err.message);
    } finally {
      updateLoading("userListings", false);
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
        fetchSubcategories,
        fetchListing,
        fetchFavorites,
        fetchMyListings,
        updateListing,
        deleteListing,
        invalidateCache,
        hasMore,
        fetchPublicProfile,
        fetchUserListings,
        initializeData,
      }}
    >
      {children}
    </DataContext.Provider>
  );
};
