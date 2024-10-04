import React from "react";
import { useData } from "../../context/DataContext";
import LoadingSpinner from "../shared/LoadingSpinner";
import ListingCard from "../listings/ListingCard";

/**
 * MyListings component displays the listings created by the user.
 *
 * It shows a loading spinner while fetching data, handles errors,
 * and renders the list of the user's listings or a message if no listings exist.
 *
 * @returns {JSX.Element} The MyListings component.
 */
const MyListings = () => {
  const { myListings, loading, error } = useData();

  // Show loading spinner if myListings are being fetched
  if (loading.myListings) return <LoadingSpinner isLoading={loading.myListings} />;

  // Show error message if there's an error fetching myListings
  if (error.myListings) return <div>Error: {error.myListings}</div>;

  return (
    <div className="container px-4 mx-auto my-10">
      <h2 className="mb-4 text-2xl font-bold">My Listings</h2>
      {myListings.length === 0 ? (
        <p>You haven't created any listings yet.</p>
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
          {myListings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyListings;
