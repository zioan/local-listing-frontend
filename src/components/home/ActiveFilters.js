import React from "react";
import { useData } from "../../context/DataContext";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { listingTypeOptions, conditionOptions, deliveryOptions } from "../../util/listingHelpers";
import Tooltip from "../shared/Tooltip";

/**
 * ActiveFilters Component
 *
 * This component displays a list of active filters that the user has applied. Each filter can be removed individually.
 *
 * @param {Object} filters - An object containing the active filters applied by the user.
 * @param {Function} onFilterRemove - A callback function to remove a specific filter when the user clicks the remove button.
 */
const ActiveFilters = ({ filters, onFilterRemove }) => {
  const { categories, subcategories } = useData();

  /**
   * getFilterLabel
   *
   * Retrieves the label for a filter based on the key and value.
   * It handles various filter types like listing type, condition, category, etc.
   *
   * @param {string} key - The filter key (e.g., "listing_type", "category").
   * @param {string|number} value - The filter value.
   * @returns {string} - The label for the filter.
   */
  const getFilterLabel = (key, value) => {
    switch (key) {
      case "listing_type":
        return listingTypeOptions.find((option) => option.value === value)?.label;
      case "condition":
        return conditionOptions.find((option) => option.value === value)?.label;
      case "delivery_option":
        return deliveryOptions.find((option) => option.value === value)?.label;
      case "category":
        const category = categories.find((cat) => cat.id.toString() === value);
        return `Category: ${category ? category.name : value}`;
      case "subcategory":
        const subcategory = subcategories[filters.category]?.find((subcat) => subcat.id.toString() === value);
        return `Subcategory: ${subcategory ? subcategory.name : value}`;
      case "min_price":
        return `Min Price: $${value}`;
      case "max_price":
        return `Max Price: $${value}`;
      case "location":
        return `Location: ${value}`;
      case "start_date":
        return `Start Date: ${value}`;
      case "end_date":
        return `End Date: ${value}`;
      default:
        return `${key}: ${value}`;
    }
  };

  // If there are no filters applied, don't render the component
  if (Object.keys(filters).length === 0 || (filters.hasOwnProperty("search") && filters.search.trim() === "")) {
    return null;
  }

  return (
    <div className="mb-4">
      <h3 className="mb-2 text-lg font-semibold text-gray-700">Active Filters:</h3>
      <div className="flex flex-wrap gap-2">
        {Object.entries(filters).map(
          ([key, value]) =>
            value && (
              <span key={key} className="inline-flex items-center px-3 py-1 text-sm font-medium text-gray-700 bg-gray-200 rounded-full">
                {getFilterLabel(key, value)}
                <button
                  type="button"
                  aria-label="Remove filter"
                  onClick={() => onFilterRemove(key)}
                  className="flex-shrink-0 ml-1 text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <Tooltip content="Remove filter" position="bottom">
                    <XCircleIcon className="w-5 h-5" aria-hidden="true" />
                  </Tooltip>
                </button>
              </span>
            )
        )}
      </div>
    </div>
  );
};

export default ActiveFilters;
