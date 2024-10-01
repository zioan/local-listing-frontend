import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { formatDate } from "../../util/listingHelpers";
import ListingCard from "../listings/ListingCard";
import LoadingSpinner from "../shared/LoadingSpinner";
import { UserIcon, MapPinIcon, CalendarIcon, TagIcon, StarIcon } from "@heroicons/react/24/outline";
import ReviewForm from "../reviews/ReviewForm";
import ReviewList from "../reviews/ReviewList";
import { toast } from "react-toastify";

/**
 * PublicProfile component displays a user's public profile, including their
 * personal information, listings, and reviews.
 *
 * @returns {JSX.Element} The PublicProfile component.
 */
function PublicProfile() {
  const { username } = useParams();
  const { fetchPublicProfile, fetchUserListings, loading, error } = useData();
  const [profile, setProfile] = useState(null);
  const [listings, setListings] = useState([]);

  // Effect to load profile and listings data when the component mounts
  useEffect(() => {
    const loadProfile = async () => {
      try {
        const profileData = await fetchPublicProfile(username);
        setProfile(profileData);
        const userListings = await fetchUserListings(username);
        setListings(userListings);
      } catch (error) {
        toast.error("An error occurred while loading the profile");
      }
    };
    loadProfile();
  }, [username, fetchPublicProfile, fetchUserListings]);

  // Handle new review submission
  const handleReviewSubmitted = (newReview) => {
    setProfile((prevProfile) => {
      const updatedReviews = prevProfile.reviews.some((review) => review.id === newReview.id)
        ? prevProfile.reviews.map((review) => (review.id === newReview.id ? newReview : review))
        : [...prevProfile.reviews, newReview];

      return {
        ...prevProfile,
        reviews: updatedReviews,
        average_rating: calculateNewAverageRating(prevProfile, newReview),
      };
    });
  };

  // Handle review deletion
  const handleReviewDeleted = (deletedReviewId) => {
    setProfile((prevProfile) => {
      const updatedReviews = prevProfile.reviews.filter((review) => review.id !== deletedReviewId);
      return {
        ...prevProfile,
        reviews: updatedReviews,
        average_rating: calculateAverageRating(updatedReviews),
      };
    });
  };

  // Calculate new average rating after a review is submitted
  const calculateNewAverageRating = (profile, newReview) => {
    const oldReview = profile.reviews.find((review) => review.id === newReview.id);
    const totalRating = profile.average_rating * profile.reviews.length;
    const newTotalRating = oldReview ? totalRating - oldReview.rating + newReview.rating : totalRating + newReview.rating;
    const newCount = oldReview ? profile.reviews.length : profile.reviews.length + 1;
    return newTotalRating / newCount;
  };

  // Calculate average rating from reviews
  const calculateAverageRating = (reviews) => {
    if (reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };

  // Get reviews count text
  const getReviewsCountText = (reviews) => {
    const count = reviews.length;
    if (count === 0) return "no reviews";
    if (count === 1) return "1 review";
    return `${count} reviews`;
  };

  // Loading and error handling
  if (loading.profile) return <LoadingSpinner isLoading={loading.profile} />;
  if (loading.userListings) return <LoadingSpinner isLoading={loading.userListings} />;
  if (error.profile) return <div className="text-red-500">{error.profile}</div>;
  if (!profile) return null; // Return nothing if profile is not yet loaded

  return (
    <div className="container px-4 py-8 mx-auto">
      <h4 className="mt-8 mb-4 text-2xl font-bold">{profile.username}'s profile</h4>
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 border-t border-gray-200 sm:p-0">
          <dl className="sm:divide-y sm:divide-gray-200">
            {/* Display user profile information */}
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
                Average Rating
              </dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                {profile.average_rating ? profile.average_rating.toFixed(1) : "N/A"} ({getReviewsCountText(profile.reviews)})
              </dd>
            </div>
            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
              <dt className="text-sm font-medium text-gray-500">Bio</dt>
              <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{profile.bio || "No bio provided"}</dd>
            </div>
          </dl>
        </div>
      </div>

      {/* Review form and list */}
      {profile && profile.id && <ReviewForm userId={profile.id} onReviewSubmitted={handleReviewSubmitted} onReviewDeleted={handleReviewDeleted} />}
      <ReviewList reviews={profile.reviews} user={profile.username} />

      <h4 className="mt-8 mb-4 text-2xl font-bold">{profile.username}'s active listings</h4>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {listings.map((listing) => (
          <ListingCard key={listing.id} listing={listing} />
        ))}
      </div>
    </div>
  );
}

export default PublicProfile;
