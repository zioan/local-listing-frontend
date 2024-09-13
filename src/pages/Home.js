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
  const [filters, setFilters] = useState(() => {
    const savedFilters = localStorage.getItem("activeFilters");
    return savedFilters ? JSON.parse(savedFilters) : {};
  });
  const [showFilter, setShowFilter] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [shouldFetchListings, setShouldFetchListings] = useState(true);

  useEffect(() => {
    localStorage.setItem("activeFilters", JSON.stringify(filters));
  }, [filters]);

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const searchTerm = searchParams.get("search");

    if (searchTerm !== filters.search) {
      setFilters((prevFilters) => ({ ...prevFilters, search: searchTerm || "" }));
      setShouldFetchListings(true);
    }
  }, [location.search]);

  useEffect(() => {
    if (shouldFetchListings) {
      fetchListings(true, filters);
      setShouldFetchListings(false);
    }
  }, [shouldFetchListings, fetchListings, filters]);

  const handleFilterChange = useCallback((newFilters) => {
    setFilters(newFilters);
    setShouldFetchListings(true);
  }, []);

  const handleFilterRemove = useCallback(
    (filterKey) => {
      const newFilters = { ...filters };
      delete newFilters[filterKey];
      setFilters(newFilters);
      setShouldFetchListings(true);
      if (filterKey === "search") {
        navigate("/");
      }
    },
    [filters, navigate]
  );

  const handleSearch = useCallback(
    (searchTerm) => {
      setFilters((prevFilters) => ({ ...prevFilters, search: searchTerm }));
      setShouldFetchListings(true);
      navigate(`/?search=${encodeURIComponent(searchTerm)}`);
    },
    [navigate]
  );

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
          <button
            onClick={toggleFilter}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {showFilter ? "Hide Filters" : "Show Filters"}
          </button>
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
