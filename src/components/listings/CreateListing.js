import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import SubmitBtn from "../shared/SubmitBtn";

const CreateListing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    price_type: "fixed",
    condition: "",
    category: "",
    subcategory: "",
    delivery_option: "",
  });
  const [categories, setCategories] = useState([]);
  const [subcategories, setSubcategories] = useState([]);
  const [images, setImages] = useState([]);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchCategories();
    }
  }, [user, navigate]);

  useEffect(() => {
    if (formData.category) {
      fetchSubcategories();
    }
  }, [formData.category]);

  const fetchCategories = async () => {
    try {
      const response = await api.get("listings/categories/");
      setCategories(response.data);
    } catch (err) {
      setError("Error fetching categories");
    }
  };

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
    setImages([...images, ...e.target.files]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const listingData = new FormData();
    Object.keys(formData).forEach((key) => listingData.append(key, formData[key]));
    images.forEach((image) => listingData.append("images", image));

    try {
      const response = await api.post("listings/listings/", listingData, {
        headers: {
          "Content-Type": "multipart/form-data",
          Authorization: `Bearer ${localStorage.getItem("access_token")}`,
        },
      });
      navigate(`/listings/${response.data.id}`);
    } catch (err) {
      setError("Error creating listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!user) {
    return null; // This will prevent the component from rendering while redirecting
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Create a New Listing</h1>
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
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
              className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
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
            className="block w-full mt-1 border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          >
            <option value="">Select Delivery Option</option>
            <option value="pickup">Pickup Only</option>
            <option value="delivery">Delivery Available</option>
            <option value="both">Pickup or Delivery</option>
          </select>
        </div>
        <div>
          <label htmlFor="images" className="block text-sm font-medium text-gray-700">
            Images
          </label>
          <input
            type="file"
            id="images"
            name="images"
            onChange={handleImageChange}
            multiple
            accept="image/*"
            className="block w-full mt-1 text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
          />
        </div>
        <div>
          <SubmitBtn isSubmitting={isSubmitting}>Create Listing</SubmitBtn>
        </div>
      </form>
    </div>
  );
};

export default CreateListing;
