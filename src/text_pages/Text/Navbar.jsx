import React, { useState, useEffect } from "react";
import { HiAnnotation } from "react-icons/hi";
import {
  FaUserCircle,
  FaCog,
  FaQuestionCircle,
  FaSun,
  FaMoon,
  FaSignOutAlt, // Add the sign-out icon
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "./ThemeContext"; // Import the Theme Context
import HelpModal from "./HelpModal"; // Import Help Modal

const Navbar = () => {
  const [isHelpOpen, setHelpOpen] = useState(false); // Modal state
  const [userName, setUserName] = useState(""); // State for storing the user name
  const [showProfile, setShowProfile] = useState(false); // State for showing the profile dropdown
  const navigate = useNavigate(); // Hook to navigate to the login page
  const openHelpModal = () => setHelpOpen(true);
  const closeHelpModal = () => setHelpOpen(false);

  const { isDarkMode, toggleTheme } = useTheme(); // Use global theme state

  // Fetch the user name from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const userName = storedUser.split("@")[0]; // Extract the username from the email
      setUserName(userName);
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user"); // Remove the user from localStorage
    navigate("/login"); // Redirect to the login page after logout
  };

  return (
    <nav
      className={`${
        isDarkMode
          ? "bg-gray-900"
          : "bg-gradient-to-r from-purple-700 to-purple-900"
      } text-white px-6 py-5 shadow-lg transition-colors duration-300`}
    >
      <div className="flex items-center justify-between">
        {/* Left side: Datascribe.ai */}
        <Link to="/home" className="flex items-center">
          <HiAnnotation className="mr-3 text-4xl transform transition-transform duration-300 hover:scale-110" />
          <h1 className="text-3xl font-extrabold tracking-wide">
            Datascribe.ai
          </h1>
        </Link>

        {/* Right side: Icons including Help, User, Settings, and Dark Mode Toggle */}
        <div className="flex items-center space-x-10">
          {/* Dark Mode Toggle */}
          <div className="flex items-center space-x-4">
            <FaSun
              className={`text-xl ${
                isDarkMode ? "text-gray-400" : "text-yellow-300"
              }`}
            />
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer focus:outline-none focus:ring-0 active:ring-0"
                checked={isDarkMode}
                onChange={toggleTheme}
              />
              <div className="w-12 h-6 bg-gray-200 rounded-full peer peer-focus:outline-none peer-focus:ring-0 peer-checked:ring-0 dark:bg-gray-700 transition-colors duration-300 flex items-center">
                <div
                  className={`${
                    isDarkMode ? "translate-x-6" : "translate-x-1"
                  } w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300`}
                />
              </div>
            </label>
            <FaMoon
              className={`text-xl ${
                isDarkMode ? "text-purple-300" : "text-gray-400"
              }`}
            />
          </div>

          {/* Help, User, and Settings Icons */}
          <div className="flex items-center space-x-10">
            <FaQuestionCircle
              className="text-2xl cursor-pointer hover:text-purple-300 transition-transform duration-300 hover:scale-110"
              onClick={openHelpModal} // Open modal on click
            />
            <FaCog className="text-2xl cursor-pointer hover:text-purple-300 transition-transform duration-300 hover:scale-110" />

            {/* Display user's name if logged in */}
            {userName ? (
              <div className="relative">
                <div
                  className="flex items-center space-x-2 cursor-pointer"
                  onClick={() => setShowProfile(!showProfile)} // Toggle profile dropdown
                >
                  {/* Display first letter of the username */}
                  <div className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center">
                    {userName.charAt(0).toUpperCase()}
                  </div>
                 
                </div>

                {/* Profile dropdown */}
                {showProfile && (
                  <div className="absolute top-full right-0 mt-2 w-48 bg-white text-black shadow-lg rounded-lg p-4">
                     <span>{userName}</span> {/* Display user name */}
                    <div
                      className="flex items-center space-x-2 cursor-pointer"
                      onClick={handleLogout} // Handle logout on click
                    >
                      <FaSignOutAlt className="text-red-500" />
                      <span className="text-red-500">Logout</span> {/* Logout option */}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <FaUserCircle className="text-2xl cursor-pointer hover:text-purple-300 transition-transform duration-300 hover:scale-110" />
            )}
          </div>
        </div>
      </div>
      <HelpModal isOpen={isHelpOpen} onClose={closeHelpModal} />
    </nav>
  );
};

export default Navbar;
