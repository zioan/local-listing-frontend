import React, { useState, useEffect } from "react";

/**
 * CookiePage component displays information about cookies and local storage
 * used on the Local Listing website.
 *
 * @returns {JSX.Element} The rendered CookiePage component
 */
const CookiePage = () => {
  const [cookieConsent, setCookieConsent] = useState(null);

  useEffect(() => {
    const storedConsent = localStorage.getItem("cookieConsent");
    setCookieConsent(storedConsent);
  }, []);

  const handleAccept = () => {
    localStorage.setItem("cookieConsent", "accepted");
    setCookieConsent("accepted");
  };

  return (
    <div className="container px-4 py-8 mx-auto">
      <h1 className="mb-6 text-3xl font-bold">Cookie and Local Storage Policy</h1>
      <p className="mb-4">
        Local Listing uses cookies and local storage to enhance your experience on our website. This policy explains how we use these technologies.
      </p>

      <h2 className="mb-4 text-2xl font-semibold">What we use</h2>
      <ul className="mb-4 space-y-2 list-disc list-inside">
        <li>
          <strong>Local Storage:</strong> We use local storage to remember your cookie consent preference and to store authentication tokens for
          keeping you logged in.
        </li>
        <li>
          <strong>Session Storage:</strong> We don't currently use session storage in our application.
        </li>
        <li>
          <strong>Cookies:</strong> We use cookies for session management and to enhance site functionality.
        </li>
      </ul>

      <h2 className="mb-4 text-2xl font-semibold">How we use these technologies</h2>
      <ul className="mb-4 space-y-2 list-disc list-inside">
        <li>
          <strong>Authentication:</strong> We use local storage to keep you logged in between sessions.
        </li>
        <li>
          <strong>Preferences:</strong> Your cookie consent choice is stored in local storage.
        </li>
        <li>
          <strong>Functionality:</strong> Cookies help us provide a better user experience by remembering your preferences and settings.
        </li>
      </ul>

      <h2 className="mb-4 text-2xl font-semibold">Your choices</h2>
      <p className="mb-4">
        You can choose to accept or decline the use of cookies and local storage. However, declining may impact the functionality of the website.
      </p>

      <h2 className="mb-4 text-2xl font-semibold">Your current preference</h2>
      <p className="mb-4">
        Your current preference is:
        <strong>{cookieConsent === null ? " Not set" : ` ${cookieConsent}`}</strong>
      </p>
      {cookieConsent !== "accepted" && (
        <div className="flex">
          <button
            onClick={handleAccept}
            className="px-4 py-2 text-white bg-blue-600 rounded hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Accept
          </button>
        </div>
      )}
    </div>
  );
};

export default CookiePage;
