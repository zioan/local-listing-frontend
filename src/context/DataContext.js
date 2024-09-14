import React, { createContext, useContext, useCallback, useEffect, useRef } from "react";
import { useAuth } from "./AuthContext";
import { useWatcher } from "./WatcherContext";
import useCategories from "../hooks/useCategories";
import useSubcategories from "../hooks/useSubcategories";
import useFavorites from "../hooks/useFavorites";
import useListings from "../hooks/useListings";
import useMyListings from "../hooks/useMyListings";
import useListingDetails from "../hooks/useListingDetails";
import useProfile from "../hooks/useProfile";
import useCacheManagement from "../hooks/useCacheManagement";

const DataContext = createContext();

export const useData = () => useContext(DataContext);

export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const { updateTrigger } = useWatcher();
  const isInitialized = useRef(false);

  const { categories, loading: categoriesLoading, error: categoriesError, fetchCategories, setCategories } = useCategories();

  const { subcategories, loading: subcategoriesLoading, error: subcategoriesError, fetchSubcategories, setSubcategories } = useSubcategories();

  const { favorites, loading: favoritesLoading, error: favoritesError, fetchFavorites, updateFavoriteStatus, setFavorites } = useFavorites(user);

  const {
    listings,
    hasMore,
    loading: listingsLoading,
    error: listingsError,
    fetchListings,
    updateListing,
    deleteListing,
    setListings,
    setListingsPage,
    setHasMore,
    lastFetchedFilters,
  } = useListings();

  const { myListings, loading: myListingsLoading, error: myListingsError, fetchMyListings, setMyListings } = useMyListings(user);

  const { listingDetails, loading: listingDetailsLoading, error: listingDetailsError, fetchListing, setListingDetails } = useListingDetails();

  const { loading: profileLoading, error: profileError, fetchPublicProfile, fetchUserListings } = useProfile();

  const resetListings = useCallback(() => {
    setListings([]);
    setListingsPage(1);
    setHasMore(true);
  }, [setListings, setListingsPage, setHasMore]);

  const resetCategories = useCallback(() => {
    setCategories([]);
  }, [setCategories]);

  const resetFavorites = useCallback(() => {
    setFavorites([]);
  }, [setFavorites]);

  const resetMyListings = useCallback(() => {
    setMyListings([]);
  }, [setMyListings]);

  const resetListingDetails = useCallback(
    (listingId) => {
      setListingDetails((prev) => {
        const newDetails = { ...prev };
        delete newDetails[listingId];
        return newDetails;
      });
    },
    [setListingDetails]
  );

  const resetSubcategories = useCallback(
    (categoryId) => {
      setSubcategories((prev) => {
        const newSubcategories = { ...prev };
        delete newSubcategories[categoryId];
        return newSubcategories;
      });
    },
    [setSubcategories]
  );

  const { invalidateCache } = useCacheManagement(
    resetListings,
    resetCategories,
    resetFavorites,
    resetMyListings,
    resetListingDetails,
    resetSubcategories,
    fetchListings,
    fetchCategories,
    fetchFavorites,
    fetchMyListings
  );

  const refetchUserData = useCallback(async () => {
    if (user) {
      await Promise.all([fetchFavorites(), fetchMyListings()]);
    }
  }, [user, fetchFavorites, fetchMyListings]);

  const initializeData = useCallback(async () => {
    if (isInitialized.current) return;
    isInitialized.current = true;

    await fetchCategories();

    if (user) {
      await Promise.all([fetchFavorites(), fetchListings(true), fetchMyListings()]);
    } else {
      await fetchListings(true);
    }
  }, [fetchCategories, fetchFavorites, fetchListings, fetchMyListings, user]);

  useEffect(() => {
    initializeData();
  }, [initializeData]);

  useEffect(() => {
    if (user) {
      refetchUserData();
    }
  }, [user, refetchUserData, updateTrigger.auth]);

  const updateFavoriteStatusAndListings = useCallback(
    (listingId, isFavorited) => {
      updateFavoriteStatus(listingId, isFavorited, listings);
      setListings((prevListings) => prevListings.map((listing) => (listing.id === listingId ? { ...listing, is_favorited: isFavorited } : listing)));
    },
    [updateFavoriteStatus, listings, setListings]
  );

  const contextValue = {
    categories,
    subcategories,
    favorites,
    listings,
    myListings,
    listingDetails,
    hasMore,
    loading: {
      categories: categoriesLoading,
      subcategories: subcategoriesLoading,
      favorites: favoritesLoading,
      listings: listingsLoading,
      myListings: myListingsLoading,
      listingDetails: listingDetailsLoading,
      profile: profileLoading,
    },
    error: {
      categories: categoriesError,
      subcategories: subcategoriesError,
      favorites: favoritesError,
      listings: listingsError,
      myListings: myListingsError,
      listingDetails: listingDetailsError,
      profile: profileError,
    },
    fetchCategories,
    fetchSubcategories,
    fetchFavorites,
    updateFavoriteStatus: updateFavoriteStatusAndListings,
    fetchListings,
    updateListing,
    deleteListing,
    fetchMyListings,
    fetchListing,
    fetchPublicProfile,
    fetchUserListings,
    invalidateCache,
    refetchUserData,
    initializeData,
    lastFetchedFilters,
  };

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};

export default DataProvider;
