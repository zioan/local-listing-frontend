import React from "react";

/**
 * FormTextArea Component
 *
 * This component renders a styled textarea with an optional label
 * and customizable props including rows, required status, and additional styling.
 *
 * @param {string} id - Unique identifier for the textarea element.
 * @param {string} name - Name attribute for the textarea element.
 * @param {string} value - Current value of the textarea element.
 * @param {function} onChange - Function to handle changes in the textarea element.
 * @param {string} label - Label for the textarea element.
 * @param {number} rows - Number of rows for the textarea (default is 4).
 * @param {boolean} required - Indicates if the field is required (default is false).
 * @param {string} className - Additional custom classes for styling.
 * @returns JSX.Element
 */
const FormTextArea = ({ id, name, value, onChange, label, rows = 4, required = false, className = "" }) => {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium leading-6 text-gray-900">
        {label}
        {required && <span className="ml-1 text-red-500">*</span>}
      </label>
      <textarea
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className={`block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 ${className}`}
      ></textarea>
    </div>
  );
};

export default FormTextArea;
