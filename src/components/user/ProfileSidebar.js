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
  LockClosedIcon,
} from "@heroicons/react/24/outline";

// Define menu items with name, path, and icon
const menuItems = [
  { name: "Home", path: "/", icon: HomeIcon },
  { name: "Profile Overview", path: "/profile", icon: UserIcon },
  { name: "Update Profile", path: "/profile/update", icon: PencilIcon },
  { name: "Change Password", path: "/profile/change-password", icon: LockClosedIcon },
  { name: "My Listings", path: "/profile/listings", icon: ClipboardDocumentListIcon },
  { name: "Create Listing", path: "/profile/listings/create", icon: PlusCircleIcon },
  { name: "Favorites", path: "/profile/favorites", icon: HeartIcon },
];

/**
 * ProfileSidebar component displays the navigation sidebar for the user profile.
 *
 * It renders menu items for various profile-related actions and a logout button.
 *
 * @param {Object} props
 * @param {boolean} [props.isMobile=false] - Indicates if the sidebar is in mobile view.
 * @param {function} props.onLogout - Callback function to handle user logout.
 * @returns {JSX.Element} The ProfileSidebar component.
 */
const ProfileSidebar = ({ isMobile = false, onLogout }) => {
  const location = useLocation();

  /**
   * Renders a single menu item for the sidebar.
   *
   * @param {Object} item - The menu item data.
   * @returns {JSX.Element} The rendered menu item link.
   */
  const renderMenuItem = (item) => {
    const isActive = location.pathname === item.path; // Determine if the item is active
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
        {!isMobile && <span>{item.name}</span>} {/* Display name only in desktop view */}
      </Link>
    );
  };

  /**
   * Renders the logout button for the sidebar.
   *
   * @returns {JSX.Element} The rendered logout button.
   */
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
      {!isMobile && <span>Logout</span>} {/* Display name only in desktop view */}
    </button>
  );

  // Render mobile view for the sidebar
  if (isMobile) {
    return (
      <div className="fixed inset-x-0 bottom-0 flex items-center justify-between px-4 py-2 bg-white border-t border-gray-200">
        {menuItems.map(renderMenuItem)}
        {renderLogoutButton()}
      </div>
    );
  }

  // Render desktop view for the sidebar
  return (
    <div className="p-4 space-y-1 bg-white rounded-lg shadow">
      <nav className="space-y-1">{menuItems.map(renderMenuItem)}</nav>
      <div className="pt-4 mt-4 border-t border-gray-200">{renderLogoutButton()}</div>
    </div>
  );
};

export default ProfileSidebar;
