import React from "react";
import { useNavigate } from "react-router-dom";
import { formatDate, listingTypeOptions, conditionOptions, deliveryOptions } from "../../util/listingHelpers";
import { getCloudinaryImageUrl } from "../../lib/cloudinaryUtil";
import FavoriteButton from "./FavoriteButton";
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
  EyeIcon,
  HeartIcon,
} from "@heroicons/react/24/outline";

function ListingCard({ listing }) {
  const navigate = useNavigate();

  const handleCardClick = () => {
    navigate(`/listings/${listing.id}`);
  };

  const getListingTypeLabel = (type) => {
    return listingTypeOptions.find((option) => option.value === type)?.label || type;
  };

  const renderPrice = () => {
    if (listing.price_type === "free") return "Free";
    if (listing.price_type === "contact") return "Contact for price";
    if (listing.price_type === "na") return "Not Applicable";
    return listing.price ? `$${listing.price}` : "";
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

  const shouldShowCondition = ["item_sale", "item_free", "item_wanted"].includes(listing.listing_type);
  const conditionLabel = conditionOptions.find((option) => option.value === listing.condition)?.label || listing.condition;

  return (
    <div
      className="relative flex flex-col h-full overflow-hidden transition duration-300 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-xl"
      onClick={handleCardClick}
    >
      <div className="relative flex-shrink-0" style={{ height: "200px" }}>
        {listing.images && listing.images.length > 0 ? (
          <img src={getCloudinaryImageUrl(listing.images[0].image)} alt={listing.title} className="object-contain w-full h-full" />
        ) : (
          <div className="flex items-center justify-center w-full h-full bg-gray-200">
            <span className="text-gray-400">No image</span>
          </div>
        )}
        <div className="absolute p-2 bg-white bg-opacity-75 rounded-full top-2 left-2">{getListingTypeIcon(listing.listing_type)}</div>
      </div>
      <div className="flex flex-col flex-grow p-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-sm font-medium text-gray-900">{getListingTypeLabel(listing.listing_type)}</span>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <span className="flex items-center">
              <EyeIcon className="w-4 h-4 mr-1" />
              {listing.view_count}
            </span>
            <span className="flex items-center">
              <HeartIcon className="w-4 h-4 mr-1" />
              {listing.favorite_count}
            </span>
          </div>
        </div>
        <h3 className="text-lg font-medium text-gray-900 line-clamp-2">{listing.title}</h3>
        <div className="flex items-center justify-between mt-1">
          <p className="text-sm text-gray-500 truncate">
            {listing.category_name} {listing.subcategory_name && `> ${listing.subcategory_name}`}
          </p>
          <div onClick={(e) => e.stopPropagation()}>
            <FavoriteButton listing={listing} />
          </div>
        </div>
        <div className="flex items-center mt-2 text-lg font-semibold text-green-600">
          <CurrencyDollarIcon className="flex-shrink-0 w-5 h-5 mr-1 text-green-500" />
          <span className="truncate">{renderPrice()}</span>
          {listing.price_type === "negotiable" && <span className="ml-1 text-xs text-gray-500">(Negotiable)</span>}
        </div>
        {shouldShowCondition && listing.condition && listing.condition !== "na" && (
          <p className="mt-1 text-sm text-gray-600 truncate">Condition: {conditionLabel}</p>
        )}
        <div className="flex items-center mt-2 text-sm text-gray-500">
          <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
          <span className="truncate">{listing.location || "Location N/A"}</span>
        </div>
        <div className="flex items-center mt-2 text-sm text-gray-500">
          <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
          <span className="truncate">{formatDate(listing.created_at)}</span>
        </div>
        {listing.listing_type === "event" && listing.event_date && (
          <div className="flex items-center mt-2 text-sm text-blue-500">
            <CalendarIcon className="flex-shrink-0 mr-1.5 h-4 w-4" />
            <span className="truncate">Event Date: {formatDate(listing.event_date, true)}</span>
          </div>
        )}
        {listing.delivery_option && listing.delivery_option !== "na" && (
          <div className="flex items-center mt-2 text-sm text-gray-500">
            <BuildingStorefrontIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
            <span className="truncate">
              {deliveryOptions.find((option) => option.value === listing.delivery_option)?.label || listing.delivery_option}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default ListingCard;
