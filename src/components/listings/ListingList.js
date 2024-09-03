import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../../config/api";
import { getCloudinaryImageUrl } from "../../lib/cloudinaryUtil";

const ListingList = () => {
  const [listings, setListings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchListings = async () => {
      try {
        const response = await api.get("listings/listings");
        setListings(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error details:", err.response || err);
        setError(`Error fetching listings: ${err.response?.data?.detail || err.message}`);
        setLoading(false);
      }
    };

    fetchListings();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
      {listings.map((listing) => (
        <Link
          key={listing.id}
          to={`/listings/${listing.id}`}
          className="overflow-hidden transition duration-300 bg-white rounded-lg shadow-md hover:shadow-lg"
        >
          {listing.images && listing.images.length > 0 && (
            <img src={getCloudinaryImageUrl(listing.images[0].image)} alt={listing.title} className="object-cover w-full h-48" />
          )}
          <div className="p-4">
            <h3 className="mb-2 text-xl font-semibold">{listing.title}</h3>
            <p className="text-gray-600">${listing.price}</p>
            <p className="mt-2 text-sm text-gray-500">{listing.category_name}</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default ListingList;
