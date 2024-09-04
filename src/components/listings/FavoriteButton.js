import React from "react";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

const FavoriteButton = ({ isFavorited, onClick, className = "" }) => {
  return (
    <button onClick={onClick} className={`focus:outline-none ${className}`} aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}>
      {isFavorited ? <HeartSolid className="w-6 h-6 text-red-500" /> : <HeartOutline className="w-6 h-6 text-gray-500 hover:text-red-500" />}
    </button>
  );
};

export default FavoriteButton;
