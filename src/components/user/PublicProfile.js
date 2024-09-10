import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { formatDate } from "../../util/listingHelpers";
import ListingCard from "../listings/ListingCard";
import LoadingSpinner from "../shared/LoadingSpinner";
import { UserIcon, MapPinIcon, CalendarIcon, TagIcon, StarIcon } from "@heroicons/react/24/outline";

function PublicProfile() {
  const { username } = useParams();
  const { fetchPublicProfile, fetchUserListings, state, loading, error } = useData();
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);

  useEffect(() => {
    const loadProfile = async () => {
      const profileData = await fetchPublicProfile(username);
      setProfile(profileData);
      const userListings = await fetchUserListings(username);
      setListings(userListings);
    };
    loadProfile();
  }, [username, fetchPublicProfile, fetchUserListings]);

  if (loading.profile) return <LoadingSpinner isLoading={loading.profile} />;
  if (loading.userListings) return <LoadingSpinner isLoading={loading.userListings} />;
  if (error.profile) return <div className="text-red-500">{error.profile}</div>;
  if (!profile) return null;

  const displayRating = (rating) => {
    if (typeof rating === "number") {
      return rating.toFixed(1);
    }
    return "N/A";
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900">{profile.username}'s Profile</h3>
        </div>
        <div className="px-4 py-5 border-t border-gray-200 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="flex items-center text-sm font-medium text-gray-500">
                <UserIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                Username
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile.username}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="flex items-center text-sm font-medium text-gray-500">
                <MapPinIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                Location
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile.location || "Not specified"}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="flex items-center text-sm font-medium text-gray-500">
                <CalendarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                Member Since
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{formatDate(profile.date_joined)}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="flex items-center text-sm font-medium text-gray-500">
                <TagIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                Total Listings
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile.total_listings}</dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="flex items-center text-sm font-medium text-gray-500">
                <StarIcon className="flex-shrink-0 mr-1.5 h-5 w-5 text-gray-400" />
                Rating
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {displayRating(profile.rating)} ({profile.num_ratings} ratings)
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Bio</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile.bio || "No bio provided"}</dd>
            </div>
          </dl>
        </div>
      </div>

      <h4 className="mt-8 mb-4 text-2xl font-bold">Active Listings</h4>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}

export default PublicProfile;
