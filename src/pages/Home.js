import React, { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import { useSearch } from "../context/SearchContext";
import HeroSection from "../components/home/HeroSection";
import ListingCard from "../components/listings/ListingCard";
import Filter from "../components/home/Filter";
import ActiveFilters from "../components/home/ActiveFilters";
import SkeletonLoader from "../components/shared/SkeletonLoader";
import Modal from "../components/shared/Modal";
import { FunnelIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { toast } from "react-toastify";

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
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState(initializeFilters());
  const [showFilterModal, setShowFilterModal] = useState(false);

  // Function to initialize filters from URL parameters or session storage
  function initializeFilters() {
    const searchParams = new URLSearchParams(location.search);
    const filtersFromUrl = Object.fromEntries(searchParams);
    const storedFilters = JSON.parse(sessionStorage.getItem("defaultFilters") || "{}");

    // Prioritize stored filters, but use URL params if stored filters are empty
    return Object.keys(storedFilters).length > 0 ? storedFilters : getNonEmptyFilters(filtersFromUrl);
  }

  // Effect for fetching listings when filters change
  useEffect(() => {
    const loadListings = async () => {
      setIsLoading(true);
      try {
        await fetchListings(filters);
      } catch (error) {
        toast.error(error, {
          toastId: `error-${error}`, // Prevent duplicate toasts
        });
      } finally {
        setIsLoading(false);
      }
    };
    loadListings();
  }, [fetchListings, filters]);

  // Effect for updating the URL with active filters
  useEffect(() => {
    const searchParams = new URLSearchParams(getNonEmptyFilters(filters));
    navigate(`?${searchParams.toString()}`, { replace: true });
  }, [filters, navigate]);

  // Effect to sync search term with filters
  useEffect(() => {
    if (searchTerm !== filters.search) {
      setFilters((prevFilters) => ({ ...prevFilters, search: searchTerm }));
    }
  }, [searchTerm]);

  // Handle changes to filters
  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setShowFilterModal(false);
    // Only update sessionStorage when filters are changed via UI
    sessionStorage.setItem("defaultFilters", JSON.stringify(getNonEmptyFilters(newFilters)));
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

        // Update sessionStorage when a filter is removed
        sessionStorage.setItem("defaultFilters", JSON.stringify(getNonEmptyFilters(newFilters)));
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

        {isLoading ? (
          <SkeletonLoader count={8} />
        ) : (
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {listings && listings.length > 0 ? (
              listings.map((listing) => listing.status === "active" && <ListingCard key={listing.id} listing={listing} />)
            ) : (
              <div className="py-12 text-center text-gray-500 col-span-full">No listings found.</div>
            )}
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
