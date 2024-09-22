import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";
import FormInput from "../shared/form/FormInput";

const HeroSection = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();

  const handleSearch = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
    navigate(`/?search=${encodeURIComponent(searchTerm)}`);
  };

  return (
    <div className="text-white bg-gradient-to-r from-blue-500 to-purple-600">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8 sm:py-24">
        <h1 className="mb-4 text-3xl font-extrabold text-center sm:text-4xl md:text-5xl lg:text-6xl">Find Your Perfect Local Deal</h1>
        <p className="mb-8 text-xl text-center">Discover amazing items in your neighborhood</p>
        <div className="max-w-3xl mx-auto">
          <form onSubmit={handleSearch} className="flex items-center gap-2">
            <div className="flex-grow">
              <FormInput
                id="search"
                name="search"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search for items..."
              />
            </div>
            <button
              type="submit"
              className="inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-yellow-400 border border-transparent rounded-md hover:bg-yellow-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 h-[38px]"
            >
              <MagnifyingGlassIcon className="w-5 h-5" aria-hidden="true" />
              <span className="hidden ml-2 sm:inline">Search</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default HeroSection;
