import { useCallback } from "react";

/**
 * Custom hook for managing cache invalidation and data fetching.
 *
 * @param {Function} resetListings - Function to reset listings state
 * @param {Function} resetCategories - Function to reset categories state
 * @param {Function} resetFavorites - Function to reset favorites state
 * @param {Function} resetMyListings - Function to reset my listings state
 * @param {Function} resetListingDetails - Function to reset listing details for a specific listing
 * @param {Function} resetSubcategories - Function to reset subcategories for a specific category
 * @param {Function} fetchListings - Function to fetch listings
 * @param {Function} fetchCategories - Function to fetch categories
 * @param {Function} fetchFavorites - Function to fetch favorites
 * @param {Function} fetchMyListings - Function to fetch my listings
 *
 * @returns {Object} An object containing the `invalidateCache` function
 */
const useCacheManagement = (
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
) => {
  /**
   * Invalidates the cache for the given key and fetches the corresponding data.
   *
   * @param {string} key - The cache key to invalidate (e.g., "listings", "categories", etc.)
   */
  const invalidateCache = useCallback(
    (key) => {
      switch (key) {
        case "listings":
          resetListings(); // Reset listings cache
          fetchListings(true); // Fetch new listings
          break;
        case "categories":
          resetCategories(); // Reset categories cache
          fetchCategories(); // Fetch new categories
          break;
        case "favorites":
          resetFavorites(); // Reset favorites cache
          fetchFavorites(); // Fetch new favorites
          break;
        case "myListings":
          resetMyListings(); // Reset my listings cache
          fetchMyListings(); // Fetch new my listings
          break;
        default:
          if (key.startsWith("listing-")) {
            const listingId = key.split("-")[1]; // Extract listing ID
            resetListingDetails(listingId); // Reset details for specific listing
          } else if (key.startsWith("subcategories-")) {
            const categoryId = key.split("-")[1]; // Extract category ID
            resetSubcategories(categoryId); // Reset subcategories for specific category
          }
      }
    },
    [
      resetListings,
      resetCategories,
      resetFavorites,
      resetMyListings,
      resetListingDetails,
      resetSubcategories,
      fetchListings,
      fetchCategories,
      fetchFavorites,
      fetchMyListings,
    ]
  );

  return {
    invalidateCache, // Expose the invalidateCache function
  };
};

export default useCacheManagement;
