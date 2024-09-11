import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { Disclosure } from "@headlessui/react";
import { Bars3Icon, XMarkIcon, HeartIcon, UserIcon } from "@heroicons/react/24/outline";
import { useAuth } from "../../context/AuthContext";

const navigation = [
  { name: "Home", href: "/" },
  { name: "About", href: "/about" },
  { name: "Contact", href: "/contact" },
];

function classNames(...classes) {
  return classes.filter(Boolean).join(" ");
}

function Navbar() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handleUserIconClick = () => {
    if (user) {
      navigate("/profile");
    } else {
      navigate("/login");
    }
  };

  const handleFavoriteIconClick = () => {
    if (user) {
      navigate("/favorite");
    }
  };

  return (
    <Disclosure as="nav" className="bg-gray-800">
      {({ open, close }) => (
        <>
          <div className="px-2 mx-auto max-w-7xl sm:px-6 lg:px-8">
            <div className="relative flex items-center justify-between h-16">
              {/* Logo */}
              <div className="flex items-center flex-shrink-0">
                <span className="text-xl font-bold text-white">LogoText</span>
              </div>

              {/* Desktop menu */}
              <div className="flex-grow hidden sm:ml-6 sm:block">
                <div className="flex justify-center space-x-4">
                  {navigation.map((item) => (
                    <NavLink
                      key={item.name}
                      to={item.href}
                      className={({ isActive }) =>
                        classNames(
                          isActive ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
                          "rounded-md px-3 py-2 text-sm font-medium"
                        )
                      }
                    >
                      {item.name}
                    </NavLink>
                  ))}
                </div>
              </div>

              {/* Right side icons and menu button */}
              <div className="flex items-center">
                {user && (
                  <button
                    onClick={handleFavoriteIconClick}
                    className="p-1 text-gray-400 bg-gray-800 rounded-full hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                  >
                    <span className="sr-only">View favorites</span>
                    <HeartIcon className="w-6 h-6" aria-hidden="true" />
                  </button>
                )}
                <button
                  onClick={handleUserIconClick}
                  className="p-1 ml-3 text-gray-400 bg-gray-800 rounded-full hover:text-white focus:outline-none focus:ring-2 focus:ring-white focus:ring-offset-2 focus:ring-offset-gray-800"
                >
                  <span className="sr-only">View profile</span>
                  <UserIcon className="w-6 h-6" aria-hidden="true" />
                </button>
                <Disclosure.Button className="inline-flex items-center justify-center p-2 ml-3 text-gray-400 rounded-md hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white sm:hidden">
                  <span className="sr-only">Open main menu</span>
                  {open ? <XMarkIcon className="block w-6 h-6" aria-hidden="true" /> : <Bars3Icon className="block w-6 h-6" aria-hidden="true" />}
                </Disclosure.Button>
              </div>
            </div>
          </div>

          {/* Mobile menu */}
          <Disclosure.Panel className="sm:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1">
              {navigation.map((item) => (
                <Disclosure.Button key={item.name} as="div" className="w-full">
                  <NavLink
                    to={item.href}
                    className={({ isActive }) =>
                      classNames(
                        isActive ? "bg-gray-900 text-white" : "text-gray-300 hover:bg-gray-700 hover:text-white",
                        "block rounded-md px-3 py-2 text-base font-medium text-center"
                      )
                    }
                    onClick={() => close()}
                  >
                    {item.name}
                  </NavLink>
                </Disclosure.Button>
              ))}
            </div>
          </Disclosure.Panel>
        </>
      )}
    </Disclosure>
  );
}

export default Navbar;
