import React from "react";

const SkeletonLoader = ({ count = 1 }) => {
  return (
    <div className="grid grid-cols-2 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
      {[...Array(count)].map((_, i) => (
        <div key={i} className="p-4 bg-white rounded-lg shadow animate-pulse">
          <div className="h-40 mb-4 bg-gray-300 rounded-md"></div>
          <div className="h-4 mb-2 bg-gray-300 rounded"></div>
          <div className="w-5/6 h-4 bg-gray-300 rounded"></div>
        </div>
      ))}
    </div>
  );
};

export default SkeletonLoader;
