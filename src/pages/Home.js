import React, { useState, useCallback, useEffect, useMemo } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useSearch } from "../context/SearchContext";
import HeroSection from "../components/home/HeroSection";
import ListingCard from "../components/listings/ListingCard";
import Filter from "../components/home/Filter";
import ActiveFilters from "../components/home/ActiveFilters";
import SkeletonLoader from "../components/shared/SkeletonLoader";
import Modal from "../components/shared/Modal";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";

// Utility function to get non-empty filters
const getNonEmptyFilters = (filters) => {
  return Object.entries(filters).reduce((acc, [key, value]) => {
    if (value && value.trim() !== "") {
      acc[key] = value;
    }
    return acc;
  }, {});
};

/**
 * Home component for displaying listings with filtering options.
 * It handles fetching data, search functionality, and displaying listings.
 */
function Home() {
  const { listings, error, fetchListings, lastFetchedFilters } = useData();
  const { searchTerm, handleSearch } = useSearch();
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isInitialLoad, setIsInitialLoad] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [filters, setFilters] = useState(initializeFilters());
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Function to initialize filters from URL parameters or session storage
  function initializeFilters() {
    const searchParams = new URLSearchParams(location.search);
    const filtersFromUrl = Object.fromEntries(searchParams);

    // Use the non-empty filters from URL or sessionStorage
    const nonEmptyFilters = getNonEmptyFilters(filtersFromUrl);

    if (Object.keys(nonEmptyFilters).length > 0) {
      return nonEmptyFilters;
    }

    // Fall back to session storage if URL params are empty
    const storedFilters = sessionStorage.getItem("defaultFilters");
    return storedFilters ? JSON.parse(storedFilters) : {};
  }

  // Effect to update filters from URL params
  useEffect(() => {
    const newFilters = { ...filters };
    let hasChanges = false;

    for (const [key, value] of searchParams.entries()) {
      if (newFilters[key] !== value) {
        newFilters[key] = value;
        hasChanges = true;
      }
    }

    if (hasChanges) {
      setFilters(newFilters);
    }
  }, [searchParams]);

  // Effect to fetch listings when filters change
  useEffect(() => {
    const loadListings = async () => {
      if (isInitialLoad) {
        setIsLoading(true);
      }

      // Check if the current filters are different from the last fetched filters
      const filtersChanged = JSON.stringify(filters) !== JSON.stringify(lastFetchedFilters);

      if (filtersChanged || isInitialLoad) {
        await fetchListings(filters);
      }

      setIsLoading(false);
      setIsInitialLoad(false);
    };

    loadListings();
  }, [fetchListings, filters, lastFetchedFilters, isInitialLoad]);

  // Effect for updating the URL with active filters
  useEffect(() => {
    const nonEmptyFilters = getNonEmptyFilters(filters);
    const searchParams = new URLSearchParams(nonEmptyFilters);
    navigate(`?${searchParams.toString()}`, { replace: true });

    if (Object.keys(nonEmptyFilters).length > 0) {
      sessionStorage.setItem("defaultFilters", JSON.stringify(nonEmptyFilters));
    } else {
      sessionStorage.removeItem("defaultFilters");
    }
  }, [filters, navigate]);

  // Effect to sync search term with filters
  useEffect(() => {
    if (searchTerm !== filters.search) {
      setFilters((prevFilters) => {
        // Only update if the search term has actually changed
        if (prevFilters.search !== searchTerm) {
          return { ...prevFilters, search: searchTerm };
        }
        return prevFilters;
      });
    }
  }, [searchTerm]);

  // Handle changes to filters
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setShowFilterModal(false);
    setIsLoading(true);
  }, []);

  // Handle removing a filter
  const handleFilterRemove = useCallback(
    (filterKey) => {
      setFilters((prevFilters) => {
        const newFilters = { ...prevFilters };
        delete newFilters[filterKey];

        // If the removed filter is 'category', also remove 'subcategory'
        if (filterKey === "category") {
          delete newFilters["subcategory"];
        }

        return newFilters;
      });
      if (filterKey === "search") {
        handleSearch("");
      }
      setIsLoading(true);
    },
    [handleSearch]
  );

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({});
    sessionStorage.removeItem("defaultFilters");
    navigate("/", { replace: true });
    handleSearch("");
    setIsLoading(true);
  }, [navigate, handleSearch]);

  // Toggle filter modal visibility
  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
  };

  // Memoize the listings to prevent unnecessary re-renders
  const memoizedListings = useMemo(() => {
    return listings && listings.length > 0
      ? listings.filter((listing) => listing.status === "active").map((listing) => <ListingCard key={listing.id} listing={listing} />)
      : null;
  }, [listings]);

  // Display error message if there are issues with listings
  if (error.listings) return <div className="text-center text-red-500">{error.listings}</div>;

  // Check if there are active filters
  const hasActiveFilters = Object.keys(filters).some((key) => filters[key] !== "");

  return (
    <div className="min-h-screen bg-gray-100">
      <HeroSection onSearch={handleSearch} currentSearchTerm={filters.search || ""} />
      <div className="container px-4 py-8 mx-auto">
        <div className="flex flex-col items-center justify-between mb-6 md:flex-row">
          <h2 className="mb-4 text-3xl font-bold text-gray-900 md:mb-0">
            {filters.search ? `Search Results for "${filters.search}"` : "Latest Listings"}
          </h2>
          <div className="flex space-x-2">
            <button
              onClick={toggleFilterModal}
              className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-800 transition duration-150 ease-in-out bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            >
              <FunnelIcon className="w-4 h-4 mr-1" />
              Filters
            </button>
            {hasActiveFilters && (
              <button
                onClick={resetFilters}
                className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-800 transition duration-150 ease-in-out bg-gray-200 rounded-full hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                <XMarkIcon className="w-4 h-4 mr-1" />
                Clear
              </button>
            )}
          </div>
        </div>

        <ActiveFilters filters={filters} onFilterRemove={handleFilterRemove} />

        {isLoading || isInitialLoad ? (
          <SkeletonLoader count={8} />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {memoizedListings || <div className="py-12 text-center text-gray-500 col-span-full">No listings found.</div>}
          </div>
        )}
      </div>

      <Modal isOpen={showFilterModal} onClose={toggleFilterModal} title="Advanced Filters">
        <Filter onFilterChange={handleFilterChange} initialFilters={filters} onToggleFilter={toggleFilterModal} />
      </Modal>
    </div>
  );
}

export default Home;
