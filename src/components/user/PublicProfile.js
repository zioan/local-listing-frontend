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
  const { fetchPublicProfile, fetchUserListings, fetchUserReviews } = useData();
  const [profileData, setProfileData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Effect to load profile, reviews, and listings data when the component mounts
  useEffect(() => {
    const loadProfileData = async () => {
      setIsLoading(true);
      try {
        const profile = await fetchPublicProfile(username);
        if (profile && profile.id) {
          const [listings, reviews] = await Promise.all([fetchUserListings(username), fetchUserReviews(profile.id)]);

          const initialAverageRating = calculateAverageRating(reviews);

          setProfileData({
            ...profile,
            listings,
            reviews,
            average_rating: initialAverageRating,
          });
        } else {
          throw new Error("Failed to fetch profile data");
        }
      } catch (error) {
        toast.error("An error occurred while loading the profile");
      } finally {
        setIsLoading(false);
      }
    };

    loadProfileData();
  }, [username, fetchPublicProfile, fetchUserListings, fetchUserReviews]);

  // Handle new review submission
  const handleReviewSubmitted = (newReview) => {
    setProfileData((prevData) => {
      const updatedReviews = prevData.reviews.some((review) => review.id === newReview.id)
        ? prevData.reviews.map((review) => (review.id === newReview.id ? newReview : review))
        : [...prevData.reviews, newReview];

      const newAverageRating = calculateNewAverageRating(prevData, newReview);

      return {
        ...prevData,
        reviews: updatedReviews,
        average_rating: newAverageRating,
      };
    });
  };

  // Handle review deletion
  const handleReviewDeleted = (deletedReviewId) => {
    setProfileData((prevData) => {
      const updatedReviews = prevData.reviews.filter((review) => review.id !== deletedReviewId);
      const newAverageRating = calculateAverageRating(updatedReviews);
      return {
        ...prevData,
        reviews: updatedReviews,
        average_rating: newAverageRating,
      };
    });
  };

  // Calculate new average rating after a review is submitted
  const calculateNewAverageRating = (profile, newReview) => {
    const currentReviews = profile.reviews || [];
    const oldReview = currentReviews.find((review) => review.id === newReview.id);
    const totalRating = (profile.average_rating || 0) * currentReviews.length;
    const newTotalRating = oldReview ? totalRating - oldReview.rating + newReview.rating : totalRating + newReview.rating;
    const newCount = oldReview ? currentReviews.length : currentReviews.length + 1;
    return newTotalRating / newCount || 0; // Avoid division by zero
  };

  // Calculate average rating from reviews
  const calculateAverageRating = (reviews) => {
    if (!reviews || reviews.length === 0) return 0;
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    return totalRating / reviews.length;
  };

  // Get reviews count text
  const getReviewsCountText = (reviews) => {
    if (!reviews) return "no reviews";
    const count = reviews.length;
    if (count === 0) return "no reviews";
    if (count === 1) return "1 review";
    return `${count} reviews`;
  };

  if (isLoading) return <LoadingSpinner isLoading={isLoading} />;

  if (!profileData) return null;

  const { listings = [], reviews = [], ...profile } = profileData || {};

  return (
    <div className="container px-4 py-8 mx-auto">
      {/* Profile information */}
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
                {profile.average_rating > 0 ? profile.average_rating.toFixed(1) : "N/A"} ({getReviewsCountText(reviews)})
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
      <ReviewList reviews={reviews} user={profile.username} />

      {/* User's listings */}
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
