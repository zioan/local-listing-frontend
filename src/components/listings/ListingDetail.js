import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import { getCloudinaryImageUrl } from "../../lib/cloudinaryUtil";
import ConfirmationModal from "../global/ConfirmationModal";

const ListingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [listing, setListing] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

  useEffect(() => {
    const fetchListing = async () => {
      try {
        const response = await api.get(`listings/listings/${id}/`);
        setListing(response.data);
        setLoading(false);
      } catch (err) {
        console.error("Error details:", err.response || err);
        setError(`Error fetching listing details: ${err.response?.data?.detail || err.message}`);
        setLoading(false);
      }
    };

    fetchListing();
  }, [id]);

  const handleDelete = async () => {
    try {
      await api.delete(`listings/listings/${id}/`);
      navigate("/profile/listings");
    } catch (err) {
      console.error("Error deleting listing:", err);
      setError("Failed to delete listing. Please try again.");
    }
  };

  const openDeleteModal = () => setIsDeleteModalOpen(true);
  const closeDeleteModal = () => setIsDeleteModalOpen(false);

  if (loading) return <div className="py-4 text-center">Loading...</div>;
  if (error) return <div className="py-4 text-center text-red-500">{error}</div>;
  if (!listing) return <div className="py-4 text-center">Listing not found</div>;

  return (
    <div className="max-w-2xl p-6 mx-auto mt-8 bg-white rounded-lg shadow-md">
      <h1 className="mb-4 text-3xl font-bold">{listing.title}</h1>
      <p className="mb-4 text-xl font-semibold text-indigo-600">${listing.price}</p>
      <p className="mb-4 text-gray-700">{listing.description}</p>
      <div className="mb-4">
        <span className="font-semibold">Condition:</span> {listing.condition}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Category:</span> {listing.category_name}
      </div>
      {listing.subcategory_name && (
        <div className="mb-4">
          <span className="font-semibold">Subcategory:</span> {listing.subcategory_name}
        </div>
      )}
      <div className="mb-4">
        <span className="font-semibold">Seller:</span> {listing.user}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Posted:</span> {new Date(listing.created_at).toLocaleDateString()}
      </div>
      <div className="mb-4">
        <span className="font-semibold">Views:</span> {listing.view_count}
      </div>
      {listing.images && listing.images.length > 0 && (
        <div className="mt-6">
          <h2 className="mb-4 text-xl font-semibold">Images</h2>
          <div className="grid grid-cols-2 gap-4">
            {listing.images.map((image, index) => (
              <img
                key={index}
                src={getCloudinaryImageUrl(image.image)}
                alt={`Listing ${index + 1}`}
                className="object-cover w-full h-48 rounded-md"
              />
            ))}
          </div>
        </div>
      )}
      {user && user.username === listing.user && (
        <div className="mt-6 space-x-4">
          <button onClick={() => navigate(`/listings/${id}/edit`)} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
            Edit Listing
          </button>
          <button onClick={openDeleteModal} className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
            Delete Listing
          </button>
        </div>
      )}

      <ConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={closeDeleteModal}
        onConfirm={handleDelete}
        title="Confirm Deletion"
        message="Are you sure you want to delete this listing? This action cannot be undone."
      />
    </div>
  );
};

export default ListingDetail;
