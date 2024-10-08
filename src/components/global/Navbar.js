import React, { useEffect } from "react";
import { NavLink, useNavigate, useLocation, useSearchParams } from "react-router-dom";
import { HeartIcon, UserIcon, ChatBubbleLeftIcon, HomeIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import useMessages from "../../hooks/useMessages";
import SearchBox from "../home/SearchBox";
import Tooltip from "../shared/Tooltip";

function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount, fetchUnreadCount } = useMessages();

  useEffect(() => {
    if (user) {
      fetchUnreadCount();
      const interval = setInterval(fetchUnreadCount, 60000);
      return () => clearInterval(interval);
    }
  }, [user, fetchUnreadCount]);

  const handleUserIconClick = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/login", { state: { from: location } });
    }
  };

  const handleFavoriteIconClick = () => {
    if (user) {
      navigate("/favorite");
    } else {
      navigate("/login", { state: { from: location } });
    }
  };

  return (
    <nav className="sticky top-0 z-50 bg-gray-800">
      <div className="px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <NavLink
              to={location.pathname === "/" ? `${location.pathname}${location.search}` : "/"}
              aria-label="Home"
              className="text-gray-300 hover:text-white"
            >
              Local Listing
            </NavLink>
          </div>

          {/* Search Box */}
          <SearchBox />

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <NavLink
              to={location.pathname === "/" ? `${location.pathname}${location.search}` : "/"}
              aria-label="Home"
              className="text-gray-300 hover:text-white"
            >
              <Tooltip content="Home" position="bottom">
                <HomeIcon className="w-6 h-6" />
              </Tooltip>
            </NavLink>
            {user && (
              <>
                <button onClick={handleFavoriteIconClick} aria-label="Favorites" className="text-gray-300 hover:text-white">
                  <Tooltip content="Favorite" position="bottom">
                    <HeartIcon className="w-6 h-6" />
                  </Tooltip>
                </button>
                <button onClick={() => navigate("/messages")} aria-label="Messages" className="relative text-gray-300 hover:text-white">
                  <Tooltip content="Messages" position="bottom">
                    <ChatBubbleLeftIcon className="w-6 h-6" />
                  </Tooltip>
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </>
            )}
            <button onClick={handleUserIconClick} aria-label="Profile" className="text-gray-300 hover:text-white">
              <Tooltip content={user ? "Profile" : "Log in"} position="bottom">
                <UserIcon className="w-6 h-6" />
              </Tooltip>
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
