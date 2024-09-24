import React from "react";
import { Link } from "react-router-dom";

const ForbiddenError = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 className="mb-4 text-4xl font-bold">403 - Forbidden</h1>
    <p className="mb-8 text-xl">You don't have permission to access this resource.</p>
    <Link to="/" className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
      Go to Home
    </Link>
  </div>
);

export default ForbiddenError;
