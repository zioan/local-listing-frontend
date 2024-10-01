import React from "react";

/**
 * FormInput Component
 *
 * This component renders a styled input field with an optional label, error message,
 * and customizable props such as type, required status, and autoComplete.
 *
 * @param {string} id - Unique identifier for the input field.
 * @param {string} name - Name attribute for the input field.
 * @param {string} value - Current value of the input field.
 * @param {function} onChange - Function to handle changes in the input field.
 * @param {string} label - Label for the input field.
 * @param {string} type - Type of the input field (default is "text").
 * @param {boolean} required - Indicates if the field is required (default is false).
 * @param {string} autoComplete - Auto-complete attribute for the input field (default is "off").
 * @param {string} error - Error message to be displayed if applicable.
 * @param {string} className - Additional custom classes for styling.
 * @returns JSX.Element
 */
const FormInput = ({ id, name, value, onChange, label, type = "text", required = false, autoComplete = "off", error, className = "" }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <input
        type={type}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        autoComplete={autoComplete}
        className={`block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ${
          error ? "ring-red-500" : "ring-gray-300"
        } placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${className}`}
      />
      {error && <p className="mt-2 text-sm text-red-600">{error}</p>}
    </div>
  );
};

export default FormInput;
