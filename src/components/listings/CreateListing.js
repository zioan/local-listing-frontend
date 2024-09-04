import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../config/api";
import { useAuth } from "../../context/AuthContext";
import SubmitBtn from "../shared/form/SubmitBtn";
import FormInput from "../shared/form/FormInput";
import FormSelect from "../shared/form/FormSelect";
import FormTextArea from "../shared/form/FormTextArea";
import ImageUpload from "../shared/form/ImageUpload";

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
    return null;
  }

  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Create a New Listing</h1>
      {error && <div className="mb-4 text-red-500">{error}</div>}
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
          options={categories.map((category) => ({ value: category.id, label: category.name }))}
          required
        />
        {formData.category && (
          <FormSelect
            id="subcategory"
            name="subcategory"
            value={formData.subcategory}
            onChange={handleChange}
            label="Subcategory"
            options={subcategories.map((subcategory) => ({ value: subcategory.id, label: subcategory.name }))}
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
          newImages={images}
          onNewImageAdd={handleImageChange}
          onNewImageRemove={(index) => setImages(images.filter((_, i) => i !== index))}
        />
        <div>
          <SubmitBtn isSubmitting={isSubmitting}>Create Listing</SubmitBtn>
        </div>
      </form>
    </div>
  );
};

export default CreateListing;
