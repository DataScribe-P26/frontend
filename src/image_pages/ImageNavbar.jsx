import React, { useState, useEffect } from "react";
import { HiAnnotation } from "react-icons/hi";
import {
  FaUserCircle,
  FaCog,
  FaQuestionCircle,
  FaSun,
  FaMoon,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../text_pages/Text/ThemeContext";
import HelpModalImg from "../text_pages/Text/HelpModalImg";

const ImageNavbar = () => {
  const [isHelpOpen, setHelpOpen] = useState(false);
  const [userName, setUserName] = useState("");
  const [showProfile, setShowProfile] = useState(false);
  const navigate = useNavigate();

  const { isDarkMode, toggleTheme } = useTheme();

  // Fetch the username from localStorage
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const name = storedUser.split("@")[0]; // Extract username from email
      setUserName(name);
    }
  }, []);

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    navigate("/login");
  };

  const openHelpModalImg = () => setHelpOpen(true);
  const closeHelpModalImg = () => setHelpOpen(false);

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

        {/* Right side: Icons */}
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
              <div className="w-12 h-6 bg-gray-200 rounded-full peer peer-focus:outline-none dark:bg-gray-700 transition-colors duration-300 flex items-center">
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

          {/* Help Icon */}
          <FaQuestionCircle
            className="text-2xl cursor-pointer hover:text-purple-300 transition-transform duration-300 hover:scale-110"
            onClick={openHelpModalImg}
          />

          {/* User Profile Dropdown */}
          {userName ? (
            <div className="relative">
              <div
                className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center cursor-pointer"
                onClick={() => setShowProfile(!showProfile)}
              >
                {userName.charAt(0).toUpperCase()}
              </div>
              {showProfile && (
                <div className="absolute top-[120%] right-0 mt-2 bg-white text-black shadow-lg rounded-lg p-4">
                  <div className="mb-2 w-[200px] font-semibold text-gray-700">
                    Hello, {userName}!
                  </div>
                  <div
                    className="flex items-center space-x-2 text-red-500 cursor-pointer hover:text-red-600"
                    onClick={handleLogout}
                  >
                    <FaSignOutAlt />
                    <span>Logout</span>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <FaUserCircle className="text-2xl cursor-pointer hover:text-purple-300 transition-transform duration-300 hover:scale-110" />
          )}
        </div>
      </div>
      <HelpModalImg isOpen={isHelpOpen} onClose={closeHelpModalImg} />
    </nav>
  );
};

export default ImageNavbar;
