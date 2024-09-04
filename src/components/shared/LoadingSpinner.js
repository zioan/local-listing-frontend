import React from "react";

function LoadingSpinner({ isLoading }) {
  if (!isLoading) return null;

  return (
    <div className="flex items-center justify-center h-64">
      <div className="w-32 h-32 border-t-2 border-b-2 border-gray-900 rounded-full animate-spin"></div>
    </div>
  );
}

export default LoadingSpinner;
