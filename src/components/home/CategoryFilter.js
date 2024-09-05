import React from "react";
import { useData } from "../../context/DataContext";
import { ChevronDownIcon } from "@heroicons/react/24/outline";

const CategoryFilter = ({ onCategoryChange }) => {
  const { state, loading, error } = useData();

  if (loading.categories) return <p>Loading categories...</p>;
  if (error.categories) return <p>Error loading categories: {error.categories}</p>;

  const handleCategoryChange = (e) => {
    const category = e.target.value;
    onCategoryChange(category);
  };

  return (
    <div className="mb-4">
      <div className="relative mt-1">
        <select
          onChange={handleCategoryChange}
          className="block w-full py-2 pl-3 pr-10 text-base border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="">All Categories</option>
          {state.categories.map((category) => (
            <option key={category.id} value={category.id}>
              {category.name}
            </option>
          ))}
        </select>
        <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
          <ChevronDownIcon className="w-5 h-5 text-gray-400" aria-hidden="true" />
        </div>
      </div>
    </div>
  );
};

export default CategoryFilter;
