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

// Create a context for data management
const DataContext = createContext();

/**
 * Custom hook to access the DataContext.
 *
 * @returns {Object} The data context value
 */
export const useData = () => useContext(DataContext);

/**
 * DataProvider component that wraps the application and provides
 * data context to its children. It manages various data states such
 * as categories, subcategories, favorites, listings, and user data.
 *
 * @param {Object} props - React props
 * @param {ReactNode} props.children - Children components to be wrapped
 * @returns {JSX.Element} The DataProvider component
 */
export const DataProvider = ({ children }) => {
  const { user } = useAuth();
  const { updateTrigger } = useWatcher();
  const isInitialized = useRef(false);

  // Hooks to manage various data states
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
    updateListingStatus,
    deleteListing,
    setListings,
    lastFetchedFilters,
  } = useListings();
  const { myListings, loading: myListingsLoading, error: myListingsError, fetchMyListings, setMyListings } = useMyListings(user);
  const { listingDetails, loading: listingDetailsLoading, error: listingDetailsError, fetchListing, setListingDetails } = useListingDetails();
  const { loading: profileLoading, error: profileError, fetchPublicProfile, fetchUserListings } = useProfile();

  // Reset functions for data states
  const resetListings = useCallback(() => setListings([]), [setListings]);
  const resetCategories = useCallback(() => setCategories([]), [setCategories]);
  const resetFavorites = useCallback(() => setFavorites([]), [setFavorites]);
  const resetMyListings = useCallback(() => setMyListings([]), [setMyListings]);

  /**
   * Resets the details of a specific listing by its ID.
   *
   * @param {number} listingId - The ID of the listing to reset
   */
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

  /**
   * Resets the subcategories for a specific category by its ID.
   *
   * @param {number} categoryId - The ID of the category to reset subcategories for
   */
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

  // Cache management hook
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

  /**
   * Refetches user-related data when the user changes.
   */
  const refetchUserData = useCallback(async () => {
    if (user) {
      await Promise.all([fetchFavorites(), fetchMyListings()]);
    }
  }, [user, fetchFavorites, fetchMyListings]);

  /**
   * Initializes data fetching when the provider mounts.
   * Fetches categories and user-related data based on authentication status.
   */
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

  // Fetch initial data on mount
  useEffect(() => {
    initializeData();
  }, [initializeData]);

  // Refetch user data when user changes or the auth context updates
  useEffect(() => {
    if (user) {
      refetchUserData();
    }
  }, [user, refetchUserData, updateTrigger.auth]);

  /**
   * Updates the favorite status of a listing and updates the local listings state.
   *
   * @param {number} listingId - The ID of the listing
   * @param {boolean} isFavorited - The new favorite status
   */
  const updateFavoriteStatusAndListings = useCallback(
    (listingId, isFavorited) => {
      updateFavoriteStatus(listingId, isFavorited, listings);
      setListings((prevListings) => prevListings.map((listing) => (listing.id === listingId ? { ...listing, is_favorited: isFavorited } : listing)));
    },
    [updateFavoriteStatus, listings, setListings]
  );

  // Context value to be provided
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
    lastFetchedFilters,
    updateListing,
    updateListingStatus,
    deleteListing,
    fetchMyListings,
    fetchListing,
    fetchPublicProfile,
    fetchUserListings,
    invalidateCache,
    refetchUserData,
    initializeData,
  };

  return <DataContext.Provider value={contextValue}>{children}</DataContext.Provider>;
};

export default DataProvider;
