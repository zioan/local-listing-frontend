import React from "react";

/**
 * ProfileView component displays the user's profile information.
 *
 * @param {Object} props - The component props.
 * @param {Object} props.user - The user object containing profile data.
 * @returns {JSX.Element} The ProfileView component.
 */
const ProfileView = ({ user }) => {
  return (
    <div className="my-10 overflow-hidden bg-white shadow sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg font-medium leading-6 text-gray-900">User Profile</h3>
      </div>
      <div className="border-t border-gray-200">
        <dl>
          {/* User's Username */}
          <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Username</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.username}</dd>
          </div>
          {/* User's Email */}
          <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Email address</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.email}</dd>
          </div>
          {/* User's Street Address */}
          <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">Street</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.street || "Not provided"}</dd>
          </div>
          {/* User's ZIP Code */}
          <div className="px-4 py-5 bg-white sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">ZIP Code</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.zip || "Not provided"}</dd>
          </div>
          {/* User's City */}
          <div className="px-4 py-5 bg-gray-50 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
            <dt className="text-sm font-medium text-gray-500">City</dt>
            <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{user.city || "Not provided"}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
};

export default ProfileView;
