import React, { useState, useEffect } from "react";
import { useData } from "../../context/DataContext";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const AdvancedFilter = ({ onFilterChange }) => {
  const { state, loading, error, fetchSubcategories } = useData();
  const [filters, setFilters] = useState({
    category: "",
    subcategory: "",
    min_price: "",
    max_price: "",
    condition: "",
    delivery_option: "",
  });

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
    const formattedFilters = Object.fromEntries(Object.entries(filters).filter(([_, v]) => v !== ""));
    onFilterChange(formattedFilters);
  };

  if (loading.categories) return <p>Loading filters...</p>;
  if (error.categories) return <p>Error loading filters: {error.categories}</p>;

  const subcategories = state.subcategories && filters.category ? state.subcategories[filters.category] || [] : [];

  return (
    <form onSubmit={handleSubmit} className="p-4 bg-white rounded-lg shadow-md">
      <h2 className="mb-4 text-xl font-semibold">Advanced Filters</h2>

      <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
        <div>
          <label htmlFor="category" className="block mb-1 text-sm font-medium text-gray-700">
            Category
          </label>
          <div className="relative">
            <select
              id="category"
              name="category"
              value={filters.category}
              onChange={handleInputChange}
              className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">All Categories</option>
              {state.categories &&
                state.categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
            </select>
            <ChevronDownIcon className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
          </div>
        </div>

        <div>
          <label htmlFor="subcategory" className="block mb-1 text-sm font-medium text-gray-700">
            Subcategory
          </label>
          <div className="relative">
            <select
              id="subcategory"
              name="subcategory"
              value={filters.subcategory}
              onChange={handleInputChange}
              className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              disabled={!filters.category}
            >
              <option value="">All Subcategories</option>
              {subcategories.map((subcategory) => (
                <option key={subcategory.id} value={subcategory.id}>
                  {subcategory.name}
                </option>
              ))}
            </select>
            <ChevronDownIcon className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
        <div>
          <label htmlFor="min_price" className="block mb-1 text-sm font-medium text-gray-700">
            Min Price
          </label>
          <input
            type="number"
            id="min_price"
            name="min_price"
            value={filters.min_price}
            onChange={handleInputChange}
            className="block w-full py-2 pl-3 pr-3 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="0"
          />
        </div>
        <div>
          <label htmlFor="max_price" className="block mb-1 text-sm font-medium text-gray-700">
            Max Price
          </label>
          <input
            type="number"
            id="max_price"
            name="max_price"
            value={filters.max_price}
            onChange={handleInputChange}
            className="block w-full py-2 pl-3 pr-3 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            placeholder="Any"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 mb-4 md:grid-cols-2">
        <div>
          <label htmlFor="condition" className="block mb-1 text-sm font-medium text-gray-700">
            Condition
          </label>
          <div className="relative">
            <select
              id="condition"
              name="condition"
              value={filters.condition}
              onChange={handleInputChange}
              className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Any Condition</option>
              <option value="new">New</option>
              <option value="like_new">Like New</option>
              <option value="good">Good</option>
              <option value="fair">Fair</option>
              <option value="poor">Poor</option>
            </select>
            <ChevronDownIcon className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
          </div>
        </div>

        <div>
          <label htmlFor="delivery_option" className="block mb-1 text-sm font-medium text-gray-700">
            Delivery Option
          </label>
          <div className="relative">
            <select
              id="delivery_option"
              name="delivery_option"
              value={filters.delivery_option}
              onChange={handleInputChange}
              className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="">Any Delivery Option</option>
              <option value="pickup">Pickup Only</option>
              <option value="delivery">Delivery Available</option>
              <option value="both">Pickup or Delivery</option>
            </select>
            <ChevronDownIcon className="absolute w-5 h-5 text-gray-400 transform -translate-y-1/2 right-3 top-1/2" />
          </div>
        </div>
      </div>

      <button
        type="submit"
        className="w-full px-4 py-2 text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Apply Filters
      </button>
    </form>
  );
};

export default AdvancedFilter;
