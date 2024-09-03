import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../../config/api";
import { getCloudinaryImageUrl } from "../../lib/cloudinaryUtil";
import { useAuth } from "../../context/AuthContext";
import { XCircleIcon } from "@heroicons/react/24/solid";

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    price_type: "",
    condition: "",
    category: "",
    subcategory: "",
    delivery_option: "",
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchListing();
      fetchCategories();
    }
  }, [user, navigate, id]);

  const fetchListing = async () => {
    try {
      const response = await api.get(`listings/listings/${id}/`);
      setFormData(response.data);
      setExistingImages(response.data.images || []);
    } catch (err) {
      setError("Error fetching listing details");
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get("listings/categories/");
      setCategories(response.data);
    } catch (err) {
      setError("Error fetching categories");
    }
  };

  useEffect(() => {
    if (formData.category) {
      fetchSubcategories();
    }
  }, [formData.category]);

  const fetchSubcategories = async () => {
    try {
      const response = await api.get(`listings/subcategories/by-category/${formData.category}/`);
      setSubcategories(response.data);
    } catch (err) {
      setError("Error fetching subcategories");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    setNewImages([...newImages, ...e.target.files]);
  };

  const handleRemoveExistingImage = (imageId) => {
    setExistingImages(existingImages.filter((img) => img.id !== imageId));
  };

  const handleRemoveNewImage = (index) => {
    setNewImages(newImages.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const listingData = new FormData();
    Object.keys(formData).forEach((key) => listingData.append(key, formData[key]));

    // Append existing image IDs
    existingImages.forEach((img) => listingData.append("existing_images", img.id));

    // Append new images
    newImages.forEach((image) => listingData.append("new_images", image));

    try {
      await api.put(`listings/listings/${id}/`, listingData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      navigate(`/listings/${id}`);
    } catch (err) {
      console.error("Error updating listing:", err.response?.data);
      let errorMessage = "Error updating listing: ";
      if (err.response?.data) {
        if (typeof err.response.data === "string") {
          errorMessage += err.response.data;
        } else {
          errorMessage += JSON.stringify(err.response.data);
        }
      } else {
        errorMessage += "An unexpected error occurred";
      }
      setError(errorMessage);
    }
  };

  if (!user) {
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Edit Listing</h1>
      {error && <div className="mb-4 text-red-500">{error}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
            Title
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            required
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            required
            rows="4"
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          ></textarea>
        </div>

        <div>
          <label htmlFor="price" className="block text-sm font-medium text-gray-700">
            Price
          </label>
          <input
            type="number"
            id="price"
            name="price"
            value={formData.price}
            onChange={handleChange}
            required
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          />
        </div>

        <div>
          <label htmlFor="price_type" className="block text-sm font-medium text-gray-700">
            Price Type
          </label>
          <select
            id="price_type"
            name="price_type"
            value={formData.price_type}
            onChange={handleChange}
            required
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="fixed">Fixed Price</option>
            <option value="negotiable">Negotiable</option>
            <option value="free">Free</option>
          </select>
        </div>

        <div>
          <label htmlFor="condition" className="block text-sm font-medium text-gray-700">
            Condition
          </label>
          <select
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            required
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select Condition</option>
            <option value="new">New</option>
            <option value="like_new">Like New</option>
            <option value="good">Good</option>
            <option value="fair">Fair</option>
            <option value="poor">Poor</option>
          </select>
        </div>

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">
            Category
          </label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            required
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select Category</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
        </div>

        {formData.category && (
          <div>
            <label htmlFor="subcategory" className="block text-sm font-medium text-gray-700">
              Subcategory
            </label>
            <select
              id="subcategory"
              name="subcategory"
              value={formData.subcategory}
              onChange={handleChange}
              required
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
            >
              <option value="">Select Subcategory</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label htmlFor="delivery_option" className="block text-sm font-medium text-gray-700">
            Delivery Option
          </label>
          <select
            id="delivery_option"
            name="delivery_option"
            value={formData.delivery_option}
            onChange={handleChange}
            required
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:border-indigo-300 focus:ring focus:ring-indigo-200 focus:ring-opacity-50"
          >
            <option value="">Select Delivery Option</option>
            <option value="pickup">Pickup Only</option>
            <option value="delivery">Delivery Available</option>
            <option value="both">Pickup or Delivery</option>
          </select>
        </div>

        {/* Existing Images */}
        <div>
          <label className="block text-sm font-medium text-gray-700">Current Images</label>
          <div className="grid grid-cols-3 gap-4 mt-2">
            {existingImages.map((image) => (
              <div key={image.id} className="relative">
                <img src={getCloudinaryImageUrl(image.image)} alt="Listing" className="object-cover w-full h-32 rounded" />
                <button
                  type="button"
                  onClick={() => handleRemoveExistingImage(image.id)}
                  className="absolute top-0 right-0 p-1 text-white bg-red-500 rounded-full"
                >
                  <XCircleIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* New Images */}
        <div>
          <label htmlFor="new-images" className="block text-sm font-medium text-gray-700">
            Add New Images
          </label>
          <input
            type="file"
            id="new-images"
            multiple
            onChange={handleImageChange}
            className="block w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
          />
          <div className="grid grid-cols-3 gap-4 mt-2">
            {newImages.map((image, index) => (
              <div key={index} className="relative">
                <img src={URL.createObjectURL(image)} alt={`New upload ${index + 1}`} className="object-cover w-full h-32 rounded" />
                <button
                  type="button"
                  onClick={() => handleRemoveNewImage(index)}
                  className="absolute top-0 right-0 p-1 text-white bg-red-500 rounded-full"
                >
                  <XCircleIcon className="w-5 h-5" />
                </button>
              </div>
            ))}
          </div>
        </div>

        <div>
          <button type="submit" className="w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
            Update Listing
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditListing;
