import React from "react";

/**
 * SubmitBtn Component
 *
 * A button component that displays a loading spinner while submitting.
 * It disables the button and shows an animated spinner when the `isSubmitting` prop is true.
 *
 * @param {React.ReactNode} children - The content to be displayed inside the button when not submitting.
 * @param {boolean} isSubmitting - Flag to indicate if the submission is in progress.
 * @param {string} [className] - Additional CSS classes for custom styling.
 * @returns {JSX.Element} The rendered button component.
 */
function SubmitBtn({ children, isSubmitting, className = "" }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 flex items-center justify-center ${
        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
      } ${className}`}
    >
      {isSubmitting ? (
        <>
          <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
            ></path>
          </svg>
          Working on...
        </>
      ) : (
        children
      )}
    </button>
  );
}

export default SubmitBtn;
