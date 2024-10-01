import React from "react";

/**
 * LoadingSpinner component displays a loading spinner when isLoading is true.
 *
 * @param {Object} props - The component props.
 * @param {boolean} props.isLoading - Flag indicating whether to show the spinner.
 * @returns {JSX.Element|null} The loading spinner or null if not loading.
 */
function LoadingSpinner({ isLoading }) {
  // Return null if not loading, preventing the spinner from rendering.
  if (!isLoading) return null;

  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-32 h-32 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
    </div>
  );
}

export default LoadingSpinner;
