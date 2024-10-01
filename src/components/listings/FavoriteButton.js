import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import api from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import { useData } from "../../context/DataContext";
import { useError } from "../../context/ErrorContext";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";
import { toast } from "react-toastify";

/**
 * FavoriteButton component for toggling favorite status of a listing
 * @param {Object} props - Component props
 * @param {Object} props.listing - The listing object
 * @returns {JSX.Element} FavoriteButton component
 */
function FavoriteButton({ listing }) {
  const { user } = useAuth();
  const { fetchFavorites, updateFavoriteStatus } = useData();
  const { handleApiError } = useError();
  const navigate = useNavigate();
  const location = useLocation();
  const [isFavorited, setIsFavorited] = useState(listing.is_favorited);

  /**
   * Handles the toggling of favorite status
   */
  const handleFavoriteToggle = async () => {
    if (!user) {
      navigate("/login", { state: { from: location } });
      return;
    }

    try {
      await api.post(`listings/listings/${listing.id}/favorite/`);
      const newFavoriteStatus = !isFavorited;
      setIsFavorited(newFavoriteStatus);
      updateFavoriteStatus(listing.id, newFavoriteStatus);
      fetchFavorites();
      toast.success(newFavoriteStatus ? "Added to favorites" : "Removed from favorites");
    } catch (err) {
      handleApiError(err, "Error updating favorite status");
    }
  };

  return (
    <button onClick={handleFavoriteToggle} className="focus:outline-none" aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}>
      {isFavorited ? <HeartSolid className="w-6 h-6 text-red-500" /> : <HeartOutline className="w-6 h-6 text-gray-500 hover:text-red-500" />}
    </button>
  );
}

export default FavoriteButton;
