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

function Home() {
  const { listings, error, fetchListings, lastFetchedFilters } = useData();
  const { searchTerm, handleSearch } = useSearch();
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [filters, setFilters] = useState(initializeFilters());
  const [showFilterModal, setShowFilterModal] = useState(false);

  function initializeFilters() {
    const searchParams = new URLSearchParams(location.search);
    const filtersFromUrl = Object.fromEntries(searchParams);

    if (Object.keys(filtersFromUrl).length > 0) {
      return {
        listing_type: filtersFromUrl.listing_type || "",
        category: filtersFromUrl.category || "",
        subcategory: filtersFromUrl.subcategory || "",
        min_price: filtersFromUrl.min_price || "",
        max_price: filtersFromUrl.max_price || "",
        condition: filtersFromUrl.condition || "",
        delivery_option: filtersFromUrl.delivery_option || "",
        location: filtersFromUrl.location || "",
        start_date: filtersFromUrl.start_date || "",
        end_date: filtersFromUrl.end_date || "",
        search: filtersFromUrl.search || "",
      };
    }

    const storedFilters = sessionStorage.getItem("defaultFilters");

    return storedFilters
      ? JSON.parse(storedFilters)
      : {
          listing_type: "",
          category: "",
          subcategory: "",
          min_price: "",
          max_price: "",
          condition: "",
          delivery_option: "",
          location: "",
          start_date: "",
          end_date: "",
          search: "",
        };
  }

  useEffect(() => {
    const loadListings = async () => {
      setIsLoading(true);

      // Check if the current filters are different from the last fetched filters
      const filtersChanged = JSON.stringify(filters) !== JSON.stringify(lastFetchedFilters);

      if (filtersChanged) {
        await fetchListings(filters);
      }

      setIsLoading(false);
    };
    loadListings();
  }, [fetchListings, filters, lastFetchedFilters]);

  useEffect(() => {
    const searchParams = new URLSearchParams(filters);
    navigate(`?${searchParams.toString()}`, { replace: true });

    // Store only non-empty filters in session storage
    const nonEmptyFilters = Object.entries(filters).reduce((acc, [key, value]) => {
      if (value !== "") {
        acc[key] = value;
      }
      return acc;
    }, {});

    sessionStorage.setItem("defaultFilters", JSON.stringify(nonEmptyFilters));
  }, [filters, navigate]);

  useEffect(() => {
    if (searchTerm !== filters.search) {
      setFilters((prevFilters) => ({ ...prevFilters, search: searchTerm }));
    }
  }, [searchTerm]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setShowFilterModal(false);
  }, []);

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
    },
    [handleSearch]
  );

  const resetFilters = useCallback(() => {
    setFilters({});
    sessionStorage.removeItem("defaultFilters");
    navigate("/", { replace: true });
    handleSearch("");
  }, [navigate, handleSearch]);

  const toggleFilterModal = () => {
    setShowFilterModal(!showFilterModal);
  };

  if (error.listings) return <div className="text-center text-red-500">{error.listings}</div>;

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
