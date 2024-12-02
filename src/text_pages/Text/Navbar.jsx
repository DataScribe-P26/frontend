import React from "react";
import { HiAnnotation } from "react-icons/hi";
import { FaUserCircle, FaCog, FaQuestionCircle, FaSun, FaMoon } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTheme } from "./ThemeContext"; // Import the Theme Context

const Navbar = () => {
  const { isDarkMode, toggleTheme } = useTheme(); // Use global theme state

  return (
    <nav
      className={`${
        isDarkMode ? "bg-gray-900" : "bg-gradient-to-r from-purple-700 to-purple-900"
      } text-white px-6 py-5 shadow-lg transition-colors duration-300`}
    >
      <div className="flex items-center justify-between">
        {/* Left side: Datascribe.ai */}
        <Link to="/home" className="flex items-center">
          <HiAnnotation className="mr-3 text-4xl transform transition-transform duration-300 hover:scale-110" />
          <h1 className="text-3xl font-extrabold tracking-wide">Datascribe.ai</h1>
        </Link>

        {/* Right side: Icons including Help, User, Settings, and Dark Mode Toggle */}
        <div className="flex items-center space-x-10">
          {/* Dark Mode Toggle */}
          <div className="flex items-center space-x-4">
            <FaSun className={`text-xl ${isDarkMode ? "text-gray-400" : "text-yellow-300"}`} />
            <label className="relative inline-flex items-center cursor-pointer">
              <input
                type="checkbox"
                className="sr-only peer"
                checked={isDarkMode}
                onChange={toggleTheme}
              />
              <div className="w-12 h-6 bg-gray-200 rounded-full peer peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-purple-400 dark:bg-gray-700 transition-colors duration-300">
                <div
                  className={`${
                    isDarkMode ? "translate-x-6" : "translate-x-1"
                  } w-5 h-5 bg-white rounded-full shadow-md transition-transform duration-300`}
                />
              </div>
            </label>
            <FaMoon className={`text-xl ${isDarkMode ? "text-purple-300" : "text-gray-400"}`} />
          </div>

          {/* Help, User, and Settings Icons */}
          <div className="flex items-center space-x-10">
            <FaQuestionCircle
              className="text-2xl cursor-pointer hover:text-purple-300 transition-transform duration-300 hover:scale-110"
            />
            
            <FaCog
              className="text-2xl cursor-pointer hover:text-purple-300 transition-transform duration-300 hover:scale-110"
            />

<FaUserCircle
              className="text-2xl cursor-pointer hover:text-purple-300 transition-transform duration-300 hover:scale-110"
            />
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
