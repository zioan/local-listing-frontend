import React from "react";
import { Link } from "react-router-dom";
import { HeartIcon, MapPinIcon, ClockIcon } from "@heroicons/react/24/outline";
import { getCloudinaryImageUrl } from "../../lib/cloudinaryUtil";
import FavoriteButton from "./FavoriteButton";

const ListingCard = ({ listing }) => {
  return (
    <div className="overflow-hidden transition duration-300 bg-white rounded-lg shadow-md hover:shadow-xl">
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
      <div className="p-4">
        <Link to={`/listings/${listing.id}`} className="text-lg font-medium text-gray-900 hover:text-blue-600">
          {listing.title}
        </Link>
        <p className="mt-1 text-sm text-gray-500">{listing.category_name}</p>
        <p className="mt-2 text-lg font-semibold text-green-600">${listing.price}</p>
        <div className="flex items-center mt-2 text-sm text-gray-500">
          <MapPinIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
          <span>{listing.city || "Location N/A"}</span>
        </div>
        <div className="flex items-center mt-2 text-sm text-gray-500">
          <ClockIcon className="flex-shrink-0 mr-1.5 h-4 w-4 text-gray-400" />
          <span>{new Date(listing.created_at).toLocaleDateString()}</span>
        </div>
        <div className="flex items-center justify-between mt-4">
          <button className="inline-flex items-center px-2.5 py-1.5 border border-transparent text-xs font-medium rounded text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            View details
          </button>
          <FavoriteButton listing={listing} />
        </div>
      </div>
    </div>
  );
};

export default ListingCard;
