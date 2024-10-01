import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { useAuth } from "../../context/AuthContext";
import { useError } from "../../context/ErrorContext";
import api from "../../config/api";
import SubmitBtn from "../shared/form/SubmitBtn";
import FormInput from "../shared/form/FormInput";
import FormSelect from "../shared/form/FormSelect";
import FormTextArea from "../shared/form/FormTextArea";
import ImageUpload from "../shared/form/ImageUpload";
import LoadingSpinner from "../shared/LoadingSpinner";
import { toast } from "react-toastify";
import { listingTypeOptions, conditionOptions, deliveryOptions, priceTypeOptions } from "../../util/listingHelpers";

/**
 * CreateListing Component
 *
 * This component provides a form for users to create a new listing.
 * It handles form submission, image uploads, and various listing types.
 */
function CreateListing() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { categories, subcategories, loading, error, fetchCategories, fetchSubcategories, invalidateCache } = useData();
  const { handleApiError } = useError();

  // Form data state
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    listing_type: "",
    price: "",
    price_type: "fixed",
    condition: "",
    category: "",
    subcategory: "",
    delivery_option: "",
    location: "",
    event_date: "",
    status: "active",
  });

  const [images, setImages] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch categories on component mount
  useEffect(() => {
    if (!user) {
      navigate("/login", { state: { from: location } });
    } else {
      fetchCategories().catch((err) => handleApiError(err, "Failed to fetch categories"));
    }
  }, [user, navigate, location, fetchCategories, handleApiError]);

  // Fetch subcategories when category changes
  useEffect(() => {
    if (formData.category) {
      fetchSubcategories(formData.category).catch((err) => handleApiError(err, "Failed to fetch subcategories"));
    }
  }, [formData.category, fetchSubcategories, handleApiError]);

  /**
   * Handle form input changes
   * @param {Event} e - The input change event
   */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => {
      const newData = {
        ...prev,
        [name]: value,
        ...(name === "category" ? { subcategory: "" } : {}),
      };

      if (name === "listing_type") {
        if (value === "item_free") {
          newData.price = "0";
          newData.price_type = "free";
        } else {
          newData.price = prev.price === "0" ? "" : prev.price;
          newData.price_type = prev.price_type === "free" ? "fixed" : prev.price_type;
        }
      }

      if (name === "price_type" && ["free", "contact", "na"].includes(value)) {
        newData.price = "";
      }
      return newData;
    });
  };

  /**
   * Handle image upload
   * @param {Event} e - The file input change event
   */
  const handleImageChange = (e) => {
    setImages([...images, ...e.target.files]);
  };

  /**
   * Handle image removal
   * @param {number} index - The index of the image to remove
   */
  const handleImageRemove = (index) => {
    setImages(images.filter((_, i) => i !== index));
  };

  /**
   * Handle form submission
   * @param {Event} e - The form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    // Validation
    if (["item_sale", "item_free", "item_wanted"].includes(formData.listing_type) && !formData.condition) {
      toast.error("Condition is required for item listings.");
      setIsSubmitting(false);
      return;
    }
    if (formData.listing_type === "event" && !formData.event_date) {
      toast.error("Event date is required for event listings.");
      setIsSubmitting(false);
      return;
    }

    const listingData = new FormData();
    Object.keys(formData).forEach((key) => {
      if (formData[key] !== null && formData[key] !== "") {
        listingData.append(key, formData[key]);
      }
    });
    listingData.append("is_active", "true");
    images.forEach((image, index) => {
      listingData.append(`images[${index}]`, image);
    });

    try {
      const response = await api.post("listings/listings/", listingData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      invalidateCache("listings");
      navigate(`/listings/${response.data.id}`);
      toast.success("Listing created successfully!");
    } catch (err) {
      handleApiError(err, "Failed to create listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading.categories) return <LoadingSpinner isLoading={loading.categories} />;
  if (error.categories) return <div className="text-red-500">{error.categories}</div>;

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Create a New Listing</h1>
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
        <FormInput id="title" name="title" value={formData.title} onChange={handleChange} label="Title" required />
        <FormTextArea id="description" name="description" value={formData.description} onChange={handleChange} label="Description" required />
        {formData.listing_type !== "item_free" && (
          <>
            {!["free", "contact", "na"].includes(formData.price_type) && (
              <FormInput
                id="price"
                name="price"
                value={formData.price}
                onChange={handleChange}
                label="Price"
                type="number"
                required
                className="sm:max-w-xs"
              />
            )}
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
        <FormSelect
          id="category"
          name="category"
          value={formData.category}
          onChange={handleChange}
          label="Category"
          options={categories.map((category) => ({
            value: category.id,
            label: category.name,
          }))}
          required
        />
        {formData.category && !loading.subcategories && (
          <FormSelect
            id="subcategory"
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            label="Subcategory"
            options={
              subcategories && subcategories[formData.category]
                ? subcategories[formData.category].map((subcategory) => ({
                    value: subcategory.id,
                    label: subcategory.name,
                  }))
                : []
            }
          />
        )}
        {loading.subcategories && <p>Loading subcategories...</p>}
        {error.subcategories && <p className="text-red-500">{error.subcategories}</p>}
        <FormSelect
          id="delivery_option"
          name="delivery_option"
          value={formData.delivery_option}
          onChange={handleChange}
          label="Delivery Option"
          options={deliveryOptions}
          required
        />
        <FormInput id="location" name="location" value={formData.location} onChange={handleChange} label="Location" className="sm:max-w-xs" />
        {formData.listing_type === "event" && (
          <FormInput
            id="event_date"
            name="event_date"
            value={formData.event_date}
            onChange={handleChange}
            label="Event Date and Time"
            type="datetime-local"
            required
            className="sm:max-w-xs"
          />
        )}
        <ImageUpload newImages={images} onNewImageAdd={handleImageChange} onNewImageRemove={handleImageRemove} />
        <div>
          <SubmitBtn isSubmitting={isSubmitting} className="m-auto sm:max-w-xs">
            Create Listing
          </SubmitBtn>
        </div>
      </form>
    </div>
  );
}

export default CreateListing;
