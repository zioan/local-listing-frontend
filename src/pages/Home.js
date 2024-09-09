import React, { useState, useCallback } from "react";
import { useData } from "../context/DataContext";
import HeroSection from "../components/home/HeroSection";
import ListingCard from "../components/listings/ListingCard";
import Filter from "../components/home/Filter";
import InfiniteScroll from "../components/shared/InfiniteScroll";

function Home() {
  const { state, loading, error, fetchListings, hasMore } = useData();
  const [filters, setFilters] = useState({});
  const [showFilter, setShowFilter] = useState(false);

  const handleFilterChange = useCallback(
    (newFilters) => {
      setFilters(newFilters);
      fetchListings(true, newFilters); // Reset and fetch with new filters
    },
    [fetchListings]
  );

  const loadMore = useCallback(() => {
    fetchListings(false, filters);
  }, [fetchListings, filters]);

  const toggleFilter = () => {
    setShowFilter(!showFilter);
  };

  if (error.listings) return <div className="text-center text-red-500">{error.listings}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <HeroSection />
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Latest Listings</h2>
          <button
            onClick={toggleFilter}
            className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            {showFilter ? "Hide Filters" : "Show Filters"}
          </button>
        </div>

        {showFilter && (
          <div className="mb-6">
            <Filter onFilterChange={handleFilterChange} onToggleFilter={toggleFilter} />
          </div>
        )}

        <InfiniteScroll loadMore={loadMore} hasMore={hasMore} loading={loading.listings}>
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
            {state.listings && state.listings.length > 0 && state.listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default Home;
