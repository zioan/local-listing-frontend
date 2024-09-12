import React from "react";
import { XCircleIcon } from "@heroicons/react/24/solid";
import { listingTypeOptions, conditionOptions, deliveryOptions } from "../../util/listingHelpers";

const ActiveFilters = ({ filters, onFilterRemove }) => {
  const getFilterLabel = (key, value) => {
    switch (key) {
      case "listing_type":
        return listingTypeOptions.find((option) => option.value === value)?.label;
      case "condition":
        return conditionOptions.find((option) => option.value === value)?.label;
      case "delivery_option":
        return deliveryOptions.find((option) => option.value === value)?.label;
      case "category":
        return `Category: ${value}`;
      case "subcategory":
        return `Subcategory: ${value}`;
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

  if (Object.keys(filters).length === 0) return null;

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
                  onClick={() => onFilterRemove(key)}
                  className="flex-shrink-0 ml-1 text-gray-400 hover:text-gray-500 focus:outline-none"
                >
                  <XCircleIcon className="w-5 h-5" aria-hidden="true" />
                </button>
              </span>
            )
        )}
      </div>
    </div>
  );
};

export default ActiveFilters;
