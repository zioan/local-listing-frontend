import React, { useState, useEffect, useRef, useCallback } from "react";
import { useSearch } from "../../context/SearchContext";
import { useLocation, useNavigate } from "react-router-dom";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

/**
 * Modal component for displaying search inputs.
 *
 * @param {Object} props - The modal properties.
 * @param {boolean} props.isOpen - Indicates if the modal is open.
 * @param {Function} props.onClose - Function to call when the modal is closed.
 * @param {React.ReactNode} props.children - Content to render inside the modal.
 * @returns {JSX.Element|null} The rendered modal or null if not open.
 */
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

/**
 * SearchBox component for searching items in the application.
 *
 * It displays an input field for search terms and a button to submit the search.
 * The input is responsive and switches to a modal view on mobile devices.
 *
 * @returns {JSX.Element} The rendered search box.
 */
const SearchBox = () => {
  const { searchTerm, handleSearch } = useSearch();
  const [localSearchTerm, setLocalSearchTerm] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const isInitialMount = useRef(true);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  /**
   * Updates the search parameters in the URL and session storage.
   *
   * @param {string} search - The search term to update in the URL.
   */
  const updateSearchParams = useCallback(
    (search) => {
      const searchParams = new URLSearchParams(location.search);
      for (let [key, value] of searchParams.entries()) {
        if (value === "") {
          searchParams.delete(key);
        }
      }
      if (search) {
        searchParams.set("search", search);
      } else {
        searchParams.delete("search");
      }
      navigate(`?${searchParams.toString()}`, { replace: true });

      // Update sessionStorage
      const currentFilters = JSON.parse(sessionStorage.getItem("defaultFilters") || "{}");
      const updatedFilters = { ...currentFilters, search };
      sessionStorage.setItem("defaultFilters", JSON.stringify(updatedFilters));
    },
    [location.search, navigate]
  );

  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      const searchParams = new URLSearchParams(location.search);
      const searchFromUrl = searchParams.get("search") || "";
      setLocalSearchTerm(searchFromUrl);
      if (searchFromUrl !== searchTerm) {
        handleSearch(searchFromUrl);
      }
    }
  }, [location.search, searchTerm, handleSearch]);

  useEffect(() => {
    setLocalSearchTerm(searchTerm);
  }, [searchTerm]);

  /**
   * Handles the submission of the search form.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    handleSearch(localSearchTerm);
    setIsModalOpen(false);
    updateSearchParams(localSearchTerm);
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
