import React from "react";
import "./App.css";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { DataProvider } from "./context/DataContext";
import { WatcherProvider } from "./context/WatcherContext";
import { SearchProvider } from "./context/SearchContext";
import Navbar from "./components/global/Navbar";
import Footer from "./components/global/Footer";
import Home from "./pages/Home";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Login from "./pages/user/Login";
import Register from "./pages/user/Register";
import Profile from "./pages/user/Profile";
import ListingDetail from "./components/listings/ListingDetail";
import EditListing from "./components/listings/EditListing";
import Favorites from "./components/user/Favorites";
import AppInitializer from "./components/AppInitializer";
import PublicProfile from "./components/user/PublicProfile";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import ScrollToTop from "./util/ScrollToTop";
import ErrorBoundary from "./util/ErrorBoundary";

function App() {
  return (
    <ErrorBoundary>
      <WatcherProvider>
        <AuthProvider>
          <DataProvider>
            <SearchProvider>
              <Router>
                <ScrollToTop />
                <AppInitializer>
                  <div className="flex flex-col min-h-screen bg-gray-100">
                    <Navbar />
                    <main className="flex-grow">
                      <Routes>
                        <Route exact path="/" element={<Home />} />
                        <Route exact path="/about" element={<About />} />
                        <Route exact path="/contact" element={<Contact />} />
                        <Route exact path="/login" element={<Login />} />
                        <Route exact path="/register" element={<Register />} />
                        <Route path="/profiles/:username" element={<PublicProfile />} />
                        <Route path="/profile/*" element={<Profile />} />
                        <Route path="/listings/:id" element={<ListingDetail />} />
                        <Route path="/listings/:id/edit" element={<EditListing />} />
                        <Route path="/favorite" element={<Favorites />} />
                        <Route path="*" element={<div>404 Not Found</div>} />
                      </Routes>
                    </main>
                    <Footer />
                  </div>
                  <ToastContainer />
                </AppInitializer>
              </Router>
            </SearchProvider>
          </DataProvider>
        </AuthProvider>
      </WatcherProvider>
    </ErrorBoundary>
  );
}

export default App;
