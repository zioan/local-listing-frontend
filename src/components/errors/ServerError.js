import React from "react";
import { Link } from "react-router-dom";

const ServerError = () => (
  <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
    <h1 className="mb-4 text-4xl font-bold">500 - Server Error</h1>
    <p className="mb-8 text-xl">Oops! Something went wrong on our end.</p>
    <Link to="/" className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
      Go to Home
    </Link>
  </div>
);

export default ServerError;
