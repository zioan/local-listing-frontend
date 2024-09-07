import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import SubmitBtn from "../shared/form/SubmitBtn";
import FormInput from "../shared/form/FormInput";
import FormSelect from "../shared/form/FormSelect";
import FormTextArea from "../shared/form/FormTextArea";
import ImageUpload from "../shared/form/ImageUpload";
import LoadingSpinner from "../shared/LoadingSpinner";

const EditListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { state, loading, error, fetchListing, fetchCategories, fetchSubcategories, updateListing, invalidateCache } = useData();

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

  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/login");
    } else {
      fetchListing(id);
      fetchCategories();
    }
  }, [user, navigate, id, fetchListing, fetchCategories]);

  useEffect(() => {
    if (state.listingDetails[id]) {
      setFormData(state.listingDetails[id]);
      setExistingImages(state.listingDetails[id].images || []);
    }
  }, [id, state.listingDetails]);

  useEffect(() => {
    if (formData.category) {
      fetchSubcategories(formData.category);
    }
  }, [formData.category, fetchSubcategories]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleNewImageAdd = (e) => {
    setNewImages((prev) => [...prev, ...e.target.files]);
  };

  const handleExistingImageRemove = (imageId) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  const handleNewImageRemove = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmitError(null);

    const listingData = new FormData();
    Object.keys(formData).forEach((key) => listingData.append(key, formData[key]));
    existingImages.forEach((img) => listingData.append("existing_images", img.id));
    newImages.forEach((image) => listingData.append("new_images", image));

    try {
      await updateListing(id, listingData);
      invalidateCache(`listing-${id}`);
      invalidateCache("listings");
      navigate(`/listings/${id}`);
    } catch (err) {
      console.error("Error updating listing:", err);
      setSubmitError("Failed to update listing. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading.listingDetails || loading.categories) return <LoadingSpinner />;
  if (error.listingDetails || error.categories) return <div className="text-red-500">{error.listingDetails || error.categories}</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Edit Listing</h1>
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
        {state.categories && (
          <FormSelect
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            label="Category"
            options={state.categories.map((category) => ({ value: category.id, label: category.name }))}
            required
          />
        )}
        {formData.category && state.subcategories && state.subcategories[formData.category] && (
          <FormSelect
            id="subcategory"
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            label="Subcategory"
            options={state.subcategories[formData.category].map((subcategory) => ({ value: subcategory.id, label: subcategory.name }))}
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
        <ImageUpload
          existingImages={existingImages}
          newImages={newImages}
          onExistingImageRemove={handleExistingImageRemove}
          onNewImageAdd={handleNewImageAdd}
          onNewImageRemove={handleNewImageRemove}
        />
        <div>
          <SubmitBtn isSubmitting={isSubmitting}>Update Listing</SubmitBtn>
        </div>
      </form>
    </div>
  );
};

export default EditListing;
