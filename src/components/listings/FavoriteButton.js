import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import { HeartIcon as HeartOutline } from "@heroicons/react/24/outline";
import { HeartIcon as HeartSolid } from "@heroicons/react/24/solid";

function FavoriteButton({ listing }) {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState(null);
  const [isFavorited, setIsFavorited] = useState(listing.is_favorited);

  const handleFavoriteToggle = async () => {
    if (!user) {
      navigate("/login");
      return;
    }
    try {
      await api.post(`listings/listings/${listing.id}/favorite/`);
    } catch (err) {
      setError("Error updating favorite status. Please try again.");
    } finally {
      setIsFavorited(!isFavorited);
    }
  };

  if (error) return <div className="py-10 text-center text-red-500">{error}</div>;

  return (
    <button onClick={handleFavoriteToggle} className="focus:outline-none" aria-label={isFavorited ? "Remove from favorites" : "Add to favorites"}>
      {isFavorited ? <HeartSolid className="w-6 h-6 text-red-500" /> : <HeartOutline className="w-6 h-6 text-gray-500 hover:text-red-500" />}
    </button>
  );
}

export default FavoriteButton;
