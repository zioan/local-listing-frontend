import React from "react";
import { Link } from "react-router-dom";

const GenericError = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 className="mb-4 text-4xl font-bold">Oops! An Error Occurred</h1>
    <p className="mb-8 text-xl">We're sorry, but something went wrong.</p>
    <Link to="/" className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
      Go to Home
    </Link>
  </div>
);

export default GenericError;
