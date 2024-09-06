import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import api from "../../config/api";
import SubmitBtn from "../shared/form/SubmitBtn";
import FormInput from "../shared/form/FormInput";
import FormSelect from "../shared/form/FormSelect";
import FormTextArea from "../shared/form/FormTextArea";
import ImageUpload from "../shared/form/ImageUpload";
import LoadingSpinner from "../shared/LoadingSpinner";

const CreateListing = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { state, loading, error, fetchCategories, fetchSubcategories, invalidateCache } = useData();
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
  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchCategories();
    }
  }, [user, navigate, fetchCategories]);

  useEffect(() => {
    if (formData.category) {
      fetchSubcategories(formData.category);
    }
  }, [formData.category, fetchSubcategories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
      ...(name === "category" ? { subcategory: "" } : {}),
    }));
  };

  const handleImageChange = (e) => {
    setImages([...images, ...e.target.files]);
  };

  const handleImageRemove = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const listingData = new FormData();
    Object.keys(formData).forEach((key) => listingData.append(key, formData[key]));
    images.forEach((image) => listingData.append("images", image));

    try {
      const response = await api.post("listings/listings/", listingData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      invalidateCache("listings");
      navigate(`/listings/${response.data.id}`);
    } catch (err) {
      console.error("Error creating listing:", err.response?.data);
      setSubmitError("Failed to create listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading.categories) return <LoadingSpinner isLoading={loading.categories} />;
  if (error.categories) return <div className="text-red-500">{error.categories}</div>;

  const categoryOptions = state.categories
    ? state.categories.map((category) => ({
        value: category.id,
        label: category.name,
      }))
    : [];

  const subcategoryOptions =
    formData.category && state.subcategories && state.subcategories[formData.category]
      ? state.subcategories[formData.category].map((subcategory) => ({
          value: subcategory.id,
          label: subcategory.name,
        }))
      : [];

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Create a New Listing</h1>
      {submitError && <div className="mb-4 text-red-500">{submitError}</div>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput id="title" name="title" value={formData.title} onChange={handleChange} label="Title" required />
        <FormTextArea id="description" name="description" value={formData.description} onChange={handleChange} label="Description" required />
        <FormInput id="price" name="price" value={formData.price} onChange={handleChange} label="Price" type="number" required />
        <FormSelect
          id="price_type"
          name="price_type"
          value={formData.price_type}
          onChange={handleChange}
          label="Price Type"
          options={[
            { value: "fixed", label: "Fixed Price" },
            { value: "negotiable", label: "Negotiable" },
            { value: "free", label: "Free" },
          ]}
          required
        />
        <FormSelect
          id="condition"
          name="condition"
          value={formData.condition}
          onChange={handleChange}
          label="Condition"
          options={[
            { value: "new", label: "New" },
            { value: "like_new", label: "Like New" },
            { value: "good", label: "Good" },
            { value: "fair", label: "Fair" },
            { value: "poor", label: "Poor" },
          ]}
          required
        />
        <FormSelect
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          label="Category"
          options={categoryOptions}
          required
        />
        {formData.category && (
          <FormSelect
            id="subcategory"
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            label="Subcategory"
            options={subcategoryOptions}
            required
          />
        )}
        <FormSelect
          id="delivery_option"
          name="delivery_option"
          value={formData.delivery_option}
          onChange={handleChange}
          label="Delivery Option"
          options={[
            { value: "pickup", label: "Pickup Only" },
            { value: "delivery", label: "Delivery Available" },
            { value: "both", label: "Pickup or Delivery" },
          ]}
          required
        />
        <ImageUpload newImages={images} onNewImageAdd={handleImageChange} onNewImageRemove={handleImageRemove} />
        <div>
          <SubmitBtn isSubmitting={isSubmitting}>Create Listing</SubmitBtn>
        </div>
      </form>
    </div>
  );
};

export default CreateListing;
