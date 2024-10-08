import React, { useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSearch } from "../../context/SearchContext";
import { TagIcon, UserIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { SocialLinks } from "../shared/ShareButtons";

const Footer = () => {
  const navigate = useNavigate();
  const { handleSearch } = useSearch();

  /**
   * Handles the click event on a category in the footer.
   * This function performs the following actions:
   * 1. Clears the current search term.
   * 2. Removes all existing filters from sessionStorage.
   * 3. Navigates to the home page with only the selected category as a filter.
   * 4. Sets a new defaultFilters in sessionStorage containing only the selected category.
   * 5. Forces a page reload to ensure all components update with the new filter state.
   *
   * @param {number|string} categoryId - The ID of the selected category.
   */
  const handleCategoryClick = useCallback(
    (categoryId) => {
      handleSearch("");
      sessionStorage.removeItem("defaultFilters");
      navigate(`/?category=${categoryId}`);
      const newFilters = { category: categoryId.toString() };
      sessionStorage.setItem("defaultFilters", JSON.stringify(newFilters));
      window.location.reload();
    },
    [navigate, handleSearch]
  );

  return (
    <footer className="text-white bg-gray-800">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">About Local Listing</h3>
            <p className="text-sm text-gray-400">
              Local Listing connects communities through a user-friendly platform for buying, selling, and discovering local goods and services. Our
              mission is to empower local economies and bring neighbors together.
            </p>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">How It Works</h3>
            <ul className="space-y-2">
              <li>
                <span className="flex items-center text-sm text-gray-400">
                  <UserIcon className="w-5 h-5 mr-2" />
                  Create an account
                </span>
              </li>
              <li>
                <span className="flex items-center text-sm text-gray-400">
                  <TagIcon className="w-5 h-5 mr-2" />
                  Post or browse listings
                </span>
              </li>
              <li>
                <span className="flex items-center text-sm text-gray-400">
                  <CurrencyDollarIcon className="w-5 h-5 mr-2" />
                  Buy, sell, or trade locally
                </span>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Popular Categories</h3>
            <ul className="space-y-2">
              <li>
                <button onClick={() => handleCategoryClick(3)} className="flex items-center text-sm text-gray-400 hover:text-white">
                  <TagIcon className="w-5 h-5 mr-2" />
                  Electronics
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick(4)} className="flex items-center text-sm text-gray-400 hover:text-white">
                  <TagIcon className="w-5 h-5 mr-2" />
                  Home & Garden
                </button>
              </li>
              <li>
                <button onClick={() => handleCategoryClick(5)} className="flex items-center text-sm text-gray-400 hover:text-white">
                  <TagIcon className="w-5 h-5 mr-2" />
                  Services
                </button>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="mb-4 text-lg font-semibold">Connect With Us</h3>
            <p className="mb-4 text-sm text-gray-400">Stay updated with our latest features and local deals!</p>
            <SocialLinks
              facebookUrl="https://facebook.com"
              twitterUrl="https://twitter.com"
              instagramUrl="https://instagram.com"
              linkedinUrl="https://linkedin.com"
            />
          </div>
        </div>

        <div className="flex flex-col items-center justify-between pt-8 mt-8 border-t border-gray-700 md:flex-row">
          <div className="text-base text-gray-400">
            <p>&copy; 2024 Local Listings. All rights reserved.</p>
            <p className="text-center md:text-left">
              Made By{" "}
              <a href="http://ioanzaharia.com" target="_blank" rel="noopener noreferrer" className="underline hover:text-gray-500">
                Ioan Zaharia
              </a>
            </p>
          </div>
          <nav className="flex mt-4 space-x-4 md:mt-0">
            <Link to="/cookies" className="text-sm text-gray-400 hover:text-white">
              Cookies Policy
            </Link>
            <Link to="/privacy" className="text-sm text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-sm text-gray-400 hover:text-white">
              Terms and Conditions
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
