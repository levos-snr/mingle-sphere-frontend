import React, { useState, useRef, useEffect } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { User, LogOut, Settings, Heart, ChevronDown, Bell } from "lucide-react";
import logo from "../assets/logo.png";

const Navbar = () => {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Get the user data from localStorage
  const user = JSON.parse(localStorage.getItem('user'));

  const handleSignOut = () => {
    localStorage.removeItem('user');
    navigate('/login');
    window.location.reload();
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="bg-gray-900 border-b border-gray-700">
      <div className="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <NavLink
          to="/"
          className="flex items-center space-x-3 rtl:space-x-reverse transform transition-transform duration-300 hover:scale-110"
        >
          <img src={logo} className="h-10" alt="Logo" />
          <span className="self-center text-2xl font-semibold whitespace-nowrap text-orange-500">
            mingleSphere
          </span>
        </NavLink>

        {/* New navigation links */}
        <div className="hidden md:flex items-center space-x-4">
          <NavLink
            to="/allEvent"
            className="text-gray-300 hover:text-orange-500 transition duration-150 ease-in-out"
          >
            All Events
          </NavLink>
          <NavLink
            to="/community"
            className="text-gray-300 hover:text-orange-500 transition duration-150 ease-in-out"
          >
            Community
          </NavLink>
          <NavLink
            to="/map"
            className="text-gray-300 hover:text-orange-500 transition duration-150 ease-in-out"
          >
            Map
          </NavLink>
        </div>

        <div className="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse gap-3 items-center">
          {user ? (
            <>
              {/* Notification icon for authenticated users */}
              <button className="text-gray-400 hover:text-orange-500 focus:outline-none transition-transform transform duration-200 ease-in-out">
                <Bell className="w-6 h-6" />
              </button>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setIsOpen(!isOpen)}
                  className="flex items-center space-x-2 text-gray-400 hover:text-orange-500 focus:outline-none transition-transform transform duration-200 ease-in-out"
                >
                  <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800">
                    {user.profile_photo_url ? (
                      <img
                        src={user.profile_photo_url}
                        alt="Profile"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="w-full h-full text-gray-500" />
                    )}
                  </div>
                  <span className="hidden md:inline">{user.name}</span>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      isOpen ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                {isOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-md overflow-hidden shadow-xl z-10 animate-fadeIn">
                    <div className="px-4 py-2 border-b border-gray-700">
                      <p className="text-sm font-medium text-gray-400">
                        {user.name}
                      </p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <NavLink
                      to="/settings"
                      className="block px-4 py-2 text-sm text-gray-400 hover:bg-gray-700 hover:text-orange-500 transition duration-150 ease-in-out"
                    >
                      <Settings className="inline-block w-4 h-4 mr-2" />
                      Settings
                    </NavLink>
                    <NavLink
                      to="/preferences"
                      className="block px-4 py-2 text-sm text-gray-400 hover:bg-gray-700 hover:text-orange-500 transition duration-150 ease-in-out"
                    >
                      <Heart className="inline-block w-4 h-4 mr-2" />
                      Preferences
                    </NavLink>
                    <button
                      onClick={handleSignOut}
                      className="block w-full text-left px-4 py-2 text-sm text-red-500 hover:bg-red-600 hover:text-white transition duration-150 ease-in-out"
                    >
                      <LogOut className="inline-block w-4 h-4 mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <>
              <NavLink
                to="/signup"
                className="text-white bg-gray-700 hover:bg-orange-500 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-4 py-2 text-center transition duration-150 ease-in-out"
              >
                Sign up
              </NavLink>
              <NavLink
                to="/login"
                className="flex items-center text-white bg-orange-500 hover:bg-orange-600 focus:ring-4 focus:outline-none focus:ring-orange-300 font-medium rounded-lg text-sm px-4 py-2 text-center transition duration-150 ease-in-out"
              >
                <User className="mr-2" />
                Login
              </NavLink>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;