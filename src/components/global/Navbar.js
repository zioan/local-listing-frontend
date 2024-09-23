import React, { useState, useEffect } from "react";
import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { HeartIcon, UserIcon, ChatBubbleLeftIcon, HomeIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";
import useMessages from "../../hooks/useMessages";
import MessageModal from "../messaging/MessageModal";
import SearchBox from "../home/SearchBox";

function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const { unreadCount, fetchUnreadCount } = useMessages();
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);

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
            <span className="text-xl font-bold text-white">LogoText</span>
          </div>

          {/* Search Box */}
          <SearchBox />

          {/* Right side icons */}
          <div className="flex items-center space-x-4">
            <NavLink to="/" className="text-gray-300 hover:text-white">
              <HomeIcon className="w-6 h-6" />
            </NavLink>
            {user && (
              <>
                <button onClick={handleFavoriteIconClick} className="text-gray-300 hover:text-white">
                  <HeartIcon className="w-6 h-6" />
                </button>
                <button onClick={() => setIsMessageModalOpen(true)} className="relative text-gray-300 hover:text-white">
                  <ChatBubbleLeftIcon className="w-6 h-6" />
                  {unreadCount > 0 && (
                    <span className="absolute top-0 right-0 flex items-center justify-center w-4 h-4 text-xs text-white bg-red-500 rounded-full">
                      {unreadCount}
                    </span>
                  )}
                </button>
              </>
            )}
            <button onClick={handleUserIconClick} className="text-gray-300 hover:text-white">
              <UserIcon className="w-6 h-6" />
            </button>
          </div>
        </div>
      </div>

      {/* Message Modal */}
      <MessageModal isOpen={isMessageModalOpen} onClose={() => setIsMessageModalOpen(false)} />
    </nav>
  );
}

export default Navbar;
