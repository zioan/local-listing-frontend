import React from "react";

/**
 * The SubmitBtn component takes two props:
 * - children: The content of the button. This can be a string or any other React component.
 * - isSubmitting: A boolean that indicates whether the form is currently being submitted.
 * This can be handled by using state in the parent component.
 */
function SubmitBtn({ children, isSubmitting }) {
  return (
    <button
      type="submit"
      disabled={isSubmitting}
      className={`w-full px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600 flex items-center justify-center ${
        isSubmitting ? "opacity-50 cursor-not-allowed" : ""
      }`}
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
