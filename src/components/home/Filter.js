import React, { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";
import FormSelect from "../shared/form/FormSelect";
import FormInput from "../shared/form/FormInput";
import SubmitBtn from "../shared/form/SubmitBtn";

const Filter = ({ onFilterChange }) => {
  const { state, loading, error, fetchSubcategories } = useData();
  const [filters, setFilters] = useState({
    category: "",
    subcategory: "",
    min_price: "",
    max_price: "",
    condition: "",
    delivery_option: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (filters.category) {
      fetchSubcategories(filters.category);
    } else {
      setFilters((prev) => ({ ...prev, subcategory: "" }));
    }
  }, [filters.category, fetchSubcategories]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFilters((prevFilters) => ({
      ...prevFilters,
      [name]: value,
      ...(name === "category" ? { subcategory: "" } : {}),
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    const formattedFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""));
    onFilterChange(formattedFilters);
    setIsSubmitting(false);
  };

  if (loading.categories) return <p>Loading filters...</p>;
  if (error.categories) return <p>Error loading filters: {error.categories}</p>;

  const subcategories = state.subcategories && filters.category ? state.subcategories[filters.category] || [] : [];

  const conditionOptions = [
    { value: "", label: "Any Condition" },
    { value: "new", label: "New" },
    { value: "like_new", label: "Like New" },
    { value: "good", label: "Good" },
    { value: "fair", label: "Fair" },
    { value: "poor", label: "Poor" },
  ];

  const deliveryOptions = [
    { value: "", label: "Any Delivery Option" },
    { value: "pickup", label: "Pickup Only" },
    { value: "delivery", label: "Delivery Available" },
    { value: "both", label: "Pickup or Delivery" },
  ];

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Advanced Filters</h2>

      <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
        <FormSelect
          id="category"
          name="category"
          value={filters.category}
          onChange={handleInputChange}
          label="Category"
          options={[
            { value: "", label: "All Categories" },
            ...(state.categories?.map((category) => ({ value: category.id, label: category.name })) || []),
          ]}
        />

        <FormSelect
          id="subcategory"
          name="subcategory"
          value={filters.subcategory}
          onChange={handleInputChange}
          label="Subcategory"
          options={[
            { value: "", label: "All Subcategories" },
            ...subcategories.map((subcategory) => ({ value: subcategory.id, label: subcategory.name })),
          ]}
          disabled={!filters.category}
        />
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
        <FormInput
          id="min_price"
          name="min_price"
          value={filters.min_price}
          onChange={handleInputChange}
          label="Min Price"
          type="number"
          placeholder="0"
        />
        <FormInput
          id="max_price"
          name="max_price"
          value={filters.max_price}
          onChange={handleInputChange}
          label="Max Price"
          type="number"
          placeholder="Any"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
        <FormSelect
          id="condition"
          name="condition"
          value={filters.condition}
          onChange={handleInputChange}
          label="Condition"
          options={conditionOptions}
        />

        <FormSelect
          id="delivery_option"
          name="delivery_option"
          value={filters.delivery_option}
          onChange={handleInputChange}
          label="Delivery Option"
          options={deliveryOptions}
        />
      </div>

      <SubmitBtn isSubmitting={isSubmitting}>Apply Filters</SubmitBtn>
    </form>
  );
};

export default Filter;
