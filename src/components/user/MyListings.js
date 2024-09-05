import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { getCloudinaryImageUrl } from "../../lib/cloudinaryUtil";
import LoadingSpinner from "../shared/LoadingSpinner";

const MyListings = () => {
  const { state, loading, error } = useData();
  const { user } = useAuth();

  useEffect(() => {
    if (!user) {
      return null;
    }
  }, [user]);

  if (loading.myListings) return <LoadingSpinner isLoading={loading.myListings} />;
  if (error.myListings) return <div>Error: {error.myListings}</div>;

  return (
    <div className="container px-4 mx-auto">
      <h2 className="mb-4 text-2xl font-bold">My Listings</h2>
      {state.myListings.length === 0 ? (
        <p>You haven't created any listings yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {state.myListings.map((listing) => (
            <div key={listing.id} className="overflow-hidden border rounded-lg shadow-lg">
              {listing.images && listing.images.length > 0 && (
                <img src={getCloudinaryImageUrl(listing.images[0].image)} alt={listing.title} className="object-cover w-full h-48" />
              )}
              <div className="p-4">
                <h3 className="mb-2 text-xl font-semibold">{listing.title}</h3>
                <p className="mb-2 text-gray-600">${listing.price}</p>
                <p className="mb-4 text-sm text-gray-500">{listing.created_at}</p>
                <Link to={`/listings/${listing.id}`} className="px-4 py-2 font-bold text-white bg-blue-500 rounded hover:bg-blue-700">
                  View Details
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
