import React from "react";

/**
 * FormSelect Component
 *
 * This component renders a styled select dropdown with an optional label
 * and customizable props including options, required status, and additional styling.
 *
 * @param {string} id - Unique identifier for the select element.
 * @param {string} name - Name attribute for the select element.
 * @param {string} value - Current value of the select element.
 * @param {function} onChange - Function to handle changes in the select element.
 * @param {string} label - Label for the select element.
 * @param {Array} options - Array of options to populate the select dropdown.
 * @param {boolean} required - Indicates if the field is required (default is false).
 * @param {string} className - Additional custom classes for styling.
 * @returns JSX.Element
 */
const FormSelect = ({ id, name, value, onChange, label, options, required = false, className = "" }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <select
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        className={`block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:max-w-xs sm:text-sm sm:leading-6 ${className}`}
      >
        <option value="">Select {label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FormSelect;
