import React, { useEffect } from "react";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "../shared/LoadingSpinner";
import ListingCard from "../listings/ListingCard";

const MyListings = () => {
  const { state, loading, error, fetchMyListings } = useData();
  const { user } = useAuth();

  useEffect(() => {
    if (user && state.myListings.length === 0) {
      fetchMyListings();
    }
  }, [user, fetchMyListings, state.myListings.length]);

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
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
