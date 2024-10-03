import React from "react";
import { Link } from "react-router-dom";
import { TagIcon, UserIcon, CurrencyDollarIcon } from "@heroicons/react/24/outline";
import { SocialLinks } from "../shared/ShareButtons";

const Footer = () => {
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
                <Link to="/category/electronics" className="flex items-center text-sm text-gray-400 hover:text-white">
                  <TagIcon className="w-5 h-5 mr-2" />
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/category/home-garden" className="flex items-center text-sm text-gray-400 hover:text-white">
                  <TagIcon className="w-5 h-5 mr-2" />
                  Home & Garden
                </Link>
              </li>
              <li>
                <Link to="/category/services" className="flex items-center text-sm text-gray-400 hover:text-white">
                  <TagIcon className="w-5 h-5 mr-2" />
                  Services
                </Link>
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
          <p className="text-base text-gray-400">&copy; 2024 Local Listings. All rights reserved.</p>
          <nav className="flex mt-4 space-x-4 md:mt-0">
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
