import React, { useState, useEffect, useRef } from "react";
import { useSearch } from "../../context/SearchContext";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

const SearchModal = ({ isOpen, onClose, children }) => {
  const modalRef = useRef();

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (modalRef.current && !modalRef.current.contains(event.target)) {
        onClose();
      }
    };

    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("keydown", handleEscapeKey);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div ref={modalRef} className="w-full max-w-3xl px-4">
        {children}
      </div>
    </div>
  );
};

const SearchBox = () => {
  const { searchTerm, handleSearch } = useSearch();
  const [localSearchTerm, setLocalSearchTerm] = useState(searchTerm);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(localSearchTerm);
    setIsModalOpen(false);
  };

  const searchInput = (
    <form onSubmit={handleSearchSubmit} className="w-full max-w-[360px] m-auto">
      <div className="relative">
        <input
          type="text"
          value={localSearchTerm}
          onChange={(e) => setLocalSearchTerm(e.target.value)}
          placeholder="Search for items..."
          className="w-full px-4 py-2 text-gray-700 bg-white border-2 border-gray-300 rounded-full focus:outline-none focus:border-blue-500"
        />
        <button
          type="submit"
          className="absolute right-0 px-4 py-2 text-gray-600 transition-colors duration-200 rounded-r-full top-1 hover:text-gray-900 focus:outline-none"
        >
          <MagnifyingGlassIcon className="w-5 h-5" />
        </button>
      </div>
    </form>
  );

  if (isMobile) {
    return (
      <>
        <button onClick={() => setIsModalOpen(true)} className="absolute text-gray-300 right-1/2 hover:text-white">
          <MagnifyingGlassIcon className="w-6 h-6" />
        </button>
        <SearchModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)}>
          {searchInput}
        </SearchModal>
      </>
    );
  }

  return <div className="flex-1 max-w-xl mx-4">{searchInput}</div>;
};

export default SearchBox;
