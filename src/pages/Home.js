import React, { useState, useCallback, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useData } from "../context/DataContext";
import HeroSection from "../components/home/HeroSection";
import ListingCard from "../components/listings/ListingCard";
import Filter from "../components/home/Filter";
import InfiniteScroll from "../components/shared/InfiniteScroll";
import ActiveFilters from "../components/home/ActiveFilters";

function Home() {
  const { listings, loading, error, fetchListings, hasMore } = useData();
  const location = useLocation();
  const navigate = useNavigate();

  const [filters, setFilters] = useState(() => {
    // Get filters from URL parameters
    const searchParams = new URLSearchParams(location.search);
    const filtersFromUrl = {};
    for (let [key, value] of searchParams.entries()) {
      filtersFromUrl[key] = value;
    }

    // If URL parameters exist, use them
    if (Object.keys(filtersFromUrl).length > 0) {
      return filtersFromUrl;
    }

    // If no URL parameters, try to get filters from session storage
    const storedFilters = sessionStorage.getItem("defaultFilters");
    return storedFilters ? JSON.parse(storedFilters) : {};
  });

  const [showFilter, setShowFilter] = useState(false);
  const [shouldFetchListings, setShouldFetchListings] = useState(true);

  useEffect(() => {
    const searchParams = new URLSearchParams(filters);
    navigate(`?${searchParams.toString()}`, { replace: true });

    sessionStorage.setItem("defaultFilters", JSON.stringify(filters));

    setShouldFetchListings(true);
  }, [filters, navigate]);

  useEffect(() => {
    if (shouldFetchListings) {
      fetchListings(true, filters);
      setShouldFetchListings(false);
    }
  }, [shouldFetchListings, fetchListings, filters]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
  }, []);

  const handleFilterRemove = useCallback((filterKey) => {
    setFilters((prevFilters) => {
      const newFilters = { ...prevFilters };
      delete newFilters[filterKey];
      return newFilters;
    });
  }, []);

  const handleSearch = useCallback((searchTerm) => {
    setFilters((prevFilters) => ({ ...prevFilters, search: searchTerm }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters({});
    sessionStorage.removeItem("defaultFilters");
    navigate("/", { replace: true });
  }, [navigate]);

  const loadMore = useCallback(() => {
    if (!loading.listings) {
      fetchListings(false, filters);
    }
  }, [fetchListings, filters, loading.listings]);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  if (error.listings) return <div className="text-center text-red-500">{error.listings}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <HeroSection onSearch={handleSearch} currentSearchTerm={filters.search || ""} />
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">{filters.search ? `Search Results for "${filters.search}"` : "Latest Listings"}</h2>
          <div className="flex space-x-4">
            <button
              onClick={toggleFilter}
              className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {showFilter ? "Hide Filters" : "Show Filters"}
            </button>
            <button
              onClick={resetFilters}
              className="px-4 py-2 text-sm font-medium text-indigo-600 bg-white border border-indigo-600 rounded-md hover:bg-indigo-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Reset Filters
            </button>
          </div>
        </div>
        {showFilter && (
          <div className="mb-6">
            <Filter onFilterChange={handleFilterChange} initialFilters={filters} onToggleFilter={toggleFilter} />
          </div>
        )}
        <ActiveFilters filters={filters} onFilterRemove={handleFilterRemove} />
        <InfiniteScroll loadMore={loadMore} hasMore={hasMore} loading={loading.listings}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {listings && listings.length > 0 ? (
              listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)
            ) : (
              <div className="text-center text-gray-500 col-span-full">No listings found.</div>
            )}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default Home;
