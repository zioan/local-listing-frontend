import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { getCloudinaryImageUrl } from "../../lib/cloudinaryUtil";
import Modal from "../shared/Modal";
import ImageGallery from "../shared/ImageGallery";
import FavoriteButton from "./FavoriteButton";
import LoadingSpinner from "../shared/LoadingSpinner";
import {
  HeartIcon,
  MapPinIcon,
  ClockIcon,
  PencilIcon,
  TrashIcon,
  ChevronLeftIcon,
  ChevronRightIcon,
  TagIcon,
  UserIcon,
  CurrencyDollarIcon,
  ShoppingBagIcon,
  GiftIcon,
  HandRaisedIcon,
  BriefcaseIcon,
  HomeIcon,
  CalendarIcon,
  SparklesIcon,
  BuildingStorefrontIcon,
} from "@heroicons/react/24/outline";

function ListingDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state, fetchListing, loading, error, deleteListing, invalidateCache } = useData();
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isGalleryOpen, setIsGalleryOpen] = useState(false);

  useEffect(() => {
    if (!state.listingDetails[id]) {
      fetchListing(id);
    }
  }, [id, fetchListing, state.listingDetails]);

  const listing = state.listingDetails[id];

  const formatDate = (dateString, includeTime = false) => {
    const options = {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      ...(includeTime && {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      }),
    };
    return new Intl.DateTimeFormat("de-DE", options).format(new Date(dateString));
  };

  const formatListingType = (type) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const getListingTypeIcon = (type) => {
    switch (type) {
      case "item_sale":
        return <ShoppingBagIcon className="w-6 h-6" />;
      case "item_free":
        return <GiftIcon className="w-6 h-6" />;
      case "item_wanted":
        return <HandRaisedIcon className="w-6 h-6" />;
      case "service":
        return <SparklesIcon className="w-6 h-6" />;
      case "job":
        return <BriefcaseIcon className="w-6 h-6" />;
      case "housing":
        return <HomeIcon className="w-6 h-6" />;
      case "event":
        return <CalendarIcon className="w-6 h-6" />;
      default:
        return <TagIcon className="w-6 h-6" />;
    }
  };

  const renderPrice = () => {
    if (listing.price_type === "free") return "Free";
    if (listing.price_type === "contact") return "Contact for price";
    return (
      <span>
        ${listing.price}
        {listing.price_type === "negotiable" && <span className="ml-1 text-sm text-gray-500">(Negotiable)</span>}
      </span>
    );
  };

  const handleDelete = async () => {
    try {
      await deleteListing(id);
      invalidateCache("listings");
      invalidateCache("myListings");
      invalidateCache("favorites");
      navigate("/profile/listings");
    } catch (err) {
      console.error("Error deleting listing:", err);
      // Handle error
    }
  };

  if (loading[`listing-${id}`]) return <LoadingSpinner isLoading={loading[`listing-${id}`]} />;
  if (error[`listing-${id}`]) return <div>Error: {error[`listing-${id}`]}</div>;
  if (!listing) return null;

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <div className="flex items-center justify-between">
            <h1 className="text-3xl font-bold leading-tight text-gray-900">{listing.title}</h1>
            <div className="flex items-center space-x-2">
              {getListingTypeIcon(listing.listing_type)}
              <span className="text-lg font-semibold text-gray-600">{formatListingType(listing.listing_type)}</span>
            </div>
          </div>
          <p className="flex items-center max-w-2xl mt-1 text-sm text-gray-500">
            <TagIcon className="w-4 h-4 mr-1" />
            {listing.category_name} {listing.subcategory_name && `> ${listing.subcategory_name}`}
          </p>
        </div>
        <div className="px-4 py-5 border-t border-gray-200 sm:p-0">
          <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
            {/* Left column: Images */}
            <div className="lg:col-span-2 sm:px-6 sm:py-5">
              <div className="relative w-full" style={{ paddingBottom: "75%" }}>
                {listing.images && listing.images.length > 0 ? (
                  <>
                    <div className="absolute inset-0 flex items-center justify-center bg-gray-100 rounded-lg">
                      <img
                        src={getCloudinaryImageUrl(listing.images[currentImageIndex].image)}
                        alt={`Listing ${currentImageIndex + 1}`}
                        className="object-contain max-w-full max-h-full rounded-lg cursor-pointer"
                        onClick={() => {
                          setIsGalleryOpen(true);
                          setCurrentImageIndex(currentImageIndex);
                        }}
                      />
                    </div>
                    <div className="absolute inset-x-0 bottom-0 h-12 bg-gradient-to-t from-black to-transparent"></div>
                    <div className="absolute left-0 right-0 text-center text-white bottom-2">
                      {currentImageIndex + 1} / {listing.images.length}
                    </div>
                    {listing.images.length > 1 && (
                      <>
                        <button
                          className="absolute p-2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full left-2 top-1/2"
                          onClick={() => setCurrentImageIndex((prev) => (prev === 0 ? listing.images.length - 1 : prev - 1))}
                        >
                          <ChevronLeftIcon className="w-6 h-6 text-white" />
                        </button>
                        <button
                          className="absolute p-2 transform -translate-y-1/2 bg-black bg-opacity-50 rounded-full right-2 top-1/2"
                          onClick={() => setCurrentImageIndex((prev) => (prev === listing.images.length - 1 ? 0 : prev + 1))}
                        >
                          <ChevronRightIcon className="w-6 h-6 text-white" />
                        </button>
                      </>
                    )}
                  </>
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center bg-gray-200 rounded-lg">
                    <span className="text-gray-400">No image available</span>
                  </div>
                )}
              </div>
            </div>

            {/* Right column: Listing details */}
            <div className="sm:px-6 sm:py-5">
              <div className="space-y-6">
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-3xl font-bold text-green-600">
                      <CurrencyDollarIcon className="inline w-8 h-8 mr-1" />
                      {renderPrice()}
                    </span>
                    <FavoriteButton listing={listing} />
                  </div>
                </div>

                <div className="p-4 bg-gray-100 rounded-lg">
                  <h3 className="mb-2 text-lg font-semibold">Listing Details</h3>
                  <dl className="grid grid-cols-2 text-sm gap-x-4 gap-y-2">
                    {["item_sale", "item_free", "item_wanted"].includes(listing.listing_type) && (
                      <>
                        <div className="col-span-1 font-medium">Condition:</div>
                        <div className="col-span-1">{listing.condition}</div>
                      </>
                    )}
                    {listing.delivery_option && listing.delivery_option !== "na" && (
                      <>
                        <div className="col-span-1 font-medium">Delivery:</div>
                        <div className="col-span-1">{listing.delivery_option === "both" ? "Pickup or Delivery" : listing.delivery_option}</div>
                      </>
                    )}
                    {listing.listing_type === "event" && listing.event_date && (
                      <>
                        <div className="col-span-1 font-medium">Event Date:</div>
                        <div className="col-span-1">{formatDate(listing.event_date, true)}</div>
                      </>
                    )}
                  </dl>
                </div>

                <div className="space-y-2">
                  <div className="flex items-center">
                    <UserIcon className="w-5 h-5 mr-2 text-gray-400" />
                    <span>{listing.user}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPinIcon className="w-5 h-5 mr-2 text-gray-400" />
                    <span>{listing.location || "Location N/A"}</span>
                  </div>
                  <div className="flex items-center">
                    <ClockIcon className="w-5 h-5 mr-2 text-gray-400" />
                    <span>Posted on: {formatDate(listing.created_at)}</span>
                  </div>
                  {listing.listing_type === "event" && listing.event_date && (
                    <div className="flex items-center">
                      <CalendarIcon className="w-5 h-5 mr-2 text-gray-400" />
                      <span>Event Date: {formatDate(listing.event_date, true)}</span>
                    </div>
                  )}
                  {listing.listing_type === "event" && listing.event_date && (
                    <div className="flex items-center">
                      <BuildingStorefrontIcon className="w-5 h-5 mr-2 text-gray-400" />
                      Delivery: {listing.delivery_option === "both" ? "Pickup or Delivery" : listing.delivery_option}
                    </div>
                  )}
                </div>

                {user && user.username === listing.user && (
                  <div className="flex space-x-3">
                    <button
                      onClick={() => navigate(`/listings/${id}/edit`)}
                      className="inline-flex items-center justify-center flex-1 px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                      <PencilIcon className="w-5 h-5 mr-2" />
                      Edit
                    </button>
                    <button
                      onClick={() => setIsDeleteModalOpen(true)}
                      className="inline-flex items-center justify-center flex-1 px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                    >
                      <TrashIcon className="w-5 h-5 mr-2" />
                      Delete
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Full width section for description */}
          <div className="px-6 py-5 mt-6 border-t border-gray-200">
            <h3 className="text-lg font-semibold">Description</h3>
            <p className="mt-2 text-gray-600 whitespace-pre-wrap">{listing.description}</p>
          </div>

          {/* Statistics */}
          <div className="flex justify-between px-6 py-3 mt-6 text-sm text-gray-500 border-t border-gray-200">
            <div className="flex items-center">
              <HeartIcon className="w-5 h-5 mr-2 text-gray-400" />
              <span>{listing.favorite_count} favorites</span>
            </div>
            <div className="flex items-center">
              <svg className="w-5 h-5 mr-2 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                />
              </svg>
              <span>{listing.view_count} views</span>
            </div>
          </div>
        </div>
      </div>

      <Modal isOpen={isDeleteModalOpen} onClose={() => setIsDeleteModalOpen(false)} title="Confirm Deletion" size="sm">
        <p className="mb-4">Are you sure you want to delete this listing? This action cannot be undone.</p>
        <div className="flex justify-end space-x-3">
          <button
            onClick={() => setIsDeleteModalOpen(false)}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Cancel
          </button>
          <button
            onClick={handleDelete}
            className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
          >
            Delete
          </button>
        </div>
      </Modal>

      {isGalleryOpen && (
        <ImageGallery
          images={listing.images.map((img) => getCloudinaryImageUrl(img.image))}
          onClose={() => setIsGalleryOpen(false)}
          startIndex={currentImageIndex}
        />
      )}
    </div>
  );
}

export default ListingDetail;
