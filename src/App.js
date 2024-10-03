import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";

// context providers
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { WatcherProvider } from "./context/WatcherContext";
import { SearchProvider } from "./context/SearchContext";
import { ErrorProvider } from "./context/ErrorContext";

// utils
import AppInitializer from "./components/AppInitializer";
import AuthRoute from "./util/AuthRoute";
import ScrollToTop from "./util/ScrollToTop";
import { appSettings } from "./config/settings";
import { ErrorBoundary } from "./util/ErrorBoundary";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// components
import Navbar from "./components/global/Navbar";
import Footer from "./components/global/Footer";
import Home from "./pages/Home";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import ForgotPassword from "./pages/user/ForgotPassword";
import ResetPassword from "./pages/user/ResetPassword";
import Profile from "./pages/user/Profile";
import ListingDetail from "./components/listings/ListingDetail";
import EditListing from "./components/listings/EditListing";
import Favorites from "./components/user/Favorites";
import PublicProfile from "./components/user/PublicProfile";
import CookieBanner from "./components/cookies/CookieBanner";
import CookiePage from "./pages/CookiePage";
import TermsAndConditions from "./pages/TermsAndConditions";

// error components
import NotFoundError from "./components/errors/NotFoundError";
import UnauthorizedError from "./components/errors/UnauthorizedError";
import ForbiddenError from "./components/errors/ForbiddenError";
import ServerError from "./components/errors/ServerError";
import GenericError from "./components/errors/GenericError";

const routes = [
  { path: "/", element: <Home />, authRequired: null },
  { path: "/login", element: <Login />, authRequired: false },
  { path: "/register", element: <Register />, authRequired: false },
  { path: "/forgot-password", element: <ForgotPassword />, authRequired: false },
  { path: "/reset-password/:token", element: <ResetPassword />, authRequired: false },
  { path: "/profile/*", element: <Profile />, authRequired: true },
  { path: "/listings/:id", element: <ListingDetail />, authRequired: null },
  { path: "/listings/:id/edit", element: <EditListing />, authRequired: true },
  { path: "/favorite", element: <Favorites />, authRequired: true },
  { path: "/profiles/:username", element: <PublicProfile />, authRequired: null },
  { path: "/unauthorized", element: <UnauthorizedError />, authRequired: null },
  { path: "/forbidden", element: <ForbiddenError />, authRequired: null },
  { path: "/server-error", element: <ServerError />, authRequired: null },
  { path: "/error", element: <GenericError />, authRequired: null },
  { path: "/cookies", element: <CookiePage />, authRequired: null },
  { path: "/terms", element: <TermsAndConditions />, authRequired: null },
  { path: "*", element: <NotFoundError />, authRequired: null },
];

const AppRoutes = () => (
  <Routes>
    {routes.map(({ path, element, authRequired }) => (
      <Route key={path} path={path} element={authRequired !== null ? <AuthRoute authRequired={authRequired}>{element}</AuthRoute> : element} />
    ))}
  </Routes>
);

const AppContent = () => {
  const navigate = useNavigate();

  return (
    <ErrorProvider navigate={navigate}>
      <ErrorBoundary>
        <WatcherProvider>
          <AuthProvider>
            <DataProvider>
              <SearchProvider>
                <ScrollToTop />
                <AppInitializer>
                  <div className="flex flex-col min-h-screen bg-gray-100">
                    <Navbar />
                    <main className="flex-grow">
                      <AppRoutes />
                    </main>
                    <Footer />
                  </div>
                  <CookieBanner />
                  <ToastContainer autoClose={appSettings.toastDuration} />
                </AppInitializer>
              </SearchProvider>
            </DataProvider>
          </AuthProvider>
        </WatcherProvider>
      </ErrorBoundary>
    </ErrorProvider>
  );
};

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;
