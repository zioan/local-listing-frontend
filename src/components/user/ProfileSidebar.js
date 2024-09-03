import React from "react";
import { Link, useLocation } from "react-router-dom";

const ProfileSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { name: "Profile Overview", path: "/profile" },
    { name: "Update Profile", path: "/profile/update" },
    { name: "My Listings", path: "/profile/listings" },
    { name: "Create Listing", path: "/profile/listings/create" },
    { name: "Favorites", path: "/profile/favorites" },
  ];

  return (
    <nav className="overflow-hidden bg-white rounded-lg shadow">
      <div className="px-4 py-5 sm:p-6">
        <h2 className="mb-4 text-lg font-medium text-gray-900">Profile Menu</h2>
        <div className="space-y-1">
          {menuItems.map((item) => (
            <Link
              key={item.name}
              to={item.path}
              className={`${
                location.pathname === item.path ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
              } group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full`}
            >
              {item.name}
            </Link>
          ))}
        </div>
      </div>
    </nav>
  );
};

export default ProfileSidebar;
