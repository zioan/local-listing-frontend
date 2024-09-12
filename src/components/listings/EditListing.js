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
import { listingTypeOptions, conditionOptions, deliveryOptions, priceTypeOptions, statusOptions } from "../../util/listingHelpers";

function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const {
    listingDetails,
    categories,
    subcategories,
    loading,
    error,
    fetchListing,
    fetchCategories,
    fetchSubcategories,
    updateListing,
    invalidateCache,
  } = useData();

  const [formData, setFormData] = useState({
    title: "",
    description: "",
    listing_type: "",
    price: "",
    price_type: "",
    condition: "",
    category: "",
    subcategory: "",
    delivery_option: "",
    location: "",
    event_date: "",
    status: "",
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
    if (listingDetails[id]) {
      const listing = listingDetails[id];
      setFormData({
        title: listing.title || "",
        description: listing.description || "",
        listing_type: listing.listing_type || "",
        price: listing.price || "",
        price_type: listing.price_type || "",
        condition: listing.condition || "",
        category: listing.category || "",
        subcategory: listing.subcategory || "",
        delivery_option: listing.delivery_option || "",
        location: listing.location || "",
        event_date: listing.event_date ? new Date(listing.event_date).toISOString().slice(0, 16) : "",
        status: listing.status || "",
      });
      setExistingImages(listing.images || []);
    }
  }, [id, listingDetails]);

  useEffect(() => {
    if (formData.category) {
      fetchSubcategories(formData.category);
    }
  }, [formData.category, fetchSubcategories]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = { ...prev, [name]: value || "" };
      if (name === "price_type" && ["free", "contact", "na"].includes(value)) {
        newData.price = "";
      }
      return newData;
    });
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
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== undefined) {
        listingData.append(key, formData[key]);
      }
    });
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
        <FormSelect
          id="listing_type"
          name="listing_type"
          value={formData.listing_type}
          onChange={handleChange}
          label="Listing Type"
          options={listingTypeOptions}
          required
        />
        <FormSelect
          id="status"
          name="status"
          value={formData.status}
          onChange={handleChange}
          label="Listing Status"
          options={statusOptions}
          required
        />
        <FormInput id="title" name="title" value={formData.title} onChange={handleChange} label="Title" required />
        <FormTextArea id="description" name="description" value={formData.description} onChange={handleChange} label="Description" required />
        {formData.listing_type !== "item_free" && (
          <>
            <FormInput id="price" name="price" value={formData.price} onChange={handleChange} label="Price" type="number" />
            <FormSelect
              id="price_type"
              name="price_type"
              value={formData.price_type}
              onChange={handleChange}
              label="Price Type"
              options={priceTypeOptions}
              required
            />
          </>
        )}
        {["item_sale", "item_free", "item_wanted"].includes(formData.listing_type) && (
          <FormSelect
            id="condition"
            name="condition"
            value={formData.condition}
            onChange={handleChange}
            label="Condition"
            options={conditionOptions}
            required
          />
        )}
        {categories && (
          <FormSelect
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            label="Category"
            options={categories.map((category) => ({ value: category.id, label: category.name }))}
            required
          />
        )}
        {formData.category && subcategories && subcategories[formData.category] && (
          <FormSelect
            id="subcategory"
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            label="Subcategory"
            options={subcategories[formData.category].map((subcategory) => ({ value: subcategory.id, label: subcategory.name }))}
          />
        )}
        <FormSelect
          id="delivery_option"
          name="delivery_option"
          value={formData.delivery_option}
          onChange={handleChange}
          label="Delivery Option"
          options={deliveryOptions}
          required
        />
        <FormInput id="location" name="location" value={formData.location} onChange={handleChange} label="Location" />
        {formData.listing_type === "event" && (
          <FormInput
            id="event_date"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            label="Event Date and Time"
            type="datetime-local"
            required
          />
        )}
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
}

export default EditListing;
