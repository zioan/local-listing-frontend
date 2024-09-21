import React from "react";
import { useNavigate } from "react-router-dom";
import { listingTypeOptions } from "../../util/listingHelpers";
import { getCloudinaryImageUrl } from "../../lib/cloudinaryUtil";
import FavoriteButton from "./FavoriteButton";
import { EyeIcon, HeartIcon } from "@heroicons/react/24/outline";
import placeholderImage from "../../assets/placeholder-image.jpg";

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
    if (listing.price_type === "contact") return "- Contact for price";
    if (listing.price_type === "na") return "- N/A";
    return listing.price ? `${listing.price}` : "";
  };

  return (
    <div className="relative flex flex-col h-full overflow-hidden transition duration-300 bg-white rounded-lg shadow-md cursor-pointer hover:shadow-xl">
      <div className="flex-shrink-0 pt-2" style={{ height: "200px" }} onClick={handleCardClick}>
        <img
          src={listing.images && listing.images.length > 0 ? getCloudinaryImageUrl(listing.images[0].image) : placeholderImage}
          alt={listing.title}
          className="object-contain w-full h-full"
        />
      </div>
      <div className="flex flex-col flex-grow p-4 pt-2">
        {/* Listing type */}
        <span className="text-sm font-medium text-gray-900">{getListingTypeLabel(listing.listing_type)}</span>

        {/* Category and Favorite button */}
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-500 truncate">
            {listing.category_name} {listing.subcategory_name && `> ${listing.subcategory_name}`}
          </p>
          <div onClick={(e) => e.stopPropagation()}>
            <FavoriteButton listing={listing} />
          </div>
        </div>

        {/* Title */}
        <h3 className="font-medium text-gray-900 text-ms line-clamp-2">{listing.title}</h3>

        {/* Price */}
        <div className="flex items-center mt-auto text-lg font-semibold text-green-600">
          <span className="truncate">€ {renderPrice()}</span>
          {listing.price_type === "negotiable" && <span className="ml-1 text-xs text-gray-500">(Negotiable)</span>}
        </div>
      </div>
    </div>
  );
}

export default ListingCard;
