import React from "react";
import { useData } from "../context/DataContext";
import HeroSection from "../components/home/HeroSection";
import ListingCard from "../components/listings/ListingCard";
import CategoryFilter from "../components/home/CategoryFilter";
import InfiniteScroll from "../components/shared/InfiniteScroll";

function Home() {
  const { state, loading, error, fetchListings, hasMore } = useData();

  if (error.listings) return <div className="text-center text-red-500">{error.listings}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <HeroSection />
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Latest Listings</h2>
        <CategoryFilter />
        <InfiniteScroll loadMore={() => fetchListings()} hasMore={hasMore} loading={loading.listings}>
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {state.listings && state.listings.length > 0 && state.listings.map((listing) => <ListingCard key={listing.id} listing={listing} />)}
          </div>
        </InfiniteScroll>
      </div>
    </div>
  );
}

export default Home;
