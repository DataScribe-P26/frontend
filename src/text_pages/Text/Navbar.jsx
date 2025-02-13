import React, { useState } from "react";
import { HiAnnotation } from "react-icons/hi";
import {
  FaUserCircle,
  FaCog,
  FaQuestionCircle,
  FaSun,
  FaMoon,
  FaSignOutAlt,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { useTheme } from "./ThemeContext";
import HelpModal from "./HelpModal";
import { useAuth } from '../../login/AuthContext';

const Navbar = () => {
  const [isHelpOpen, setHelpOpen] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const { isDarkMode, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  const getDisplayName = () => {
    if (!user) return '';
    if (user.name) return user.name;
    if (user.email) return user.email.split('@')[0];
    return 'User';
  };

  const displayName = getDisplayName();

  // Handle clicking outside profile dropdown
  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (showProfile && !event.target.closest('.profile-container')) {
        setShowProfile(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [showProfile]);

  const openHelpModal = () => setHelpOpen(true);
  const closeHelpModal = () => setHelpOpen(false);

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
          <h1 className="text-3xl font-extrabold tracking-wide">Datascribe.ai</h1>
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

          {/* Help and Settings Icons */}
          <div className="flex items-center space-x-10">
            <FaQuestionCircle
              className="text-2xl cursor-pointer hover:text-purple-300 transition-transform duration-300 hover:scale-110"
              onClick={openHelpModal}
            />
            <FaCog className="text-2xl cursor-pointer hover:text-purple-300 transition-transform duration-300 hover:scale-110" />

            {/* User Profile Section */}
            <div className="relative profile-container">
              {user ? (
                <div className="flex items-center space-x-3">
                  <span className="text-sm font-medium hidden md:block">
                    {displayName}
                  </span>
                  <div
                    className="w-8 h-8 rounded-full bg-purple-500 text-white flex items-center justify-center cursor-pointer hover:bg-purple-400 transition-colors duration-300"
                    onClick={() => setShowProfile(!showProfile)}
                  >
                    {displayName.charAt(0).toUpperCase()}
                  </div>

                  {showProfile && (
                    <div className="absolute top-full right-0 mt-2 bg-white rounded-lg shadow-xl py-2 w-48 z-50">
                      <div className="px-4 py-2 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">{displayName}</p>
                        <p className="text-xs text-gray-500">{user.email}</p>
                      </div>
                      <button
                        onClick={logout}
                        className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-gray-50 flex items-center space-x-2"
                      >
                        <FaSignOutAlt />
                        <span>Logout</span>
                      </button>
                    </div>
                  )}
                </div>
              ) : (
                <FaUserCircle className="text-2xl cursor-pointer hover:text-purple-300 transition-transform duration-300 hover:scale-110" />
              )}
            </div>
          </div>
        </div>
      </div>
      <HelpModal isOpen={isHelpOpen} onClose={closeHelpModal} />
    </nav>
  );
};

export default Navbar;