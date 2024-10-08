import React, { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { useError } from "../../context/ErrorContext";
import SubmitBtn from "../shared/form/SubmitBtn";
import FormInput from "../shared/form/FormInput";
import FormSelect from "../shared/form/FormSelect";
import FormTextArea from "../shared/form/FormTextArea";
import ImageUpload from "../shared/form/ImageUpload";
import LoadingSpinner from "../shared/LoadingSpinner";
import { toast } from "react-toastify";
import { listingTypeOptions, conditionOptions, deliveryOptions, priceTypeOptions, statusOptions } from "../../util/listingHelpers";

/**
 * EditListing component for editing an existing listing
 * @returns {JSX.Element} The EditListing component
 */
function EditListing() {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  const { handleApiError } = useError();
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

  /**
   * Fetch user data and listing details on component mount
   */
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: location } });
    } else {
      fetchListing(id).catch((err) => handleApiError(err, "Failed to fetch listing details"));
      fetchCategories().catch((err) => handleApiError(err, "Failed to fetch categories"));
    }
  }, [user, navigate, location, id, fetchListing, fetchCategories, handleApiError]);

  /**
   * Update form data when listing details are fetched
   */
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

  /**
   * Fetch subcategories when category changes
   */
  useEffect(() => {
    if (formData.category) {
      fetchSubcategories(formData.category).catch((err) => handleApiError(err, "Failed to fetch subcategories"));
    }
  }, [formData.category, fetchSubcategories, handleApiError]);

  /**
   * Handle form input changes
   * @param {Object} e - The event object
   */
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

  /**
   * Handle new image additions
   * @param {Object} e - The event object
   */
  const handleNewImageAdd = (e) => {
    setNewImages((prev) => [...prev, ...e.target.files]);
  };

  /**
   * Handle existing image removals
   * @param {number} imageId - The ID of the image to remove
   */
  const handleExistingImageRemove = (imageId) => {
    setExistingImages((prev) => prev.filter((img) => img.id !== imageId));
  };

  /**
   * Handle new image removals
   * @param {number} index - The index of the image to remove
   */
  const handleNewImageRemove = (index) => {
    setNewImages((prev) => prev.filter((_, i) => i !== index));
  };

  /**
   * Handle form submission
   * @param {Object} e - The event object
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

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
      toast.success("Listing updated successfully!");
    } catch (err) {
      handleApiError(err, "Failed to update listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading.listingDetails || loading.categories) return <LoadingSpinner />;
  if (error.listingDetails || error.categories) return <div className="text-red-500">{error.listingDetails || error.categories}</div>;

  return (
    <div className="max-w-2xl px-4 mx-auto my-10 sm:px-0">
      <h1 className="mb-6 text-3xl font-bold">Edit Listing</h1>
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
