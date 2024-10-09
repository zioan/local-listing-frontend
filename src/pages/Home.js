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
  const { listings, error, fetchListings } = useData();
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
        await fetchListings();
        setIsLoading(false);
        setIsInitialLoad(false);
      }
    };
    loadListings();
  }, [fetchListings, isInitialLoad]);

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
      setFilters((prevFilters) => ({ ...prevFilters, search: searchTerm }));
    }
  }, [searchTerm]);

  // Handle changes to filters
  const handleFilterChange = useCallback((newFilters) => {
    setFilters((prevFilters) => {
      const updatedFilters = { ...prevFilters, ...newFilters };
      // If category changes, remove subcategory
      if (newFilters.category && newFilters.category !== prevFilters.category) {
        delete updatedFilters.subcategory;
      }
      return updatedFilters;
    });
    setShowFilterModal(false);
  }, []);

  // Handle removing a filter
  const handleFilterRemove = useCallback(
    (filterKey) => {
      setFilters((prevFilters) => {
        const newFilters = { ...prevFilters };
        delete newFilters[filterKey];
        // If removing category, also remove subcategory
        if (filterKey === "category") {
          delete newFilters.subcategory;
        }
        return newFilters;
      });
      if (filterKey === "search") {
        handleSearch("");
      }
    },
    [handleSearch]
  );

  // Reset all filters
  const resetFilters = useCallback(() => {
    setFilters({});
    sessionStorage.removeItem("defaultFilters");
    navigate("/", { replace: true });
    handleSearch("");
  }, [navigate, handleSearch]);

  // Toggle filter modal visibility
  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
  };

  // Memoized filtered listings based on active filters
  const filteredListings = useMemo(() => {
    return listings.filter((listing) => {
      if (listing.status !== "active") return false;

      for (const [key, value] of Object.entries(filters)) {
        if (value && value.trim() !== "") {
          switch (key) {
            case "search":
              if (!listing.title.toLowerCase().includes(value.toLowerCase()) && !listing.description.toLowerCase().includes(value.toLowerCase())) {
                return false;
              }
              break;
            case "category":
              if (listing.category.toString() !== value.toString()) return false;
              break;
            case "subcategory":
              if (listing.subcategory.toString() !== value.toString()) return false;
              break;
            case "min_price":
              if (parseFloat(listing.price) < parseFloat(value)) return false;
              break;
            case "max_price":
              if (parseFloat(listing.price) > parseFloat(value)) return false;
              break;
            case "listing_type":
              if (listing.listing_type !== value) return false;
              break;
            case "condition":
              if (listing.condition !== value) return false;
              break;
            case "delivery_option":
              if (listing.delivery_option !== value) return false;
              break;
            case "location":
              if (!listing.location.toLowerCase().includes(value.toLowerCase())) return false;
              break;
            default:
              if (listing[key] !== value) return false;
          }
        }
      }
      return true;
    });
  }, [listings, filters]);

  const memoizedListings = useMemo(() => {
    return filteredListings.map((listing) => <ListingCard key={listing.id} listing={listing} />);
  }, [filteredListings]);

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

        {isLoading ? (
          <SkeletonLoader count={8} />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {memoizedListings.length > 0 ? memoizedListings : <div className="py-12 text-center text-gray-500 col-span-full">No listings found.</div>}
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
