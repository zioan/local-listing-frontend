import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

/**
 * CookieBanner component displays a banner for cookie consent.
 * It allows users to accept or decline cookies and provides a link to the cookie policy.
 * The component manages its own state and persists the user's choice in localStorage.
 *
 * @returns {JSX.Element|null} The rendered CookieBanner component or null if consent is already set
 */
const CookieBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consentStatus = localStorage.getItem("cookieConsent");
    if (consentStatus === null || consentStatus === "declined") {
      setIsVisible(true);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem("cookieConsent", "declined");
    setIsVisible(false);
  };

  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center">
      <div className="absolute inset-0 bg-black opacity-50 backdrop-blur-sm"></div>
      <div className="relative w-full bg-white shadow-lg">
        <div className="container px-4 py-4 mx-auto sm:px-6 lg:px-8">
          <div className="flex flex-col items-center justify-between sm:flex-row">
            <div className="mb-4 text-center sm:mb-0 sm:text-left">
              <p className="text-sm text-gray-700">
                We use cookies and local storage to enhance your experience on our website. By accepting, you agree to our use of cookies and local
                storage for authentication and preferences.
              </p>
              <Link to="/cookies" className="text-sm text-blue-600 hover:text-blue-800">
                Cookie Policy
              </Link>
            </div>
            <div className="flex space-x-4">
              <button
                onClick={handleDecline}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-200 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Accept
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CookieBanner;
