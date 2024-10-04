import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Route, Routes, Navigate } from "react-router-dom";
import ProfileSidebar from "../../components/user/ProfileSidebar";
import ProfileView from "../../components/user/ProfileView";
import UpdateProfile from "../../components/user/UpdateProfile";
import MyListings from "../../components/user/MyListings";
import CreateListing from "../../components/listings/CreateListing";
import Favorites from "../../components/user/Favorites";
import ChangePassword from "../../components/user/ChangePassword";

/**
 * Profile component that displays user profile information and related features.
 * Routes are nested for different profile-related views.
 */
function Profile() {
  const { user, logout } = useAuth();

  // Redirect to login if the user is not authenticated
  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <div className="max-w-3xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8">
          <div className="lg:grid lg:grid-cols-12 lg:gap-8">
            {/* Main content area */}
            <main className="lg:col-span-9">
              <div className="px-4 sm:px-0">
                <Routes>
                  <Route path="/" element={<ProfileView user={user} />} />
                  <Route path="/update" element={<UpdateProfile />} />
                  <Route path="/listings" element={<MyListings />} />
                  <Route path="/listings/create" element={<CreateListing />} />
                  <Route path="/favorites" element={<Favorites />} />
                  <Route path="/change-password" element={<ChangePassword />} />
                </Routes>
              </div>
            </main>

            {/* Right sidebar for desktop */}
            <div className="hidden lg:block lg:col-span-3">
              <nav aria-label="Sidebar" className="sticky top-4">
                <ProfileSidebar onLogout={logout} />
              </nav>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile bottom bar */}
      <div className="lg:hidden">
        <ProfileSidebar isMobile={true} onLogout={logout} />
      </div>
    </div>
  );
}

export default Profile;
