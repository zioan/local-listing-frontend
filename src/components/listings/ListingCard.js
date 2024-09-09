import React from "react";
import { Link } from "react-router-dom";
import {
  MapPinIcon,
  ClockIcon,
  TagIcon,
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
import { getCloudinaryImageUrl } from "../../lib/cloudinaryUtil";
import FavoriteButton from "./FavoriteButton";
import { formatDate } from "../../util/listingHelpers";

function ListingCard({ listing }) {
  const formatListingType = (type) => {
    return type
      .split("_")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  const renderPrice = () => {
    if (listing.price_type === "free") return "Free";
    if (listing.price_type === "contact") return "Contact for price";
    return `$${listing.price}`;
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

  const getBackgroundColor = (type) => {
    switch (type) {
      case "item_sale":
        return "bg-blue-100";
      case "item_free":
        return "bg-green-100";
      case "item_wanted":
        return "bg-yellow-100";
      case "service":
        return "bg-purple-100";
      case "job":
        return "bg-red-100";
      case "housing":
        return "bg-indigo-100";
      case "event":
        return "bg-pink-100";
      default:
        return "bg-gray-100";
    }
  };

  return (
    <div
      className={`overflow-hidden transition duration-300 bg-white rounded-lg shadow-md hover:shadow-xl ${getBackgroundColor(listing.listing_type)}`}
    >
      <div className="relative">
        <Link to={`/listings/${listing.id}`} className="block">
          <div className="aspect-w-16 aspect-h-9">
            {listing.images && listing.images.length > 0 ? (
              <img src={getCloudinaryImageUrl(listing.images[0].image)} alt={listing.title} className="object-cover w-full h-full" />
            ) : (
              <div className="flex items-center justify-center w-full h-full bg-gray-200">
                <span className="text-gray-400">No image</span>
              </div>
            )}
          </div>
        </Link>
        <div className="absolute p-2 bg-white bg-opacity-75 rounded-full top-2 left-2">{getListingTypeIcon(listing.listing_type)}</div>
        <div className="absolute top-2 right-2">
          <FavoriteButton listing={listing} />
        </div>
      </div>
      <div className="p-4">
        <Link to={`/listings/${listing.id}`} className="text-lg font-medium text-gray-900 hover:text-blue-600">
          {listing.title}
        </Link>
        <div className="flex items-center mt-1 text-sm text-gray-500">
          <TagIcon className="flex-shrink-0 w-4 h-4 mr-1.5 text-gray-400" />
          <span>{formatListingType(listing.listing_type)}</span>
        </div>
        <p className="mt-1 text-sm text-gray-500">
          {listing.category_name} {listing.subcategory_name && `> ${listing.subcategory_name}`}
        </p>
        <div className="flex items-center mt-2 text-lg font-semibold text-green-600">
          <CurrencyDollarIcon className="flex-shrink-0 w-5 h-5 mr-1 text-green-500" />
          {renderPrice()}
          {listing.price_type === "negotiable" && <span className="ml-1 text-xs text-gray-500">(Negotiable)</span>}
        </div>
        {["item_sale", "item_free", "item_wanted"].includes(listing.listing_type) && (
          <p className="mt-1 text-sm text-gray-600">Condition: {listing.condition}</p>
        )}
        <div className="flex items-center mt-2 text-sm text-gray-500">
          <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
          <span>{listing.location || "Location N/A"}</span>
        </div>
        <div className="flex items-center mt-2 text-sm text-gray-500">
          <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
          <span>{formatDate(listing.created_at)}</span>
        </div>

        {listing.listing_type === "event" && listing.event_date && (
          <div className="flex items-center mt-2 text-sm text-blue-500">
            <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
            <span>Event Date: {formatDate(listing.event_date, true)}</span>
          </div>
        )}

        {listing.delivery_option && listing.delivery_option !== "na" && (
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <BuildingStorefrontIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
            {listing.delivery_option === "both" ? "Pickup or Delivery" : listing.delivery_option}
          </div>
        )}
        <div className="flex items-center justify-between mt-4">
          <Link
            to={`/listings/${listing.id}`}
            className="inline-flex items-center px-3 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
          >
            View details
          </Link>
          <div className="text-sm text-gray-500">
            Views: {listing.view_count} | Favorites: {listing.favorite_count}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ListingCard;
