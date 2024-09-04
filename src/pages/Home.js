import React, { useState, useEffect } from "react";
import api from "../config/api";
import HeroSection from "../components/home/HeroSection";
import ListingCard from "../components/listings/ListingCard";
import CategoryFilter from "../components/home/CategoryFilter";

function Home() {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await api.get("listings/listings", {
          params: { category: selectedCategory },
        });
        setListings(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error details:", err.response || err);
        setError(`Error fetching listings: ${err.response?.data?.detail || err.message}`);
        setLoading(false);
      }
    };
    fetchListings();
  }, [selectedCategory]);

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  if (loading) return <div className="py-10 text-center">Loading...</div>;
  if (error) return <div className="py-10 text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100">
      <HeroSection />
      <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <h2 className="mb-6 text-2xl font-bold text-gray-900">Latest Listings</h2>
        <CategoryFilter onCategoryChange={handleCategoryChange} />
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      </div>
    </div>
  );
}

export default Home;
