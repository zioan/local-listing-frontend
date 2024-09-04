import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import { getCloudinaryImageUrl } from "../../lib/cloudinaryUtil";
import Modal from "../shared/Modal";

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

  if (loading)
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-32 h-32 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
      </div>
    );
  if (error) return <div className="py-10 text-center text-red-500">{error}</div>;
  if (!listing) return <div className="py-10 text-center">Listing not found</div>;

  return (
    <div className="px-4 py-8 mx-auto max-w-7xl sm:px-6 lg:px-8">
      <div className="overflow-hidden bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h1 className="text-3xl font-bold leading-tight text-gray-900">{listing.title}</h1>
          <p className="max-w-2xl mt-1 text-sm text-gray-500">
            {listing.category_name} {listing.subcategory_name && `> ${listing.subcategory_name}`}
          </p>
        </div>
        <div className="px-4 py-5 border-t border-gray-200 sm:p-0">
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
            <div className="sm:px-6 sm:py-5">
              {listing.images && listing.images.length > 0 ? (
                <img src={getCloudinaryImageUrl(listing.images[0].image)} alt={listing.title} className="object-cover w-full rounded-lg h-96" />
              ) : (
                <div className="flex items-center justify-center w-full bg-gray-200 rounded-lg h-96">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>
            <div className="sm:px-6 sm:py-5">
              <dl className="grid grid-cols-1 gap-x-4 gap-y-6 sm:grid-cols-2">
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Price</dt>
                  <dd className="mt-1 text-2xl font-semibold text-green-600">${listing.price}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Condition</dt>
                  <dd className="mt-1 text-sm text-gray-900">{listing.condition}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Seller</dt>
                  <dd className="mt-1 text-sm text-gray-900">{listing.user}</dd>
                </div>
                <div className="sm:col-span-1">
                  <dt className="text-sm font-medium text-gray-500">Delivery Option</dt>
                  <dd className="mt-1 text-sm text-gray-900">{listing.delivery_option}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">{listing.description}</dd>
                </div>
                <div className="flex items-center sm:col-span-1">
                  <MapPinIcon className="w-5 h-5 mr-2 text-gray-400" />
                  <span className="text-sm text-gray-500">{listing.city || "Location N/A"}</span>
                </div>
                <div className="flex items-center sm:col-span-1">
                  <ClockIcon className="w-5 h-5 mr-2 text-gray-400" />
                  <span className="text-sm text-gray-500">{new Date(listing.created_at).toLocaleDateString()}</span>
                </div>
                <div className="flex items-center sm:col-span-1">
                  <HeartIcon className="w-5 h-5 mr-2 text-gray-400" />
                  <span className="text-sm text-gray-500">{listing.favorite_count} favorites</span>
                </div>
                <div className="flex items-center sm:col-span-1">
                  <svg
                    className="w-5 h-5 mr-2 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                    />
                  </svg>
                  <span className="text-sm text-gray-500">{listing.view_count} views</span>
                </div>
              </dl>
              {user && user.username === listing.user && (
                <div className="flex mt-6 space-x-3">
                  <button
                    onClick={() => navigate(`/listings/${id}/edit`)}
                    className="inline-flex items-center px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                  >
                    <PencilIcon className="w-5 h-5 mr-2" />
                    Edit Listing
                  </button>
                  <button onClick={() => setIsDeleteModalOpen(true)} className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600">
                    <TrashIcon className="w-5 h-5 mr-2" />
                    Delete Listing
                  </button>
                </div>
              )}

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
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ListingDetail;
