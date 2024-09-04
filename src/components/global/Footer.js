import React from "react";
import { Link } from "react-router-dom";
import { HomeIcon, InformationCircleIcon, PhoneIcon, UserIcon, HeartIcon, PlusIcon } from "@heroicons/react/24/outline";

const Footer = () => {
  return (
    <footer className="text-white bg-gray-800">
      <div className="px-4 py-12 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div>
            <h3 className="mb-4 text-lg font-semibold">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/" className="flex items-center hover:text-gray-300">
                  <HomeIcon className="w-5 h-5 mr-2" />
                  Home
                </Link>
              </li>
              <li>
                <Link to="/about" className="flex items-center hover:text-gray-300">
                  <InformationCircleIcon className="w-5 h-5 mr-2" />
                  About Us
                </Link>
              </li>
              <li>
                <Link to="/contact" className="flex items-center hover:text-gray-300">
                  <PhoneIcon className="w-5 h-5 mr-2" />
                  Contact
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">User</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/profile" className="flex items-center hover:text-gray-300">
                  <UserIcon className="w-5 h-5 mr-2" />
                  My Profile
                </Link>
              </li>
              <li>
                <Link to="/listings/create" className="flex items-center hover:text-gray-300">
                  <PlusIcon className="w-5 h-5 mr-2" />
                  Post a Listing
                </Link>
              </li>
              <li>
                <Link to="/favorites" className="flex items-center hover:text-gray-300">
                  <HeartIcon className="w-5 h-5 mr-2" />
                  My Favorites
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Categories</h3>
            <ul className="space-y-2">
              <li>
                <Link to="/category/electronics" className="hover:text-gray-300">
                  Electronics
                </Link>
              </li>
              <li>
                <Link to="/category/furniture" className="hover:text-gray-300">
                  Furniture
                </Link>
              </li>
              <li>
                <Link to="/category/clothing" className="hover:text-gray-300">
                  Clothing
                </Link>
              </li>
              <li>
                <Link to="/category/vehicles" className="hover:text-gray-300">
                  Vehicles
                </Link>
              </li>
            </ul>
          </div>
          <div>
            <h3 className="mb-4 text-lg font-semibold">Connect With Us</h3>
            <p className="mb-4">Stay updated with our latest deals and news!</p>
            <div className="flex space-x-4">
              <a href="#" className="text-white hover:text-gray-300">
                <span className="sr-only">Facebook</span>
                FB
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <span className="sr-only">Instagram</span>
                IG
              </a>
              <a href="#" className="text-white hover:text-gray-300">
                <span className="sr-only">Twitter</span>
                TW
              </a>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center justify-between pt-8 mt-8 border-t border-gray-700 md:flex-row">
          <p className="text-base text-gray-400">&copy; 2024 Local Listings. All rights reserved.</p>
          <nav className="flex mt-4 space-x-4 md:mt-0">
            <Link to="/privacy" className="text-base text-gray-400 hover:text-white">
              Privacy Policy
            </Link>
            <Link to="/terms" className="text-base text-gray-400 hover:text-white">
              Terms of Service
            </Link>
          </nav>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
