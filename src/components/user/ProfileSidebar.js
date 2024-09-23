import React from "react";
import { Link, useLocation } from "react-router-dom";
import {
  UserIcon,
  PencilIcon,
  ClipboardDocumentListIcon,
  PlusCircleIcon,
  HeartIcon,
  HomeIcon,
  ArrowRightOnRectangleIcon,
} from "@heroicons/react/24/outline";

const menuItems = [
  { name: "Home", path: "/", icon: HomeIcon },
  { name: "Profile Overview", path: "/profile", icon: UserIcon },
  { name: "Update Profile", path: "/profile/update", icon: PencilIcon },
  { name: "My Listings", path: "/profile/listings", icon: ClipboardDocumentListIcon },
  { name: "Create Listing", path: "/profile/listings/create", icon: PlusCircleIcon },
  { name: "Favorites", path: "/profile/favorites", icon: HeartIcon },
];

const ProfileSidebar = ({ isMobile = false, onLogout }) => {
  const location = useLocation();

  const renderMenuItem = (item) => {
    const isActive = location.pathname === item.path;
    const IconComponent = item.icon;

    return (
      <Link
        key={item.name}
        to={item.path}
        className={`
          group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full
          ${isActive ? "bg-gray-100 text-gray-900" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}
          ${isMobile ? "justify-center" : ""}
        `}
      >
        <IconComponent
          className={`
            flex-shrink-0 w-6 h-6
            ${isActive ? "text-gray-500" : "text-gray-400 group-hover:text-gray-500"}
            ${isMobile ? "" : "mr-3"}
          `}
        />
        {!isMobile && <span>{item.name}</span>}
      </Link>
    );
  };

  const renderLogoutButton = () => (
    <button
      onClick={onLogout}
      className={`
        group flex items-center px-3 py-2 text-sm font-medium rounded-md w-full
        text-gray-600 hover:bg-gray-50 hover:text-gray-900
        ${isMobile ? "justify-center" : ""}
      `}
    >
      <ArrowRightOnRectangleIcon
        className={`
          flex-shrink-0 w-6 h-6
          text-gray-400 group-hover:text-gray-500
          ${isMobile ? "" : "mr-3"}
        `}
      />
      {!isMobile && <span>Logout</span>}
    </button>
  );

  if (isMobile) {
    return (
      <div className="fixed inset-x-0 bottom-0 flex items-center justify-between px-4 py-2 bg-white border-t border-gray-200">
        {menuItems.map(renderMenuItem)}
        {renderLogoutButton()}
      </div>
    );
  }

  return (
    <div className="p-4 space-y-1 bg-white rounded-lg shadow">
      <nav className="space-y-1">{menuItems.map(renderMenuItem)}</nav>
      <div className="pt-4 mt-4 border-t border-gray-200">{renderLogoutButton()}</div>
    </div>
  );
};

export default ProfileSidebar;
