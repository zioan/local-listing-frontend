import React from "react";
import { useAuth } from "../../context/AuthContext";
import { Route, Routes, Navigate } from "react-router-dom";
import ProfileSidebar from "../../components/user/ProfileSidebar";
import ProfileView from "../../components/user/ProfileView";
import UpdateProfile from "../../components/user/UpdateProfile";
import MyListings from "../../components/user/MyListings";
import CreateListing from "../../components/listings/CreateListing";
import Favorites from "../../components/user/Favorites";

function Profile() {
  const { user, logout } = useAuth();

  if (!user) {
    return <Navigate to="/login" />;
  }

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="py-10">
        <div className="max-w-3xl mx-auto sm:px-6 lg:max-w-7xl lg:px-8 lg:grid lg:grid-cols-12 lg:gap-8">
          {/* Main content area */}
          <main className="lg:col-span-9 xl:col-span-10">
            <div className="px-4 sm:px-0">
              <Routes>
                <Route path="/" element={<ProfileView user={user} />} />
                <Route path="/update" element={<UpdateProfile />} />
                <Route path="/listings" element={<MyListings />} />
                <Route path="/listings/create" element={<CreateListing />} />
                <Route path="/favorites" element={<Favorites />} />
              </Routes>
            </div>
          </main>

          {/* Right sidebar */}
          <div className="hidden lg:block lg:col-span-3 xl:col-span-2">
            <nav aria-label="Sidebar" className="sticky divide-y divide-gray-300 top-4">
              <ProfileSidebar />
            </nav>
          </div>
        </div>
      </div>

      {/* Logout button */}
      <div className="fixed bottom-4 right-4">
        <button
          onClick={logout}
          className="px-4 py-2 font-bold text-white bg-red-500 rounded-full hover:bg-red-700 focus:outline-none focus:shadow-outline"
        >
          Logout
        </button>
      </div>
    </div>
  );
}

export default Profile;
