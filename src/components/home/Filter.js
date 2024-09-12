import React, { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";
import FormSelect from "../shared/form/FormSelect";
import FormInput from "../shared/form/FormInput";
import SubmitBtn from "../shared/form/SubmitBtn";
import { listingTypeOptions, conditionOptions, deliveryOptions } from "../../util/listingHelpers";
import LoadingSpinner from "../shared/LoadingSpinner";

function Filter({ onFilterChange, onToggleFilter }) {
  const { categories, subcategories, loading, error, fetchSubcategories } = useData();
  const [filters, setFilters] = useState({
    listing_type: "",
    category: "",
    subcategory: "",
    min_price: "",
    max_price: "",
    condition: "",
    delivery_option: "",
    location: "",
    start_date: "",
    end_date: "",
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

  const handleReset = () => {
    const resetFilters = {
      listing_type: "",
      category: "",
      subcategory: "",
      min_price: "",
      max_price: "",
      condition: "",
      delivery_option: "",
      location: "",
      start_date: "",
      end_date: "",
    };
    setFilters(resetFilters);
    onFilterChange({});
    onToggleFilter();
  };

  if (loading.categories) return <LoadingSpinner isLoading={loading.categories} />;
  if (error.categories) return <p>Error loading filters: {error.categories}</p>;

  const subcategoriesForCategory = subcategories && filters.category ? subcategories[filters.category] || [] : [];

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Advanced Filters</h2>

      <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
        <FormSelect
          id="listing_type"
          name="listing_type"
          value={filters.listing_type}
          onChange={handleInputChange}
          label="Listing Type"
          options={listingTypeOptions}
        />
        <FormSelect
          id="category"
          name="category"
          value={filters.category}
          onChange={handleInputChange}
          label="Category"
          options={[{ value: "", label: "All Categories" }, ...(categories?.map((category) => ({ value: category.id, label: category.name })) || [])]}
        />
        <FormSelect
          id="subcategory"
          name="subcategory"
          value={filters.subcategory}
          onChange={handleInputChange}
          label="Subcategory"
          options={[
            { value: "", label: "All Subcategories" },
            ...subcategoriesForCategory.map((subcategory) => ({ value: subcategory.id, label: subcategory.name })),
          ]}
          disabled={!filters.category}
        />
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
        <FormInput
          id="location"
          name="location"
          value={filters.location}
          onChange={handleInputChange}
          label="Location"
          type="text"
          placeholder="Enter location"
        />
        <FormInput id="start_date" name="start_date" value={filters.start_date} onChange={handleInputChange} label="Start Date" type="date" />
        <FormInput id="end_date" name="end_date" value={filters.end_date} onChange={handleInputChange} label="End Date" type="date" />
      </div>
      <div className="flex justify-end mt-6 space-x-4">
        <button
          type="button"
          onClick={handleReset}
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Reset
        </button>
        <div className="w-24">
          <SubmitBtn isSubmitting={isSubmitting}>Apply</SubmitBtn>
        </div>
      </div>
    </form>
  );
}

export default Filter;
