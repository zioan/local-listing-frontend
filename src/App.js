import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes, useNavigate } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { WatcherProvider } from "./context/WatcherContext";
import { SearchProvider } from "./context/SearchContext";
import { appSettings } from "./config/settings";
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
import AppInitializer from "./components/AppInitializer";
import PublicProfile from "./components/user/PublicProfile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./util/ScrollToTop";
import { ErrorBoundary } from "./util/ErrorBoundary";
import { ErrorProvider } from "./context/ErrorContext";
import UnauthorizedError from "./components/errors/UnauthorizedError";
import ForbiddenError from "./components/errors/ForbiddenError";
import NotFoundError from "./components/errors/NotFoundError";
import ServerError from "./components/errors/ServerError";
import GenericError from "./components/errors/GenericError";
import AuthRoute from "./util/AuthRoute";

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
                      <Routes>
                        <Route exact path="/" element={<Home />} />
                        <Route
                          path="/login"
                          element={
                            <AuthRoute authRequired={false}>
                              <Login />
                            </AuthRoute>
                          }
                        />
                        <Route
                          path="/register"
                          element={
                            <AuthRoute authRequired={false}>
                              <Register />
                            </AuthRoute>
                          }
                        />
                        <Route path="/forgot-password" element={<ForgotPassword />} />
                        <Route path="/reset-password/:token" element={<ResetPassword />} />
                        <Route path="/profiles/:username" element={<PublicProfile />} />
                        <Route
                          path="/profile/*"
                          element={
                            <AuthRoute authRequired={true}>
                              <Profile />
                            </AuthRoute>
                          }
                        />
                        <Route path="/listings/:id" element={<ListingDetail />} />
                        <Route path="/listings/:id/edit" element={<EditListing />} />
                        <Route path="/favorite" element={<Favorites />} />
                        <Route path="/unauthorized" element={<UnauthorizedError />} />
                        <Route path="/forbidden" element={<ForbiddenError />} />
                        <Route path="/not-found" element={<NotFoundError />} />
                        <Route path="/server-error" element={<ServerError />} />
                        <Route path="/error" element={<GenericError />} />
                        <Route path="*" element={<NotFoundError />} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
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
