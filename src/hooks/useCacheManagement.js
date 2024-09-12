import { useCallback } from "react";

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
  const invalidateCache = useCallback(
    (key) => {
      switch (key) {
        case "listings":
          resetListings();
          fetchListings(true);
          break;
        case "categories":
          resetCategories();
          fetchCategories();
          break;
        case "favorites":
          resetFavorites();
          fetchFavorites();
          break;
        case "myListings":
          resetMyListings();
          fetchMyListings();
          break;
        default:
          if (key.startsWith("listing-")) {
            const listingId = key.split("-")[1];
            resetListingDetails(listingId);
          } else if (key.startsWith("subcategories-")) {
            const categoryId = key.split("-")[1];
            resetSubcategories(categoryId);
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
    invalidateCache,
  };
};

export default useCacheManagement;
